import { SectionHeader } from "./KpiStrip";
import { IcForwardOutlookData } from "./types";

const toneMap = {
  blue: { bubble: "bg-[#7a8fdf]/10", bullet: "text-[#7a8fdf]" },
  red: { bubble: "bg-rose-50", bullet: "text-rose-500" },
  green: { bubble: "bg-emerald-50", bullet: "text-emerald-500" },
  yellow: { bubble: "bg-amber-50", bullet: "text-amber-500" },
};

const iconMap = {
  blue: "📈",
  red: "⚠️",
  green: "🎯",
  yellow: "•",
};

const ForwardOutlook = ({ data }: { data?: IcForwardOutlookData | null }) => {
  const columns = data?.columns ?? [];

  return (
    <section>
      <SectionHeader number="10" title="Forward Outlook — Next 60–90 Days" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: Math.max(columns.length, 3) }).map((_, index) => {
          const column = columns[index];
          const tone = column?.tone ?? (index === 0 ? "blue" : index === 1 ? "red" : "green");
          const style = toneMap[tone];

          return (
            <div key={index} className="rounded-xl border bg-white p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${style.bubble}`}>
                  {iconMap[tone]}
                </span>
                <h4 className="min-h-[20px] text-sm font-bold text-slate-900">{column?.title ?? ""}</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-500">
                {Array.from({ length: Math.max(column?.items?.length ?? 0, 3) }).map((__, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className={`mt-0.5 ${style.bullet}`}>▸</span>
                    <span>{column?.items?.[itemIndex] ?? ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t pt-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {data?.footerTitle ?? ""}
        </p>
        <p className="text-xs text-slate-500">{data?.footerSubtitle ?? ""}</p>
        <p className="mt-1 text-xs italic text-slate-400">{data?.footerNote ?? ""}</p>
      </div>
    </section>
  );
};

export default ForwardOutlook;
