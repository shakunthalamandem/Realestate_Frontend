import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RealEstateResponses from "./RealEstateResponses";
import { useTheme } from "./ThemeContext";
import { Block } from "./Realestate_components/Utils/RComponentsUtils";

const createEmptyBlocks = (): Record<FileType, Block[]> => ({
  memorandum: [],
  t12: [],
  rent_roll: [],
});

type FileType = "memorandum" | "t12" | "rent_roll";

type DealEntry = {
  id: number | string;
  property_name?: string;
  memorandum?: Block[];
  t12?: Block[];
  rent_roll?: Block[];
  created_at?: string;
  updated_at?: string;
};

type RealEstateUploaderProps = {
  showBackButton?: boolean;
};

const RealEstateUploader: React.FC<RealEstateUploaderProps> = ({ showBackButton = true }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [files, setFiles] = useState<Record<FileType, File | null>>({
    memorandum: null,
    t12: null,
    rent_roll: null,
  });

  const [status, setStatus] = useState<Record<FileType, string>>({
    memorandum: "",
    t12: "",
    rent_roll: "",
  });

  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [responseBlocks, setResponseBlocks] = useState<Record<FileType, Block[]>>(createEmptyBlocks());

  const [propertyName, setPropertyName] = useState("");
  const [formError, setFormError] = useState("");

  const [deals, setDeals] = useState<DealEntry[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [dealsError, setDealsError] = useState<string | null>(null);

  const [selectedDeal, setSelectedDeal] = useState<DealEntry | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const inputRefs: Record<FileType, React.RefObject<HTMLInputElement>> = {
    memorandum: useRef<HTMLInputElement>(null),
    t12: useRef<HTMLInputElement>(null),
    rent_roll: useRef<HTMLInputElement>(null),
  };

  const fetchDeals = useCallback(async () => {
    setDealsLoading(true);
    setDealsError(null);
    try {
      const result = await axios.get(`${API_URL}/api/deal_underwriting_data/`);
      const payload = Array.isArray(result.data)
        ? result.data
        : result.data?.data ?? [];
      setDeals(payload);
    } catch (error) {
      console.error(error);
      setDealsError("Could not load properties.");
    } finally {
      setDealsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const resetForm = () => {
    setFiles({ memorandum: null, t12: null, rent_roll: null });
    setStatus({ memorandum: "", t12: "", rent_roll: "" });
    setPropertyName("");
    setFormError("");
    setProgressMessage("");
    Object.values(inputRefs).forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  };

  const handleReturnToLibrary = () => {
    setSelectedDeal(null);
    setResponseBlocks(createEmptyBlocks());
    setShowUploader(false);
    resetForm();
  };

  const handleStartAddProperty = () => {
    resetForm();
    setResponseBlocks(createEmptyBlocks());
    setSelectedDeal(null);
    setShowUploader(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setFiles((prev) => ({ ...prev, [type]: file }));
        setStatus((prev) => ({ ...prev, [type]: "" }));
      } else {
        setStatus((prev) => ({ ...prev, [type]: "Invalid file type. Only PDF allowed." }));
      }
    }
  };

  const handleRemoveFile = (type: FileType) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setStatus((prev) => ({ ...prev, [type]: "" }));
    if (inputRefs[type].current) inputRefs[type].current.value = "";
  };

  const handleUpload = async () => {
    if (!propertyName.trim()) {
      setFormError("Please provide a property name before uploading.");
      return;
    }

    const hasSelectedFile = (Object.keys(files) as FileType[]).some((key) => !!files[key]);
    if (!hasSelectedFile) return;

    setFormError("");
    const formData = new FormData();
    formData.append("property_name", propertyName.trim());
    (Object.keys(files) as FileType[]).forEach((key) => {
      if (files[key]) formData.append(key, files[key] as File);
    });

    try {
      setLoading(true);
      setProgressMessage("Uploading the PDF...");
      setTimeout(() => setProgressMessage("Reading the PDF data..."), 10000);
      setTimeout(() => setProgressMessage("Extracting data from PDF..."), 20000);
      setTimeout(() => setProgressMessage("Formatting the data..."), 30000);
      setTimeout(() => setProgressMessage("Almost there..."), 50000);

      const res = await axios.post(`${API_URL}/api/upload_documents/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newResponses: Record<FileType, Block[]> = {
        memorandum: res.data.memorandum?.response ?? [],
        t12: res.data.t12?.response ?? [],
        rent_roll: res.data.rent_roll?.response ?? [],
      };

      setResponseBlocks(newResponses);
      await fetchDeals();

      const newStatus: Record<FileType, string> = { ...status };
      (Object.keys(files) as FileType[]).forEach((key) => {
        if (files[key]) newStatus[key] = "Uploaded";
      });
      setStatus(newStatus);
    } catch (error) {
      console.error(error);
      const failedStatus: Record<FileType, string> = { ...status };
      (Object.keys(files) as FileType[]).forEach((key) => {
        if (files[key]) failedStatus[key] = "Upload failed";
      });
      setStatus(failedStatus);
      setProgressMessage("Upload failed. Please try again.");
    } finally {
      setTimeout(() => {
        setProgressMessage("");
        setLoading(false);
      }, 70000);
    }
  };

  const hasUploadResponses =
    responseBlocks.memorandum.length || responseBlocks.t12.length || responseBlocks.rent_roll.length;

  if (selectedDeal) {
    const dealResponses: Record<FileType, Block[]> = {
      memorandum: selectedDeal.memorandum ?? [],
      t12: selectedDeal.t12 ?? [],
      rent_roll: selectedDeal.rent_roll ?? [],
    };

    return renderResponsesShell(
      <RealEstateResponses
        responses={dealResponses}
        titleText={selectedDeal.property_name ?? "Property Response"}
        embedded
        showBackButton={false}
      />,
      selectedDeal.property_name ?? "Property Intelligence Library"
    );
  }

  if (hasUploadResponses) {
    return renderResponsesShell(
      <RealEstateResponses
        responses={responseBlocks}
        titleText={propertyName || "Upload Response"}
        embedded
        showBackButton={false}
      />,
      propertyName || "Property Intelligence Library"
    );
  }

  if (showUploader) {
    return renderUploadView();
  }

  return renderDealList();

  function renderDealList() {
    const hasDeals = deals.length > 0;
    return (
      <div
        className={`min-h-screen w-full ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {renderGlobalBackButton()}
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 lg:px-0">
          <div className="flex flex-col gap-4 lg:items-center lg:flex-row lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">Deal Lens</p>
              <h1 className="mt-1 text-3xl font-bold">Property Intelligence Library</h1>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Click a property to preview its stored memorandum, T12, and rent roll responses.
              </p>
            </div>
            <button
              onClick={handleStartAddProperty}
              className="rounded-full border border-blue-500 bg-blue-500/90 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-blue-600"
            >
              + Add Property
            </button>
          </div>

          <div
            className={`min-h-[260px] rounded-3xl border px-6 py-8 shadow-lg transition-colors ${
              theme === "dark"
                ? "bg-gray-950 border-gray-800 shadow-black/20"
                : "bg-white border-gray-200 shadow-gray-300"
            }`}
          >
            {dealsLoading ? (
              <p className="text-center text-sm text-gray-400">Refreshing deals...</p>
            ) : dealsError ? (
              <p className="text-center text-sm text-red-400">{dealsError}</p>
            ) : !hasDeals ? (
              <div className="rounded-2xl border-dashed border-2 border-blue-500/40 bg-blue-500/10 p-6 text-center text-sm text-blue-100">
                No properties available yet. Add a property to start uploading documents.
              </div>
            ) : (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <button
                    key={`${deal.id}-${deal.property_name}`}
                    onClick={() => setSelectedDeal(deal)}
                    className={`w-full rounded-2xl border px-5 py-4 text-left transition hover:border-blue-500/70 ${
                      theme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          {deal.property_name ?? `Property ${deal.id}`}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-gray-400">
                          Created {formatDate(deal.created_at)}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-blue-300">View insights</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-400">
                      <span>
                        Memorandum: <strong className="text-white">{deal.memorandum?.length ? "Ready" : "Missing"}</strong>
                      </span>
                      <span>
                        T12: <strong className="text-white">{deal.t12?.length ? "Ready" : "Missing"}</strong>
                      </span>
                      <span>
                        Rent Roll: <strong className="text-white">{deal.rent_roll?.length ? "Ready" : "Missing"}</strong>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function renderUploadView() {
    const hasFiles = (Object.keys(files) as FileType[]).some((key) => !!files[key]);

    return (
      <div
        className={`flex min-h-screen w-full items-center justify-center px-4 py-8 ${
          theme === "dark" ? "bg-gradient-to-b from-[#030513] to-[#050c21]" : "bg-gray-100"
        }`}
      >
        {renderGlobalBackButton()}
        <div className="w-full max-w-2xl">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e182d] to-[#0d1d29] p-8 shadow-[0_25px_60px_rgba(5,7,18,0.9)] text-white">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.4em] text-blue-300">Upload</p>
              <h2 className="text-3xl font-bold">Upload Property Documents</h2>
              <p className="text-sm text-gray-300">
                Upload the Offering Memorandum, T12 financials, and Rent Roll. Our AI will analyze the documents and generate underwriting insights.
              </p>
              <button
                onClick={() => setShowUploader(false)}
                className="text-sm font-medium text-blue-300 hover:text-blue-100"
              >
                Back to property list
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.5em] text-blue-200">
                Property Name
              </label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Enter the property name"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-gray-400 focus:border-blue-400 focus:outline-none"
              />
              {formError && <p className="mt-2 text-xs text-red-400">{formError}</p>}
            </div>

            <div className="space-y-4">
              {renderFileCard("Memorandum", "memorandum")}
              {renderFileCard("T12", "t12")}
              {renderFileCard("Rent Roll", "rent_roll")}
            </div>

            <div className="space-y-3">
              {(Object.keys(files) as FileType[])
                .filter((key) => files[key])
                .map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-xl border border-gray-700 bg-white/5 px-4 py-2 text-sm"
                  >
                    <span className="truncate text-xs uppercase tracking-wide text-white">
                      {files[key]?.name}
                    </span>
                    <button
                      onClick={() => handleRemoveFile(key)}
                      className="text-xs font-semibold text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}

              {loading && (
                <div className="text-center text-sm text-blue-100">
                  {progressMessage || "Processing uploads..."}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !hasFiles || !propertyName.trim()}
                className={`w-full rounded-2xl px-4 py-3 text-center text-base font-semibold transition ${
                  loading || !hasFiles || !propertyName.trim()
                    ? "bg-blue-500/60 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Upload Selected"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderResponsesShell(content: React.ReactNode, heading?: string) {
    return (
      <div className={`min-h-screen w-full ${theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}`}>
        {renderGlobalBackButton()}
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-4 lg:items-center lg:flex-row lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">Deal Lens</p>
              <h1 className="mt-1 text-3xl font-bold">{heading ?? "Property Intelligence Library"}</h1>
              <p className={`mt-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Click a property to preview its stored memorandum, T12, and rent roll responses.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReturnToLibrary}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Back to list
              </button>
              <button
                onClick={handleStartAddProperty}
                className="rounded-full bg-blue-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-blue-600"
              >
                + Add Property
              </button>
            </div>
          </div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0e182d] to-[#0d1d29] p-6 shadow-[0_25px_60px_rgba(5,7,18,0.85)]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  function renderGlobalBackButton() {
    if (!showBackButton) return null;

    return (
      <button
        onClick={() => navigate("/", { state: { scrollTo: "#platform" } })}
        className={`fixed top-4 left-4 z-50 rounded-lg px-4 py-2 text-sm font-semibold transition ${
          theme === "dark"
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-200 text-black hover:bg-gray-300"
        }`}
      >
        Back
      </button>
    );
  }

  function formatDate(value?: string) {
    if (!value) return "Unknown";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.valueOf())) return "Unknown";
    return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function renderFileCard(label: string, type: FileType) {
    return (
      <div
        className={`rounded-2xl border px-4 py-5 transition-colors ${
          theme === "dark"
            ? "border-white/10 bg-white/5 text-white"
            : "border-gray-200 bg-white text-gray-800"
        }`}
      >
        <p className="font-semibold mb-2">{label}</p>
        <div
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center text-sm transition ${
            files[type]
              ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
              : theme === "dark"
                ? "border-gray-600 hover:border-blue-400"
                : "border-gray-300 hover:border-blue-500"
          }`}
          onClick={() => inputRefs[type].current?.click()}
        >
          {files[type] ? (
            <p className="text-sm font-medium text-emerald-400">{files[type]?.name}</p>
          ) : (
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
              Click to upload {label} (PDF only)
            </p>
          )}
        </div>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={inputRefs[type]}
          onChange={(e) => handleFileChange(e, type)}
        />
        {status[type] && (
          <p
            className={`mt-2 text-xs ${
              status[type].includes("failed") || status[type].includes("Invalid")
                ? "text-red-400"
                : "text-emerald-300"
            }`}
          >
            {status[type]}
          </p>
        )}
      </div>
    );
  }
};

export default RealEstateUploader;
