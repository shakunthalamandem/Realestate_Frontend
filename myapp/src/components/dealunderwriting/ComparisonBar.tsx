import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Deal } from "./data";

interface ComparisonBarProps {
  compareIds: string[];
  deals: Deal[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onCompare: () => void;
}

export function ComparisonBar({ compareIds, deals, onAdd, onRemove, onCompare }: ComparisonBarProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const availableDeals = useMemo(
    () => deals.filter((deal) => !compareIds.includes(deal.id)),
    [compareIds, deals]
  );

  if (!compareIds.length) return null;

  return (
    <div className="fixed bottom-0 left-[17.5rem] right-6 z-40">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#d7e2fb] bg-white px-4 py-3 shadow-[0_-10px_30px_rgba(10,27,84,0.08)]">
        <span className="text-sm text-[#5b647f]">Compare:</span>
        {compareIds.map((id) => {
          const deal = deals.find((item) => item.id === id);
          return (
            <div
              key={id}
              className="inline-flex items-center gap-2 rounded-xl bg-[#edf3ff] px-3 py-2 text-sm font-medium text-[#25467c]"
            >
              <span>{deal?.name ?? id}</span>
              <button
                type="button"
                onClick={() => onRemove(id)}
                className="text-[#436394] transition hover:text-[#0a1b54]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen((current) => !current)}
            disabled={!availableDeals.length}
            className="rounded-xl border border-dashed border-[#aac0ea] px-3 py-2 text-sm text-[#6b84ad] disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add
          </button>
          {isPickerOpen && availableDeals.length ? (
            <div className="absolute bottom-[calc(100%+0.5rem)] left-0 w-64 rounded-xl border border-[#d7e2fb] bg-white p-2 shadow-[0_10px_30px_rgba(10,27,84,0.12)]">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b84ad]">
                Add Property
              </div>
              <div className="max-h-56 space-y-1 overflow-y-auto">
                {availableDeals.map((deal) => (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => {
                      onAdd(deal.id);
                      setIsPickerOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#25467c] transition hover:bg-[#edf3ff]"
                  >
                    {deal.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          disabled={compareIds.length < 2}
          onClick={onCompare}
          className="ml-auto rounded-xl bg-[#284f88] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1e4278] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare Now 
        </button>
      </div>
    </div>
  );
}
