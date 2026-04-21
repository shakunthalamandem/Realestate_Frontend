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

function formatWholeNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number, maxFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFractionDigits }).format(value);
}

function getMetrics(deal: Deal) {
  return [
    {
      label: "No. of Units",
      value: formatWholeNumber(deal.metrics.noOfUnits ?? deal.units),
      sub: "Total rentable units",
    },
    {
      label: "Year Built",
      value: formatWholeNumber(deal.metrics.yearBuilt ?? deal.yearBuilt),
      sub: "Original construction year",
    },
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
      label: "Rent / Sq Ft",
      value: `$${formatDecimal(deal.metrics.rentPerSqft ?? 0)}`,
      sub: "Current average",
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
      label: "Parking Spaces",
      value: formatDecimal(deal.metrics.parkingSpace ?? 0, 0),
      sub: "Available spaces",
      hidden: (deal.metrics.parkingSpace ?? 0) === 0,
    },
    {
      label: "Site Size",
      value: `${formatDecimal(deal.metrics.siteSize ?? 0)} ac`,
      sub: "Property footprint",
      hidden: (deal.metrics.siteSize ?? 0) === 0,
    },
    {
      label: "Rent vs Market Gap",
      value: formatPercent(deal.metrics.rentGap),
      sub: deal.metrics.totalProjectedRevenueLift
        ? `${formatCompactCurrency(deal.metrics.totalProjectedRevenueLift)} upside`
        : "Below market",
    },
  ].filter((metric) => !metric.hidden);
}

export function KeyMetrics({ deal }: { deal: Deal }) {
  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
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
