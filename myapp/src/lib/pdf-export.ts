import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ExportPdfOptions = {
  elementId?: string;
  elementIds?: string[];
  fileName: string;
  pageMarginMm?: number;
  orientation?: "p" | "l";
  format?: "a4" | "a3";
  imageScale?: number;
  paginateByChildren?: boolean;
  exportWidthPx?: number;
};

function sanitizeFileName(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || "document";
}

function waitForImages(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));

  return Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        })
    )
  );
}

/**
 * Snapshot all canvases in the ORIGINAL live DOM container into data URLs,
 * indexed by their position among all canvases in that container.
 * Returns a map of index → dataURL.
 */
function snapshotCanvases(container: HTMLElement): Map<number, string> {
  const map = new Map<number, string>();
  const canvases = Array.from(container.querySelectorAll("canvas"));

  canvases.forEach((canvas, index) => {
    try {
      const dataUrl = canvas.toDataURL("image/png");
      // A blank canvas produces a specific small base64 — skip those
      if (dataUrl && dataUrl.length > 200) {
        map.set(index, dataUrl);
      }
    } catch {
      // cross-origin or tainted canvas — skip
    }
  });

  return map;
}

/**
 * After cloning, replace all empty <canvas> elements in the cloned container
 * with <img> tags using the pre-snapshotted data URLs from the original DOM.
 * Uses positional index matching — clone canvas[N] gets snapshot[N].
 */
function injectCanvasSnapshots(
  clonedContainer: HTMLElement,
  snapshots: Map<number, string>,
  originalContainer: HTMLElement
): void {
  if (snapshots.size === 0) return;

  const originalCanvases = Array.from(originalContainer.querySelectorAll("canvas"));
  const clonedCanvases = Array.from(clonedContainer.querySelectorAll("canvas"));

  clonedCanvases.forEach((clonedCanvas, index) => {
    const dataUrl = snapshots.get(index);
    if (!dataUrl) return;

    const originalCanvas = originalCanvases[index];
    const img = document.createElement("img");
    img.src = dataUrl;

    // Match the original canvas dimensions
    const w = originalCanvas?.offsetWidth || clonedCanvas.width || 300;
    const h = originalCanvas?.offsetHeight || clonedCanvas.height || 150;
    img.style.width = `${w}px`;
    img.style.height = `${h}px`;
    img.style.display = "block";
    img.width = w;
    img.height = h;

    clonedCanvas.parentNode?.replaceChild(img, clonedCanvas);
  });
}

function buildPaginatedTargets(
  container: HTMLElement,
  pageAspectRatio: number,
  exportWidthPx: number,
  canvasSnapshots: Map<number, string>
) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-100000px";
  host.style.top = "0";
  host.style.width = `${exportWidthPx}px`;
  host.style.pointerEvents = "none";
  host.style.opacity = "0";
  host.style.zIndex = "-1";
  document.body.appendChild(host);

  const pageHeightPx = Math.floor(exportWidthPx * pageAspectRatio);
  const sourceBlocks = Array.from(container.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.html2canvasIgnore !== "true"
  );

  const pages: HTMLElement[] = [];

  const createPage = () => {
    const page = document.createElement("div");
    page.className = "pdf-page-shell";
    page.style.width = `${exportWidthPx}px`;
    page.style.minHeight = `${pageHeightPx}px`;
    page.style.overflow = "visible";    // override CSS overflow:hidden
    page.style.background = "#eef3f8";
    page.style.boxSizing = "border-box";
    page.style.padding = "18px";
    page.setAttribute("data-pdf-generated-page", "true");
    host.appendChild(page);
    pages.push(page);
    return page;
  };

  let currentPage = createPage();

  for (let i = 0; i < sourceBlocks.length; i++) {
    const block = sourceBlocks[i];
    const clone = block.cloneNode(true) as HTMLElement;

    // Inject canvas snapshots into this cloned block
    injectCanvasSnapshots(clone, canvasSnapshots, container);

    currentPage.appendChild(clone);

    const fitsOnCurrentPage = currentPage.scrollHeight <= pageHeightPx;

    if (fitsOnCurrentPage) {
      // Keep-with-next: short header block should stay with the next block
      const isShortHeader = clone.offsetHeight < 120;
      const nextBlock = sourceBlocks[i + 1];

      if (isShortHeader && nextBlock) {
        const nextClone = nextBlock.cloneNode(true) as HTMLElement;
        injectCanvasSnapshots(nextClone, canvasSnapshots, container);
        nextClone.style.visibility = "hidden";
        nextClone.style.pointerEvents = "none";
        currentPage.appendChild(nextClone);
        const nextWouldOverflow = currentPage.scrollHeight > pageHeightPx;
        currentPage.removeChild(nextClone);

        if (nextWouldOverflow) {
          currentPage.removeChild(clone);
          currentPage = createPage();
          currentPage.appendChild(clone);
        }
      }
      continue;
    }

    // Block doesn't fit — move to new page
    currentPage.removeChild(clone);
    currentPage = createPage();
    currentPage.appendChild(clone);
  }

  const nonEmptyPages = pages.filter((page) => page.children.length > 0);

  return {
    pages: nonEmptyPages,
    cleanup: () => {
      host.remove();
    },
  };
}

export async function exportElementToPdf({
  elementId,
  elementIds,
  fileName,
  pageMarginMm = 10,
  orientation = "p",
  format = "a4",
  imageScale = 3,
  paginateByChildren = false,
  exportWidthPx = 1240,
}: ExportPdfOptions) {
  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format,
    compress: true,
  });

  const pageWidthMm = pdf.internal.pageSize.getWidth();
  const pageHeightMm = pdf.internal.pageSize.getHeight();
  const contentWidthMm = pageWidthMm - pageMarginMm * 2;
  const contentHeightMm = pageHeightMm - pageMarginMm * 2;
  const pageAspectRatio = contentHeightMm / contentWidthMm;

  let cleanupGeneratedPages: (() => void) | undefined;

  const ids = (elementIds && elementIds.length > 0 ? elementIds : elementId ? [elementId] : [])
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => Boolean(element));

  if (!ids.length) return;

  // Snapshot canvases from the LIVE original DOM before any cloning happens
  const canvasSnapshots = paginateByChildren && ids[0]
    ? snapshotCanvases(ids[0])
    : new Map<number, string>();

  const targets =
    paginateByChildren && elementId && ids[0]
      ? (() => {
          const { pages, cleanup } = buildPaginatedTargets(
            ids[0],
            pageAspectRatio,
            exportWidthPx,
            canvasSnapshots
          );
          cleanupGeneratedPages = cleanup;
          return pages;
        })()
      : ids;

  try {
    for (let index = 0; index < targets.length; index += 1) {
      const target = targets[index];

      await waitForImages(target);

      const canvas = await html2canvas(target, {
        scale: imageScale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#eef3f8",
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: exportWidthPx,
        windowHeight: Math.max(target.scrollHeight, target.offsetHeight),
      });

      const imageData = canvas.toDataURL("image/png");
      const imageRatio = canvas.width / canvas.height;
      const renderWidthMm = contentWidthMm;
      const renderHeightMm = renderWidthMm / imageRatio;

      if (index > 0) {
        pdf.addPage(format, orientation);
      }

      pdf.setFillColor(238, 243, 248);
      pdf.rect(0, 0, pageWidthMm, pageHeightMm, "F");

      pdf.addImage(
        imageData,
        "PNG",
        pageMarginMm,
        pageMarginMm,
        renderWidthMm,
        renderHeightMm,
        undefined,
        "FAST"
      );
    }
  } finally {
    cleanupGeneratedPages?.();
  }

  pdf.save(`${sanitizeFileName(fileName)}.pdf`);
}
