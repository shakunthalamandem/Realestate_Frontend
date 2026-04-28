import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Shield,
  TrendingUp,
  Trophy,
  XCircle,
} from "lucide-react";
import type { Deal } from "./data";

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function ScoreRow({
  deals,
  label,
  scoreKey,
}: {
  deals: Deal[];
  label: string;
  scoreKey: keyof Deal["scores"];
}) {
  const values = deals.map((deal) => deal.scores[scoreKey]);
  const best = Math.max(...values);

  return (
    <tr className="border-b border-[#e1e7f5]">
      <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">{label}</td>
      {deals.map((deal) => (
        <td key={deal.id} className="px-4 py-4 text-center text-lg font-bold text-[#102149]">
          <span className={deal.scores[scoreKey] === best ? "text-[#09a67d]" : ""}>
            {deal.scores[scoreKey]}
          </span>
          {deal.scores[scoreKey] === best ? <span className="ml-1 text-sm text-[#09a67d]">*</span> : null}
        </td>
      ))}
    </tr>
  );
}

function InfoCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-[#294e86] bg-white p-5 text-center">
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="text-sm uppercase tracking-[0.12em] text-[#5b647f]">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-[#102149]">{value}</p>
      <p className="mt-1 text-lg text-[#62708d]">{note}</p>
    </div>
  );
}

export function ComparisonView({ deals }: { deals: Deal[] }) {
  if (deals.length < 2) {
    return (
      <div className="flex h-[50vh] items-center justify-center rounded-2xl border border-dashed border-[#c8d6f2] bg-white text-[#6a7696]">
        Select at least 2 deals to compare.
      </div>
    );
  }

  const ranked = [...deals].sort((a, b) => b.scores.overall - a.scores.overall);
  const best = ranked[0];
  const secondBest = ranked[1];
  const safest = [...deals].sort((a, b) => a.scores.riskLevel - b.scores.riskLevel)[0];
  const worst = ranked[ranked.length - 1];
  const shouldAvoid = worst.scores.riskLevel > 60 || worst.scores.overall < 60;

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold text-[#102149]">Deal Comparison</h2>
      <section className="rounded-2xl bg-[#2f568f] p-6 text-white">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#d7e5ff]">
          <Brain className="h-4 w-4" />
          <span>AI Acquisition Recommendation</span>
        </div>
        <div className="mb-3 flex items-center gap-2 text-2xl font-semibold">
          <CheckCircle2 className="h-6 w-6 text-[#20d5a5]" />
          <span>Select {best.name} for Acquisition</span>
        </div>
        <p className="text-lg leading-8 text-white/95">
          {best.name} ranks first with an overall score of {best.scores.overall}, supported by a{" "}
          {formatPercent(best.metrics.noiMargin)} NOI margin and {formatPercent(best.metrics.rentGap)} rent gap.
          {secondBest ? ` ${secondBest.name} is the runner-up with a score of ${secondBest.scores.overall}.` : ""}
          {shouldAvoid ? ` ${worst.name} deserves caution because risk is elevated at ${worst.scores.riskLevel}.` : ""}
        </p>
      </section>
      <section className="space-y-4">
        <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Deal Rankings</h3>
        {ranked.map((deal, index) => (
          <div
            key={deal.id}
            className={`flex items-center gap-4 rounded-2xl border bg-white p-5 ${
              index === 0 ? "border-[#15a383] shadow-[0_0_0_2px_rgba(21,163,131,0.16)]" : "border-[#294e86]"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                index === 0
                  ? "bg-[#daf8ef] text-[#059669]"
                  : index === 1
                  ? "bg-[#dfeaff] text-[#315db0]"
                  : "bg-[#eef2f8] text-[#64748b]"
              }`}
            >
              #{index + 1}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-3xl font-semibold text-[#102149]">{deal.name}</p>
                <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-[#eef2f8] px-2 text-xs font-semibold leading-none text-[#607091]">
                  {deal.strategy}
                </span>
                {index === 0 ? (
                  <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full bg-[#daf8ef] px-2 text-xs font-semibold leading-none text-[#059669]">
                    Best Deal
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-lg text-[#62708d]">
                {deal.address} - {deal.units} units - ${(deal.askingPrice / 1e6).toFixed(1)}M
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-[#102149]">{deal.scores.overall}</p>
              <p className="text-sm text-[#62708d]">Overall Score</p>
            </div>
          </div>
        ))}
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#294e86] bg-white">
        <table className="w-full">
          <thead className="bg-[#f5f7fb]">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#57719c]">Metric</th>
              {deals.map((deal) => (
                <th key={deal.id} className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#102149]">
                  {deal.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ScoreRow deals={deals} label="Deal Score" scoreKey="overall" />
            <ScoreRow deals={deals} label="Market Position" scoreKey="marketPosition" />
            <ScoreRow deals={deals} label="Cash Flow Stability" scoreKey="cashFlowStability" />
            <ScoreRow deals={deals} label="Value-Add Potential" scoreKey="valueAddPotential" />
            <ScoreRow deals={deals} label="Risk Level" scoreKey="riskLevel" />
            <tr className="border-b border-[#e1e7f5]">
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">NOI Margin</td>
              {deals.map((deal) => <td key={deal.id} className="px-4 py-4 text-center text-lg font-bold text-[#102149]">{formatPercent(deal.metrics.noiMargin)}</td>)}
            </tr>
            <tr className="border-b border-[#e1e7f5]">
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">Occupancy</td>
              {deals.map((deal) => <td key={deal.id} className="px-4 py-4 text-center text-lg font-bold text-[#102149]">{formatPercent(deal.metrics.occupancy)}</td>)}
            </tr>
            <tr>
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">Rent Gap</td>
              {deals.map((deal) => <td key={deal.id} className="px-4 py-4 text-center text-lg font-bold text-[#102149]">{formatPercent(deal.metrics.rentGap)}</td>)}
            </tr>
          </tbody>
        </table>
      </section>
      <section className="overflow-hidden rounded-2xl border border-[#294e86] bg-white">
        <div className="border-b border-[#e1e7f5] px-4 py-4">
          <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Strategy Comparison</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#f5f7fb]">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#57719c]">Factor</th>
              {deals.map((deal) => (
                <th key={deal.id} className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-[#102149]">
                  {deal.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#e1e7f5]">
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">Strategy Type</td>
              {deals.map((deal) => <td key={deal.id} className="px-4 py-4 text-center text-lg font-semibold text-[#102149]">{deal.strategy}</td>)}
            </tr>
            <tr className="border-b border-[#e1e7f5]">
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">Risk Profile</td>
              {deals.map((deal) => {
                const riskClass =
                  deal.scores.riskLevel < 30
                    ? "bg-[#daf8ef] text-[#059669]"
                    : deal.scores.riskLevel < 50
                    ? "bg-[#fff1c8] text-[#be7a00]"
                    : "bg-[#ffe1e1] text-[#c73838]";
                const label = deal.scores.riskLevel < 30 ? "Low" : deal.scores.riskLevel < 50 ? "Medium" : "High";
                return (
                  <td key={deal.id} className="px-4 py-4 text-center">
                    <span className={`inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full px-3 text-sm font-semibold leading-none ${riskClass}`}>{label}</span>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td className="px-4 py-4 text-sm font-medium text-[#5b647f]">Upside Potential</td>
              {deals.map((deal) => (
                <td key={deal.id} className="px-4 py-4 text-center text-4xl font-bold text-[#102149]">
                  <span className={deal.scores.valueAddPotential >= 80 ? "text-[#09a67d]" : ""}>{deal.scores.valueAddPotential}</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={<Trophy className="h-6 w-6 text-[#ee9900]" />} title="Best Deal" value={best.name} note={`Score: ${best.scores.overall}`} />
        <InfoCard icon={<TrendingUp className="h-6 w-6 text-[#3b82f6]" />} title="Second Best" value={secondBest.name} note={`Score: ${secondBest.scores.overall}`} />
        <InfoCard icon={<Shield className="h-6 w-6 text-[#10b981]" />} title="Safest Deal" value={safest.name} note={`Risk: ${safest.scores.riskLevel}`} />
        <InfoCard icon={<AlertTriangle className="h-6 w-6 text-[#ef4444]" />} title={shouldAvoid ? "Avoid" : "Highest Risk"} value={worst.name} note={`Risk: ${worst.scores.riskLevel}`} />
      </section>
      <section className="rounded-2xl bg-[#2f568f] p-6 text-white">
        <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#d7e5ff]">Why {best.name} Is the Best Investment</h3>
        <p className="mt-4 text-3xl leading-10">{best.name} is the top-ranked deal because:</p>
        <div className="mt-5 space-y-3 text-xl leading-8 text-white/95">
          <p className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#20d5a5]" /><span>Higher rent upside ({formatPercent(best.metrics.rentGap)} gap vs {formatPercent(secondBest.metrics.rentGap)} for {secondBest.name})</span></p>
          <p className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#20d5a5]" /><span>{best.metrics.noiMargin > secondBest.metrics.noiMargin ? "Stronger" : "Competitive"} NOI margin ({formatPercent(best.metrics.noiMargin)} vs {formatPercent(secondBest.metrics.noiMargin)})</span></p>
          <p className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#20d5a5]" /><span>Overall deal score of {best.scores.overall}, the highest in the pipeline.</span></p>
        </div>
      </section>
      <section className="rounded-2xl border border-[#294e86] bg-white p-6">
        <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Final Recommendation</h3>
        <div className="mt-5 space-y-4 text-xl leading-8 text-[#102149]">
          <p className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-[#10b981]" /><span><strong>Select {best.name} for acquisition</strong> due to strong upside and a {formatPercent(best.metrics.rentGap)} rent gap.</span></p>
          <p className="flex gap-3"><Shield className="mt-1 h-5 w-5 flex-shrink-0 text-[#3b82f6]" /><span><strong>{secondBest.name} can be considered</strong> as the lower-risk alternative with a score of {secondBest.scores.overall}.</span></p>
          {shouldAvoid ? <p className="flex gap-3"><XCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[#ef4444]" /><span><strong>Avoid {worst.name}</strong> because risk is elevated at {worst.scores.riskLevel}.</span></p> : null}
        </div>
      </section>
    </div>
  );
}
