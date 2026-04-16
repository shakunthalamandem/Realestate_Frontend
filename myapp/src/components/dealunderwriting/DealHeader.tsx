import { Building2, Calendar, DollarSign, MapPin } from "lucide-react";
import type { Deal } from "./data";

const strategyColors: Record<string, string> = {
  Core: "border-sky-300 bg-sky-100 text-sky-800",
  "Core+": "border-blue-300 bg-blue-100 text-blue-800",
  "Value-Add": "border-amber-300 bg-amber-100 text-amber-800",
  Opportunistic: "border-red-300 bg-red-100 text-red-800",
};

export function DealHeader({
  deal,
  isInCompare,
  onAddCompare,
}: {
  deal: Deal;
  isInCompare: boolean;
  onAddCompare: (id: string) => void;
}) {
  return (
    <section className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${strategyColors[deal.strategy]}`}>
            {deal.strategy}
          </span>
          <h2 className="break-words text-2xl font-semibold text-[#102149] md:text-3xl xl:text-4xl">{deal.name}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-base text-[#62708d] md:text-lg">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {deal.address}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {deal.units} units
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Built {deal.yearBuilt}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />${(deal.askingPrice / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAddCompare(deal.id)}
        className={`self-start rounded-xl px-5 py-3 text-base font-semibold transition md:text-lg ${
          isInCompare
            ? "bg-[#284f88] text-white"
            : "border-2 border-[#284f88] bg-white text-[#284f88] hover:bg-[#284f88] hover:text-white"
        }`}
      >
        {isInCompare ? "In Compare" : "+ Add to Compare"}
      </button>
    </section>
  );
}
