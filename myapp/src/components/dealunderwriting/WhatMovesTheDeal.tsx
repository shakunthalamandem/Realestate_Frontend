import { ArrowUpRight } from "lucide-react";
import type { Deal } from "./data";

export function WhatMovesTheDeal({ deal }: { deal: Deal }) {
  const movers = [
    { label: "Rent Increase", value: deal.movers.rentIncrease },
    { label: "Expense Optimization", value: deal.movers.expenseOptimization },
    { label: "Occupancy Improvement", value: deal.movers.occupancyImprovement },
  ];
  const total = movers.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="rounded-2xl bg-[#2f568f] p-6 text-white">
      <h3 className="mb-5 flex items-center gap-2 text-xl font-semibold uppercase tracking-[0.12em] text-[#d7e5ff]">
        <ArrowUpRight className="h-5 w-5" />
        What Drives This Investment
      </h3>

      <div className="grid gap-4 xl:grid-cols-3">
        {movers.map((item) => (
          <div key={item.label} className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-[#d7e5ff]">{item.label}</p>
            <p className="mt-2 text-4xl font-bold">+${(item.value / 1000).toFixed(0)}K</p>
            <p className="mt-1 text-sm text-[#c7d8f8]">NOI Impact</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-4">
        <span className="text-lg text-[#d7e5ff]">Total Potential NOI Uplift</span>
        <span className="text-4xl font-bold">+${(total / 1000).toFixed(0)}K</span>
      </div>
    </section>
  );
}
