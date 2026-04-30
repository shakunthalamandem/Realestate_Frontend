import { AlertTriangle, Lightbulb } from "lucide-react";
import type { Deal } from "./data";

const severityBadge: Record<string, string> = {
  High: "bg-[#ffe1e1] text-[#c73838]",
  Medium: "bg-[#fff1c8] text-[#be7a00]",
  Low: "bg-[#daf8ef] text-[#059669]",
};

export function RisksOpportunities({ deal }: { deal: Deal }) {
  return (
    <section className="mb-6 grid gap-4 xl:grid-cols-2">
      <div className="rounded-2xl border border-[#294e86] bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">
          <AlertTriangle className="h-5 w-5 text-[#ef4444]" />
          Risks
        </h3>
        <div className="space-y-3">
          {deal.risks.map((risk, index) => (
            <div key={index} className="rounded-xl bg-[#f7f9fd] p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-2xl font-medium text-[#102149]">{risk.title}</span>
                <span className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-semibold leading-none ${severityBadge[risk.severity]}`}>
                  {risk.severity}
                </span>
              </div>
              <p className="text-base font-semibold text-[#d63838]">{risk.impact}</p>
              <p className="mt-1 text-base text-[#62708d]">{risk.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#294e86] bg-white p-5">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">
          <Lightbulb className="h-5 w-5 text-[#e7a227]" />
          Opportunities
        </h3>
        <div className="space-y-3">
          {deal.opportunities.map((opportunity, index) => (
            <div key={index} className="rounded-xl bg-[#f7f9fd] p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-2xl font-medium text-[#102149]">{opportunity.title}</span>
                <span className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-semibold leading-none ${severityBadge[opportunity.severity]}`}>
                  {opportunity.severity}
                </span>
              </div>
              <p className="text-base font-semibold text-[#0ea56f]">{opportunity.impact}</p>
              <p className="mt-1 text-base text-[#62708d]">{opportunity.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
