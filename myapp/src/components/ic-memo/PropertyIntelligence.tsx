import { SectionHeader } from "./KpiStrip";
import { IcPropertyCardData, IcPropertyIntelligenceData } from "./types";

const perfStyle = {
  Strong: {
    card: "border-[#E2E8F0] border-l-[5px] border-l-[#166534]",
    pill: "bg-[#166534] text-white",
  },
  Stable: {
    card: "border-[#E2E8F0] border-l-[5px] border-l-[#B45309]",
    pill: "bg-[#B45309] text-white",
  },
  Weak: {
    card: "border-[#E2E8F0] border-l-[5px] border-l-[#991B1B]",
    pill: "bg-[#991B1B] text-white",
  },
};

const metricDot = {
  green: "bg-[#166534]",
  yellow: "bg-[#B45309]",
  red: "bg-[#991B1B]",
};

const actionBadge = {
  HIGH: "bg-[#991B1B] text-white",
  MEDIUM: "bg-[#EAB308] text-[#1F2937]",
  MONITOR: "bg-[#475569] text-white",
};

const listTone = {
  insights: { heading: "text-[#475569]", bullet: "text-[#475569]" },
  risks: { heading: "text-[#991B1B]", bullet: "text-[#991B1B]" },
  opportunities: { heading: "text-[#166534]", bullet: "text-[#166534]" },
};

const PropertyCard = ({ property }: { property?: IcPropertyCardData | null }) => {
  const performance = property?.performance ?? "Stable";
  const metrics = (property?.metrics ?? []).filter(
    (metric) => metric?.label?.trim().toLowerCase() !== "rev growth",
  );
  const insights = property?.insights ?? [];
  const risks = property?.risks ?? [];
  const opportunities = property?.opportunities ?? [];
  const actions = property?.actions ?? [];
  const style = perfStyle[performance];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] ${style.card}`}
    >
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0d1b4f] text-sm font-bold text-white">
            P
          </div>
          <div>
            <h3 className="min-h-[20px] text-xl font-bold text-[#1E293B]">{property?.name ?? ""}</h3>
            <p className="min-h-[16px] text-sm font-medium text-slate-600">{property?.location ?? ""}</p>
          </div>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${style.pill}`}>
          {property?.performance ?? ""}
        </span>
      </div>

      <div className="border-b border-[#E2E8F0] px-5 py-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          Performance Snapshot
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {metrics.map((metric, index) => {
            const dotClass = metric?.signal ? metricDot[metric.signal] : "bg-slate-300";
            return (
              <div key={index} className="rounded-xl border border-[#0D1B4F] bg-white px-3 py-4 text-center">
                <div className="mb-1 flex items-center justify-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                  <span className="text-[1.65rem] font-bold leading-none text-[#1E293B]">{metric?.value ?? ""}</span>
                </div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">{metric?.label ?? ""}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-[#E2E8F0] md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="p-5">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${listTone.insights.heading}`}>
            Key Insights
          </p>
          <ul className="space-y-3">
            {insights.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-base leading-8 text-slate-700">
                <span className={`mt-1 flex-shrink-0 text-xs ${listTone.insights.bullet}`}>▸</span>
                <span>{item ?? ""}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${listTone.risks.heading}`}>
            Risk Flags
          </p>
          <ul className="space-y-3">
            {risks.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-base leading-8 text-slate-700">
                <span className={`mt-1 flex-shrink-0 text-xs ${listTone.risks.bullet}`}>▸</span>
                <span>{item ?? ""}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${listTone.opportunities.heading}`}>
            Value Creation
          </p>
          <ul className="space-y-3">
            {opportunities.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-base leading-8 text-slate-700">
                <span className={`mt-1 flex-shrink-0 text-xs ${listTone.opportunities.bullet}`}>▸</span>
                <span>{item ?? ""}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0] bg-white px-5 py-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1E293B]">
          Property-Level Actions
        </p>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const priority = action?.priority ?? "MONITOR";
            return (
              <div key={index} className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white px-4 py-4">
                <span className={`flex h-9 min-w-[84px] flex-shrink-0 items-center justify-center rounded-lg px-3 text-[10px] font-bold tracking-[0.12em] ${actionBadge[priority]}`}>
                  {action?.priority ?? ""}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="min-h-[20px] text-base font-semibold text-[#1E293B]">{action?.action ?? ""}</p>
                  <p className="mt-1 flex min-h-[16px] items-center gap-1.5 text-sm font-medium text-slate-600">
                    <span className="text-[#166534]">→</span>
                    {action?.impact ?? ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PropertyIntelligence = ({ data }: { data?: IcPropertyIntelligenceData | null }) => {
  const properties = data?.properties ?? [];

  return (
    <>
      <section className="pdf-flow-block">
        <SectionHeader number="07" title="Property-Level Intelligence" />
      </section>
      {properties.map((property, index) => (
        <section key={index} className="pdf-flow-block">
          <PropertyCard property={property} />
        </section>
      ))}
    </>
  );
};

export default PropertyIntelligence;
