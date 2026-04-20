import type { Deal } from "./data";

const scoreLabels: { key: keyof Deal["scores"]; label: string; weight: number; invert?: boolean }[] = [
  { key: "marketPosition", label: "Market Position", weight: 0.25 },
  { key: "cashFlowStability", label: "Cash Flow Stability", weight: 0.3 },
  { key: "valueAddPotential", label: "Value-Add Potential", weight: 0.25 },
  { key: "riskLevel", label: "Risk Level", weight: 0.2, invert: true },
];

function getBarColor(score: number, invert?: boolean) {
  const effective = invert ? 100 - score : score;
  if (effective >= 75) return "bg-[#19b68f]";
  if (effective >= 50) return "bg-[#f3a122]";
  return "bg-[#ef4444]";
}

export function DealScorecard({ deal }: { deal: Deal }) {
  return (
    <section className="rounded-2xl border border-[#294e86] bg-white p-6">
      <h3 className="mb-6 text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Deal Scorecard</h3>
      <div className="space-y-5">
        {scoreLabels.map(({ key, label, weight, invert }) => {
          const score = deal.scores[key];
          return (
            <div key={key}>
              <div className="mb-2 flex justify-between text-lg">
                <span className="text-[#62708d]">
                  {label} <span className="text-sm text-[#9aa7c0]">({(weight * 100).toFixed(0)}%)</span>
                </span>
                <span className="font-semibold text-[#102149]">{score}</span>
              </div>
              <div className="h-3 rounded-full bg-[#edf2fb]">
                <div className={`h-3 rounded-full ${getBarColor(score, invert)}`} style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
        <div className="border-t border-[#e1e7f5] pt-4">
          <div className="mb-2 flex justify-between text-lg">
            <span className="font-semibold text-[#102149]">Overall Deal Score</span>
            <span className="text-3xl font-bold text-[#102149]">{deal.scores.overall}</span>
          </div>
          <div className="h-4 rounded-full bg-[#edf2fb]">
            <div
              className={`h-4 rounded-full ${getBarColor(deal.scores.overall)}`}
              style={{ width: `${deal.scores.overall}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
