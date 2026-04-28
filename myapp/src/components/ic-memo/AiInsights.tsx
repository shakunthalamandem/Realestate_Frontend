import { SectionHeader } from "./KpiStrip";
import { IcAiInsightItem, IcAiInsightsData } from "./types";

const toneStyles = {
  green: {
    accent: "bg-[#10B981]",
    card:
      "border border-[#D9E2EF] bg-white",
    badge: "border border-[#10B981]/20 bg-[#ECFDF5] text-[#059669]",
  },
  yellow: {
    accent: "bg-[#8B5CF6]",
    card:
      "border border-[#D9E2EF] bg-white",
    badge: "border border-[#8B5CF6]/20 bg-[#F5F3FF] text-[#7C3AED]",
  },
  red: {
    accent: "bg-[#DC2626]",
    card:
      "border border-[#D9E2EF] bg-white",
    badge: "border border-[#DC2626]/20 bg-[#FEF2F2] text-[#DC2626]",
  },
};

const NUMERIC_TOKEN_REGEX =
  /(\$?\d[\d,.]*(?:[-\u2013\u2014]\$?\d[\d,.]*)?(?:\.\d+)?%?(?:K|M|B|bps|mo|months|assets|x)?|\b(?:Q1|Q2|Q3|Q4)\b)/g;

const renderInsightBody = (body?: string | null) => {
  const content = body ?? "";
  const parts = content.split(NUMERIC_TOKEN_REGEX);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    const isNumericToken = NUMERIC_TOKEN_REGEX.test(part);
    NUMERIC_TOKEN_REGEX.lastIndex = 0;

    return isNumericToken ? (
      <span key={index} className="font-mono tabular-nums text-[#0F172A]">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    );
  });
};

const AiInsightCard = ({ title, body, signal = "yellow" }: IcAiInsightItem) => (
  <div
    className={`relative overflow-hidden rounded-[18px] px-6 py-5 ${toneStyles[signal ?? "yellow"].card}`}
  >
    <span className={`absolute inset-y-0 left-0 w-1 ${toneStyles[signal ?? "yellow"].accent}`} />
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase leading-none tracking-[0.16em] ${toneStyles[signal ?? "yellow"].badge}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title ?? ""}
    </span>
    <p className="mt-4 pr-2 text-[15px] leading-9 text-[#23395B]">{renderInsightBody(body)}</p>
  </div>
);

const AiInsights = ({ data }: { data?: IcAiInsightsData | null }) => {
  const items = data?.items ?? [];

  return (
    <>
      <section className="pdf-flow-block">
        <SectionHeader number="08" title="AI-Driven Insights" />
      </section>
      {items.map((item, index) => (
        <section key={index} className="pdf-flow-block">
          <AiInsightCard {...item} />
        </section>
      ))}
    </>
  );
};

export default AiInsights;
