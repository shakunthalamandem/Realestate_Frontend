import React, { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { PULSE_COLORS } from "./constants";
import { normalizePulseKey } from "./utils";
import type { MarketRadarItem } from "./types";

import "../ui/interactive-data-table.css";

type MarketRadarTableProps = {
  data: MarketRadarItem[];
  loading: boolean;
  error: string | null;
  onAddSubmarket: () => void;
  onSelectsub_market_name: (item: MarketRadarItem) => void;
};

const MarketRadarTable: React.FC<MarketRadarTableProps> = ({
  data,
  loading,
  error,
  onAddSubmarket,
  onSelectsub_market_name,
}) => {
  const [query, setQuery] = useState("");

  const filteredData = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((item) => {
      const submarket = item.sub_market_name?.toLowerCase() ?? "";
      const region = item.region?.toLowerCase() ?? "";
      return submarket.includes(normalized) || region.includes(normalized);
    });
  }, [data, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-m font-semibold text-black">SubMarket Pulse</p>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search submarket or region"
            className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-black placeholder:text-black focus:border-slate-300 focus:outline-none sm:w-64"
          />
          <button
            type="button"
            onClick={onAddSubmarket}
            className="h-9 rounded-full border border-violet-300 bg-violet-50 px-4 text-xs font-semibold text-violet-700 hover:border-violet-400"
          >
            Add Submarket +
          </button>
        </div>
      </div>
      <div className="interactive-data-table-shell max-h-[420px] overflow-hidden">
        <div className="max-h-[420px] overflow-auto">
          <table className="interactive-data-table min-w-[640px] text-black">
            <colgroup>
              <col style={{ width: "42%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead className="interactive-data-table__head sticky top-0 z-10">
              <tr>
                <th scope="col">Submarket Name</th>
                <th scope="col">Region</th>
                <th scope="col">Market Pulse</th>
                <th scope="col">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const pulseKey = normalizePulseKey(item.marketPulse);
                const color = PULSE_COLORS[pulseKey]?.dot ?? "#21C7D9";
                return (
                  <tr
                    key={`${item.sub_market_name}-${idx}`}
                    className="interactive-data-table__row interactive-data-table__row--clickable"
                    onClick={() => onSelectsub_market_name(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelectsub_market_name(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <td className="interactive-data-table__cell interactive-data-table__cell--first">
                      <span className="interactive-data-table__primary uppercase">{item.sub_market_name || "-"}</span>
                    </td>
                    <td className="interactive-data-table__cell">
                      <span className="interactive-data-table__value">{item.region || "-"}</span>
                    </td>
                    <td className="interactive-data-table__cell">
                      <span
                        className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: "rgba(248, 250, 252, 0.9)",
                          border: `1px solid ${color}`,
                          color,
                        }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                        {item.marketPulse}
                      </span>
                    </td>
                    <td className="interactive-data-table__cell interactive-data-table__cell--last interactive-data-table__arrow-cell">
                      <ChevronRight className="interactive-data-table__arrow" strokeWidth={2.6} />
                    </td>
                  </tr>
                );
              })}
              {!filteredData.length && !loading && (
                <tr>
                  <td className="interactive-data-table__state-cell" colSpan={4}>
                    <div className="interactive-data-table__state">No market radar data available.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            <div className="flex gap-3 rounded-full border border-slate-200 bg-white/70 px-10 py-1 text-m text-black">
              {Object.keys(PULSE_COLORS).map((key) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PULSE_COLORS[key].dot }} />
                  <span>{PULSE_COLORS[key].label}</span>
                </div>
              ))}
            </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default MarketRadarTable;
