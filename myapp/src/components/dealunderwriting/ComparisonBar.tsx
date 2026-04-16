import { X } from "lucide-react";
import type { Deal } from "./data";

interface ComparisonBarProps {
  compareIds: string[];
  deals: Deal[];
  onRemove: (id: string) => void;
  onCompare: () => void;
}

export function ComparisonBar({ compareIds, deals, onRemove, onCompare }: ComparisonBarProps) {
  if (!compareIds.length) return null;

  return (
    <div className="sticky bottom-0 z-20 mt-6 border-t border-[#d7e2fb] bg-white px-4 py-3 shadow-[0_-10px_30px_rgba(10,27,84,0.08)]">
      <div className="flex flex-wrap items-center gap-3">
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

        <button
          type="button"
          className="rounded-xl border border-dashed border-[#aac0ea] px-3 py-2 text-sm text-[#6b84ad]"
        >
          + Add
        </button>

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
