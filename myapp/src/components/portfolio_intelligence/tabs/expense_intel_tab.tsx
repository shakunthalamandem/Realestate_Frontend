import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ExpenseDashboard } from "../portfolio_analytics_types";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fmtCurrency = (value?: number | null) =>
  value === undefined || value === null ? "-" : `$${value.toLocaleString()}`;

const fmtPercent = (value?: number | null) =>
  value === undefined || value === null ? "-" : `${(value * 100).toFixed(1)}%`;

const ExpenseIntelTab: React.FC<{ data?: ExpenseDashboard }> = ({ data }) => {
  if (!data) {
    return (
      <p className="text-sm text-slate-500">
        Expense intelligence is not available.
      </p>
    );
  }

  const categories = data.categories ?? [];
  const hasCategories = categories.length > 0;

  /* -------------------- Doughnut Data -------------------- */

  const compositionData = {
  labels: categories.map((cat) => cat.name ?? "Category"),
  datasets: [
    {
      data: categories.map(
        (cat) => (cat.compositionPercent ?? 0) * 100
      ),
      backgroundColor: [
        "#FF6B6B", // red
        "#FFD93D", // yellow
        "#6C5CE7", // purple
        "#00B894", // green (only one green)
        "#FDCB6E", // light orange
        "#E84393", // pink
        "#2D3436", // dark gray
        "#0984E3", // strong blue (only one blue)
        "#D35400", // burnt orange
        "#7F8C8D", // gray
        "#8E44AD", // deep violet
      ],
      // borderColor: "#ffffff",
      borderWidth: 2,
    //   hoverOffset: 8,
     },
  ],
};
const compositionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "55%",
  plugins: {
    legend: {
      position: "right" as const,
      labels: {
        boxWidth: 14,
        padding: 16,
        color: "#334155",
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 10,
      borderRadius: 8,
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.raw;
          return `${label}: ${value.toFixed(1)}%`;
        },
      },
    },
  },
};


  /* -------------------- Bar Chart Data -------------------- */

  const growthData = {
    labels: categories.map((cat) => cat.name ?? ""),
    datasets: [
      {
        label: "YoY Growth",
        data: categories.map(
          (cat) => (cat.yoyGrowthPercent ?? 0) * 100
        ),
        borderRadius: 8,
        barThickness: 28,
        backgroundColor: categories.map((cat) =>
          (cat.yoyGrowthPercent ?? 0) >= 0
            ? "#ef4444"
            : "#15bd23"
        ),
      },
    ],
  };
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 10,
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#475569",
        font: { size: 12 },
      },
    },
    y: {
      grid: { color: "rgba(148,163,184,0.15)" },
      ticks: {
        color: "#475569",
        font: { size: 12 },
        callback: function (value: any) {
          return value + "%";
        },
      },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 10,
      borderRadius: 8,
      callbacks: {
        label: function (context: any) {
          const value = context.raw;
          return `${value.toFixed(1)}%`;
        },
      },
    },
  },
};


  return (
    <div className="space-y-8 text-slate-900">
      {/* -------------------- Summary Cards -------------------- */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-indigo-700">Total Current</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {fmtCurrency(data.summary?.totalCurrent)}
          </p>
        </div>

        {/* <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-indigo-700">Total Prior Year</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {fmtCurrency(data.summary?.totalPriorYear)}
          </p>
        </div> */}

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-indigo-700">Expense Growth</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {fmtPercent(data.summary?.overallYoYGrowth)}
          </p>
        </div>
      </div>

      {/* -------------------- Table -------------------- */}

      {hasCategories ? (
      <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#1c2c6b]">
            <tr className="text-xs font-semibold uppercase tracking-wider text-white">
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current</th>
              {/* <th className="px-6 py-4">Prior Year</th> */}
              <th className="px-6 py-4">Expense Growth</th>
              <th className="px-6 py-4">Per Unit</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.name}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-black">
                  {fmtCurrency(category.current)}
                </td>
                {/* <td className="px-6 py-4 text-black">
                  {fmtCurrency(category.priorYear)}
                </td> */}
                <td
                  className={`px-6 py-4 font-semibold ${
                    (category.yoyGrowthPercent ?? 0) < 0
                      ? "text-rose-500"
                      : "text-emerald-600"
                  }`}
                >
                  {fmtPercent(category.yoyGrowthPercent)}
                </td>
                <td className="px-6 py-4 text-black">
                  {fmtCurrency(category.perUnit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </> ) : (
        <p className="text-sm text-slate-500">No category data available.</p>
      )}

      {/* -------------------- Charts -------------------- */}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-slate-900">
            Expense Composition
          </h3>
          <div className="mt-6 h-[360px]">
            <Doughnut
              data={compositionData}
              options={compositionOptions}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-slate-900">
            Expense Growth
          </h3>
          <div className="mt-6 h-[360px]">
            <Bar data={growthData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseIntelTab;
