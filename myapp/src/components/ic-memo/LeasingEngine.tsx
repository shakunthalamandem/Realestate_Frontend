import { SectionHeader } from "./KpiStrip";
import { IcLeasingEngineData, IcProgressMetric } from "./types";

const ProgressRow = ({ label, value, subtitle, bar, signal = "yellow" }: IcProgressMetric) => {
  const normalizedLabel = (label ?? "").toLowerCase();

  const barColor = normalizedLabel.includes("renewal rate")
    ? "bg-[linear-gradient(90deg,#22C55E,#16A34A)]"
    : normalizedLabel.includes("loss-to-lease")
      ? "bg-[linear-gradient(90deg,#FACC15,#EAB308)]"
      : normalizedLabel.includes("units below market")
        ? "bg-[linear-gradient(90deg,#FB923C,#F97316)]"
        : normalizedLabel.includes("lease expirations")
          ? "bg-[linear-gradient(90deg,#F87171,#DC2626)]"
          : normalizedLabel.includes("mark-to-market")
            ? "bg-[linear-gradient(90deg,#14B8A6,#0D9488)]"
            : signal === "green"
              ? "bg-[linear-gradient(90deg,#22C55E,#16A34A)]"
              : signal === "red"
                ? "bg-[linear-gradient(90deg,#F87171,#DC2626)]"
                : "bg-[linear-gradient(90deg,#FACC15,#EAB308)]";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{label ?? ""}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">{value ?? ""}</span>
          <span className="text-xs text-slate-500">{subtitle ?? ""}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-[#E5E7EB]">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${bar ?? 0}%` }} />
      </div>
    </div>
  );
};

const LeasingEngine = ({ data }: { data?: IcLeasingEngineData | null }) => {
  const metrics = (data?.metrics ?? []).filter(
    (metric) => !(metric?.label ?? "").toLowerCase().includes("renewal rate"),
  );
  const sections = data?.sideSections ?? [];

  return (
    <section>
      <SectionHeader number="04" title="Leasing & Revenue Engine" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 rounded-xl border bg-white p-5 lg:col-span-2">
          {Array.from({ length: Math.max(metrics.length, 5) }).map((_, index) => (
            <ProgressRow key={index} {...(metrics[index] ?? {})} />
          ))}
        </div>

        <div className="rounded-xl bg-[#0d1b4f] p-6 text-white">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9cb2ff]">
              {data?.sideTitle ?? ""}
            </h3>
          </div>
          <div className="space-y-4">
            {Array.from({ length: Math.max(sections.length, 3) }).map((_, index) => {
              const item = sections[index];
              return (
                <div key={index}>
                  <p className="mb-1 text-xs uppercase tracking-[0.16em] text-white/50">
                    {item?.label ?? ""}
                  </p>
                  <p className="min-h-[44px] text-sm leading-relaxed text-white/80">
                    {item?.text ?? ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeasingEngine;
