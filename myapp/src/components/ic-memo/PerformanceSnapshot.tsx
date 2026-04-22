import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { SectionHeader } from "./KpiStrip";
import { IcInsightItem, IcPerformanceSnapshotData, IcTrendCard } from "./types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const formatCompactMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
  }).format(value);

const datasetColorMap: Record<string, { bg: string; border: string }> = {
  "bg-blue-600": { bg: "#2563eb", border: "#1d4ed8" },
  "bg-orange-500": { bg: "#f97316", border: "#ea580c" },
  "bg-green-600": { bg: "#16a34a", border: "#15803d" },
  "bg-slate-300": { bg: "#cbd5e1", border: "#94a3b8" },
};

const resolveDatasetColors = (color?: string | null) =>
  datasetColorMap[color ?? ""] ?? datasetColorMap["bg-slate-300"];

const InsightCard = ({ signal = "neutral", title, text }: IcInsightItem) => {
  const resolvedSignal = signal ?? "neutral";
  const styles = {
    green: "border-l-[3px] border-l-[#10b981] bg-[#ecfdf5]",
    red: "border-l-[3px] border-l-[#f43f5e] bg-[#fff1f2]",
    neutral: "border-l-[3px] border-l-[#64748b] bg-[#f8fafc]",
    yellow: "border-l-[3px] border-l-[#f59e0b] bg-[#fffbeb]",
  };

  const textStyles = {
    green: "text-[#047857]",
    red: "text-[#be123c]",
    neutral: "text-[#475569]",
    yellow: "text-[#b45309]",
  };

  return (
    <div className={`rounded-r-xl p-4 ${styles[resolvedSignal]}`}>
      <p className={`mb-1 min-h-[20px] text-sm font-semibold ${textStyles[resolvedSignal]}`}>
        {title ?? ""}
      </p>
      <p className={`min-h-[42px] text-sm leading-relaxed ${textStyles[resolvedSignal]}`}>
        {text ?? ""}
      </p>
    </div>
  );
};

const buildTrendChartData = (trends: IcTrendCard[]): ChartData<"bar"> => {
  const chartTrends =
    trends.length > 0
      ? trends
      : [
          { label: "Revenue", values: [0, 0, 0, 0, 0, 0], color: "bg-blue-600" },
          { label: "Expenses", values: [0, 0, 0, 0, 0, 0], color: "bg-orange-500" },
          { label: "NOI", values: [0, 0, 0, 0, 0, 0], color: "bg-green-600" },
        ];

  return {
    labels: MONTH_LABELS,
    datasets: chartTrends.map((trend) => {
      const colors = resolveDatasetColors(trend.color);
      const values = MONTH_LABELS.map((_, index) => trend.values?.[index] ?? 0);

      return {
        label: trend.label ?? "",
        data: values,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 34,
      };
    }),
  };
};

const trendChartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#64748b", font: { size: 11 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: "rgba(148,163,184,0.18)" },
      ticks: {
        color: "#64748b",
        callback: (value) => formatCompactMoney(Number(value)),
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#0f172a",
        boxWidth: 14,
        boxHeight: 14,
        font: { weight: 600 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.92)",
      padding: 10,
      displayColors: true,
      callbacks: {
        title: (items) => items[0]?.label ?? "",
        label: (context) => `${context.dataset.label}: ${formatCompactMoney(Number(context.raw ?? 0))}`,
      },
    },
  },
};

const PerformanceSnapshot = ({ data }: { data?: IcPerformanceSnapshotData | null }) => {
  const trends = data?.trends ?? [];
  const insights = data?.insights ?? [];
  const insightCards: IcInsightItem[] =
    insights.length > 0
      ? insights
      : Array.from({ length: 3 }, () => ({ title: "", text: "", signal: "neutral" }));
  const trendChartData = buildTrendChartData(trends);

  return (
    <section>
      <SectionHeader number="03" title="Performance Snapshot" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border bg-white p-5 lg:col-span-7">
          <div className="h-[400px]">
            <Bar data={trendChartData} options={trendChartOptions} />
          </div>
          <div className="mt-4 flex items-center gap-2 border-t pt-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {data?.trendFooterLabel ?? ""}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {data?.trendFooterValue ?? ""}
            </span>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-5">
          {insightCards.map((insight, index) => (
            <InsightCard key={`${insight.title ?? "insight"}-${index}`} {...insight} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSnapshot;
