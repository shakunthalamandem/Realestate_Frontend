import type { Deal } from "./data";

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000000 ? 1 : 0,
  }).format(value);
}

function getMetrics(deal: Deal) {
  return [
    {
      label: "NOI Margin",
      value: formatPercent(deal.metrics.noiMargin),
      sub: `${formatCompactCurrency(deal.metrics.noi)} NOI`,
    },
    {
      label: "Revenue / Unit",
      value: `$${deal.metrics.revenuePerUnit.toLocaleString()}`,
      sub: "Monthly avg",
    },
    {
      label: "Expense Ratio",
      value: formatPercent(deal.metrics.expenseRatio),
      sub: `${formatCompactCurrency(deal.metrics.totalExpenses)} total`,
    },
    {
      label: "Occupancy",
      value: formatPercent(deal.metrics.occupancy),
      sub: deal.metrics.occupancyUnits
        ? `${deal.metrics.occupancyUnits.occupied} of ${deal.metrics.occupancyUnits.total}`
        : `${Math.round((deal.units * deal.metrics.occupancy) / 100)} of ${deal.units}`,
    },
    {
      label: "Vacancy Loss",
      value: formatPercent(deal.metrics.vacancyLoss),
      sub: `${Math.round((deal.units * deal.metrics.vacancyLoss) / 100)} units`,
    },
    {
      label: "Rent vs Market Gap",
      value: formatPercent(deal.metrics.rentGap),
      sub: deal.metrics.totalProjectedRevenueLift
        ? `${formatCompactCurrency(deal.metrics.totalProjectedRevenueLift)} upside`
        : "Below market",
    },
  ];
}

export function KeyMetrics({ deal }: { deal: Deal }) {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {getMetrics(deal).map((metric) => (
        <div key={metric.label} className="min-w-0 rounded-2xl border border-[#294e86] bg-white px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#57719c]">{metric.label}</p>
          <p className="mt-3 truncate text-[2rem] font-bold leading-none text-[#102149] xl:text-[1.85rem]">{metric.value}</p>
          <p className="mt-2 text-sm text-[#62708d]">{metric.sub}</p>
        </div>
      ))}
    </section>
  );
}
