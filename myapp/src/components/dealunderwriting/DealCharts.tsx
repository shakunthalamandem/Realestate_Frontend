import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Fragment } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import type { Deal } from "./data";
import { ChartInsight } from "./ChartInsight";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

const colors = ["#274b87", "#3b65ad", "#5f8ad4", "#88ace7", "#b5ccf4", "#dbe7fb", "#12325f", "#7f9fda"];

function formatMoney(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
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
      <div className="h-64">{children}</div>
      {insight ? <ChartInsight {...insight} /> : null}
    </div>
  );
}

function FloorplanHeatmap({
  title,
  xlabels,
  ylabels,
  data,
}: {
  title: string;
  xlabels: string[];
  ylabels: string[];
  data: number[][];
}) {
  const flatValues = data.flat();
  const maxValue = Math.max(...flatValues, 0);

  const getCellColor = (value: number) => {
    if (maxValue <= 0) return "#eef2f8";
    const ratio = value / maxValue;
    const alpha = 0.14 + ratio * 0.76;
    return `rgba(35, 159, 255, ${alpha.toFixed(2)})`;
  };

  return (
    <div className="rounded-2xl bg-[#1f3e5a] p-5 text-white">
      <h5 className="mb-4 text-center text-xl font-semibold">{title}</h5>
      <div className="grid gap-2" style={{ gridTemplateColumns: `72px repeat(${xlabels.length}, minmax(0, 1fr))` }}>
        <div />
        {xlabels.map((label) => (
          <div key={label} className="text-center text-sm font-medium text-white/85">
            {label}
          </div>
        ))}

        {ylabels.map((rowLabel, rowIndex) => (
          <Fragment key={rowLabel}>
            <div key={`${rowLabel}-label`} className="flex items-center justify-end pr-2 text-sm font-semibold text-white/90">
              {rowLabel}
            </div>
            {xlabels.map((columnLabel, columnIndex) => {
              const value = data[rowIndex]?.[columnIndex] ?? 0;
              return (
                <div
                  key={`${rowLabel}-${columnLabel}`}
                  className="flex h-9 items-center justify-center rounded text-sm font-semibold text-[#0f2740]"
                  style={{ backgroundColor: getCellColor(value) }}
                  title={`${rowLabel} / ${columnLabel}: ${value}`}
                >
                  {value > 0 ? value : ""}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm text-white/90">
        <span>0</span>
        <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-[#eef2f8] to-[#239fff]" />
        <span>{maxValue}</span>
      </div>
    </div>
  );
}

const axisColor = "rgba(15,23,42,0.08)";
const tickColor = "#475569";

export function DealCharts({ deal }: { deal: Deal }) {
  const ci = deal.chartInsights;

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" as const, labels: { color: tickColor } } },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: tickColor }, grid: { color: axisColor } },
      y: { ticks: { color: tickColor }, grid: { color: axisColor } },
    },
    plugins: { legend: { labels: { color: tickColor } } },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: tickColor }, grid: { color: axisColor } },
      y: {
        ticks: {
          color: tickColor,
          callback: (value: string | number) => formatMoney(Number(value)),
        },
        grid: { color: axisColor },
      },
    },
    plugins: { legend: { labels: { color: tickColor } } },
  };

  return (
    <section className="mb-6 space-y-4">
      <h3 className="text-xl font-semibold uppercase tracking-[0.12em] text-[#102149]">Performance Analytics</h3>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Tenant Mix" insight={ci.tenantMix}>
          <Pie
            data={{
              labels: deal.tenantMix.map((item) => `${item.name} ${item.percentage}%`),
              datasets: [{ data: deal.tenantMix.map((item) => item.count ?? item.percentage), backgroundColor: colors }],
            }}
            options={pieOptions}
          />
        </ChartCard>

        <ChartCard title="Rent vs Market" insight={ci.rentVsMarket}>
          <Bar
            data={{
              labels: deal.rentVsMarket.map((item) => item.type),
              datasets: [
                { label: "Current", data: deal.rentVsMarket.map((item) => item.current), backgroundColor: "#274b87" },
                { label: "Market", data: deal.rentVsMarket.map((item) => item.market), backgroundColor: "#8cb3f4" },
              ],
            }}
            options={barOptions}
          />
        </ChartCard>

        <ChartCard title="NOI Growth Projection" insight={ci.noiProjection}>
          <Line
            data={{
              labels: deal.noiProjection.map((item) => item.year),
              datasets: [{
                label: "NOI",
                data: deal.noiProjection.map((item) => item.noi),
                borderColor: "#274b87",
                backgroundColor: "rgba(39,75,135,0.12)",
                fill: true,
                tension: 0.35,
              }],
            }}
            options={lineOptions}
          />
        </ChartCard>

        <ChartCard title="Revenue vs Expenses" insight={ci.revenueVsExpenses}>
          <Line
            data={{
              labels: deal.revenueVsExpenses.map((item) => item.month),
              datasets: [
                { label: "Revenue", data: deal.revenueVsExpenses.map((item) => item.revenue), borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.15)", tension: 0.35 },
                { label: "Expense", data: deal.revenueVsExpenses.map((item) => item.expenses), borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.15)", tension: 0.35 },
              ],
            }}
            options={lineOptions}
          />
        </ChartCard>

        <ChartCard title="Expense Breakdown" insight={ci.expenseBreakdown}>
          <Bar
            data={{
              labels: deal.expenseBreakdown.map((item) => item.category),
              datasets: [{ label: "Amount", data: deal.expenseBreakdown.map((item) => item.amount), backgroundColor: "#3b65ad" }],
            }}
            options={{ ...barOptions, indexAxis: "y" as const }}
          />
        </ChartCard>

        <ChartCard title="Expense Distribution" insight={ci.expenseDistribution}>
          <Pie
            data={{
              labels: deal.expenseDistribution.map((item) => `${item.category} ${item.percent?.toFixed(1) ?? 0}%`),
              datasets: [{ data: deal.expenseDistribution.map((item) => item.amount), backgroundColor: colors }],
            }}
            options={pieOptions}
          />
        </ChartCard>

        <ChartCard title="Lease Expirations" insight={ci.leaseExpirations}>
          <Bar
            data={{
              labels: deal.leaseExpirations.map((item) => item.year),
              datasets: [{ label: "Units", data: deal.leaseExpirations.map((item) => item.units), backgroundColor: "#274b87" }],
            }}
            options={barOptions}
          />
        </ChartCard>

        <ChartCard title="Occupancy vs Vacancy" insight={ci.occupancyVacancy}>
          <Line
            data={{
              labels: deal.occupancyHistory.map((item) => item.month),
              datasets: [
                { label: "Occupancy %", data: deal.occupancyHistory.map((item) => item.occupancy), borderColor: "#274b87", backgroundColor: "rgba(39,75,135,0.1)", tension: 0.35 },
                { label: "Vacancy %", data: deal.occupancyHistory.map((item) => item.vacancy), borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.1)", tension: 0.35 },
              ],
            }}
            options={barOptions}
          />
        </ChartCard>

        {deal.leaseExpirationFloorplan?.xlabels?.length && deal.leaseExpirationFloorplan?.ylabels?.length ? (
          <div className="lg:col-span-2 xl:col-span-2">
            <FloorplanHeatmap
              title={deal.leaseExpirationFloorplan.title}
              xlabels={deal.leaseExpirationFloorplan.xlabels}
              ylabels={deal.leaseExpirationFloorplan.ylabels}
              data={deal.leaseExpirationFloorplan.data}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
