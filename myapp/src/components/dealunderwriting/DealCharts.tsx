import type { Deal } from "./data";
import { ChartInsight } from "./ChartInsight";

function formatMoney(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function ChartCard({
  title,
  children,
  insight,
}: {
  title: string;
  children: React.ReactNode;
  insight?: { insight: string; impact: string; drives: string };
}) {
  return (
    <div className="rounded-2xl border border-[#294e86] bg-white p-5">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#57719c]">{title}</h4>
      {children}
      {insight ? <ChartInsight {...insight} /> : null}
    </div>
  );
}

function BarPairs({ data }: { data: Array<{ label: string; left: number; right: number }> }) {
  const max = Math.max(...data.flatMap((item) => [item.left, item.right]));
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-[#5b647f]">
            <span>{item.label}</span>
            <span>
              {item.left} / {item.right}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="h-3 rounded-full bg-[#284f88]" style={{ width: `${(item.left / max) * 100}%` }} />
            <div className="h-3 rounded-full bg-[#8cb3f4]" style={{ width: `${(item.right / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SingleBars({
  data,
  formatter = (value: number) => String(value),
}: {
  data: Array<{ label: string; value: number }>;
  formatter?: (value: number) => string;
}) {
  const max = Math.max(...data.map((item) => item.value));
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-[#5b647f]">
            <span>{item.label}</span>
            <span>{formatter(item.value)}</span>
          </div>
          <div className="h-3 rounded-full bg-[#edf2fb]">
            <div
              className="h-3 rounded-full bg-[#284f88]"
              style={{ width: `${Math.max((item.value / max) * 100, 10)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function PieList({ data, valueKey }: { data: Array<Record<string, string | number>>; valueKey: string }) {
  const colors = ["#284f88", "#406bb0", "#5f8ad4", "#88ace7", "#b5ccf4", "#dbe7fb"];
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={String(item.name ?? item.category ?? item.tenant)} className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-[#183153]">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span>{String(item.name ?? item.category ?? item.tenant)}</span>
          </div>
          <span className="text-sm font-semibold text-[#102149]">{item[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

function TrendLine({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value));
  const min = Math.min(...data.map((item) => item.value));
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 100;
      const y = 60 - ((item.value - min) / Math.max(max - min, 1)) * 45;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 64" className="h-40 w-full">
        <polyline fill="rgba(40,79,136,0.12)" stroke="none" points={`0,60 ${points} 100,60`} />
        <polyline fill="none" stroke="#284f88" strokeWidth="2" points={points} />
      </svg>
      <div className="mt-2 flex justify-between text-xs text-[#5b647f]">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

export function DealCharts({ deal }: { deal: Deal }) {
  const ci = deal.chartInsights;

  return (
    <section className="mb-6 space-y-4">
      <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Performance Analytics</h3>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Tenant Mix" insight={ci.tenantMix}>
          <PieList data={deal.tenantMix} valueKey="percentage" />
        </ChartCard>
        <ChartCard title="Rent vs Market" insight={ci.rentVsMarket}>
          <BarPairs
            data={deal.rentVsMarket.map((item) => ({
              label: item.type,
              left: item.current,
              right: item.market,
            }))}
          />
        </ChartCard>
        <ChartCard title="NOI Growth Projection" insight={ci.noiProjection}>
          <TrendLine data={deal.noiProjection.map((item) => ({ label: item.year, value: item.noi }))} />
        </ChartCard>
        <ChartCard title="Revenue vs Expenses" insight={ci.revenueVsExpenses}>
          <BarPairs
            data={deal.revenueVsExpenses.map((item) => ({
              label: item.month,
              left: item.revenue,
              right: item.expenses,
            }))}
          />
        </ChartCard>
        <ChartCard title="Expense Breakdown" insight={ci.expenseBreakdown}>
          <SingleBars
            data={deal.expenseBreakdown.map((item) => ({ label: item.category, value: item.amount }))}
            formatter={formatMoney}
          />
        </ChartCard>
        <ChartCard title="Expense Distribution" insight={ci.expenseDistribution}>
          <PieList data={deal.expenseBreakdown} valueKey="amount" />
        </ChartCard>
        <ChartCard title="Lease Expirations" insight={ci.leaseExpirations}>
          <SingleBars data={deal.leaseExpirations.map((item) => ({ label: item.year, value: item.units }))} />
        </ChartCard>
        <ChartCard title="Occupancy vs Vacancy" insight={ci.occupancyVacancy}>
          <BarPairs
            data={deal.occupancyHistory.map((item) => ({
              label: item.month,
              left: item.occupancy,
              right: item.vacancy,
            }))}
          />
        </ChartCard>
        <ChartCard title="Tenant Concentration" insight={ci.tenantConcentration}>
          <PieList data={deal.tenantConcentration} valueKey="revenue" />
        </ChartCard>
      </div>
    </section>
  );
}
