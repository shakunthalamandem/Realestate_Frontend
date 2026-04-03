import { SectionHeader } from "./KpiStrip";
import { IcInsightItem, IcPerformanceSnapshotData, IcTrendCard } from "./types";

const MiniBar = ({ label, values = [], color = "bg-slate-300" }: IcTrendCard) => {
  const data = values.length > 0 ? values : [0, 0, 0, 0, 0, 0];
  const max = Math.max(...data, 1);

  return (
    <div className="mb-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label ?? ""}</p>
      <div className="flex h-10 items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-sm ${color} transition-all`}
            style={{ height: `${(value / max) * 100}%`, opacity: 0.55 + (index / data.length) * 0.3 }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between">
        <span className="text-[10px] text-slate-400">Oct</span>
        <span className="text-[10px] text-slate-400">Mar</span>
      </div>
    </div>
  );
};

const InsightCard = ({ signal = "neutral", title, text }: IcInsightItem) => {
  const styles = {
    green: "border-l-[3px] border-l-[#10b981] bg-[#ecfdf5]",
    red: "border-l-[3px] border-l-[#f43f5e] bg-[#fff1f2]",
    neutral: "border-l-[3px] border-l-[#64748b] bg-[#f8fafc]", // updated
  };

  const textStyles = {
    green: "text-[#047857]",
    red: "text-[#be123c]",
    neutral: "text-[#475569]",
  };

  return (
    <div className={`rounded-r-xl p-4 ${styles[signal]}`}>
      <p className={`mb-1 min-h-[20px] text-sm font-semibold ${textStyles[signal]}`}>
        {title ?? ""}
      </p>
      <p className={`min-h-[42px] text-sm leading-relaxed ${textStyles[signal]}`}>
        {text ?? ""}
      </p>
    </div>
  );
};

const PerformanceSnapshot = ({ data }: { data?: IcPerformanceSnapshotData | null }) => {
  const trends = data?.trends ?? [];
  const insights = data?.insights ?? [];

  return (
    <section>
      <SectionHeader number="03" title="Performance Snapshot" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="grid grid-cols-3 gap-4 rounded-xl border bg-white p-5 lg:col-span-2">
          {Array.from({ length: Math.max(trends.length, 3) }).map((_, index) => (
            <MiniBar key={index} {...(trends[index] ?? {})} />
          ))}
          <div className="col-span-3 flex items-center gap-2 border-t pt-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {data?.trendFooterLabel ?? ""}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {data?.trendFooterValue ?? ""}
            </span>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-3">
          {Array.from({ length: Math.max(insights.length, 3) }).map((_, index) => (
            <InsightCard key={index} {...(insights[index] ?? {})} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSnapshot;
