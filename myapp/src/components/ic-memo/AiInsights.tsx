import { SectionHeader } from "./KpiStrip";
import { IcAiInsightItem, IcAiInsightsData } from "./types";

const toneStyles = {
  green: {
    card: "bg-white border border-[#E2E8F0] border-t-4 border-t-[#0F766E]",
  },
  yellow: {
    card: "bg-white border border-[#E2E8F0] border-t-4 border-t-[#B45309]",
  },
  red: {
    card: "bg-white border border-[#E2E8F0] border-t-4 border-t-[#B91C1C]",
  },
};

const AiInsightCard = ({ title, body, signal = "yellow" }: IcAiInsightItem) => (
  <div className={`rounded-xl p-5 ${toneStyles[signal].card}`}>
    <p className="mb-2 min-h-[20px] text-base font-semibold text-[#1E293B]">{title ?? ""}</p>
    <p className="min-h-[42px] text-sm leading-7 text-slate-600">{body ?? ""}</p>
  </div>
);

const AiInsights = ({ data }: { data?: IcAiInsightsData | null }) => {
  const items = data?.items ?? [];

  return (
    <section>
      <SectionHeader number="08" title="AI Insights" />
      <div className="space-y-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d1b4f]">
            Portfolio Summary
          </p>
          <p className="min-h-[48px] text-sm leading-7 text-[#0d1b4f]">{data?.summary ?? ""}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: Math.max(items.length, 3) }).map((_, index) => (
            <AiInsightCard key={index} {...(items[index] ?? {})} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiInsights;
