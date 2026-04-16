import { useCallback, useEffect, useState } from "react";
import { AISnapshot } from "./AISnapshot";
import { AppSidebar } from "./AppSidebar";
import { ComparisonBar } from "./ComparisonBar";
import { ComparisonView } from "./ComparisonView";
import { DealCharts } from "./DealCharts";
import { DealHeader } from "./DealHeader";
import { DealScorecard } from "./DealScorecard";
import { KeyMetrics } from "./KeyMetrics";
import { RisksOpportunities } from "./RisksOpportunities";
import { WhatMovesTheDeal } from "./WhatMovesTheDeal";
import { getDealById, useDealUnderwritingData } from "./data";

export default function DealUnderwritingLens() {
  const { deals, loading, error } = useDealUnderwritingData();
  const [activeDealId, setActiveDealId] = useState("");
  const [activeView, setActiveView] = useState<"deal" | "compare">("deal");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const activeDeal = getDealById(deals, activeDealId) ?? deals[0];

  useEffect(() => {
    if (!activeDealId && deals.length) {
      setActiveDealId(deals[0].id);
    }
  }, [activeDealId, deals]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }, []);

  const compareDeals = compareIds
    .map((id) => getDealById(deals, id))
    .filter((deal): deal is NonNullable<typeof deal> => Boolean(deal));

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center rounded-[28px] bg-[#f8fbff] text-[#62708d]">Loading deal underwriting data...</div>;
  }

  if (error) {
    return <div className="flex min-h-[60vh] items-center justify-center rounded-[28px] bg-[#f8fbff] text-[#b42318]">{error}</div>;
  }

  if (!deals.length) {
    return <div className="flex min-h-[60vh] items-center justify-center rounded-[28px] bg-[#f8fbff] text-[#62708d]">No property data available for underwriting.</div>;
  }

  return (
    <div className="flex min-h-screen overflow-hidden rounded-[28px] bg-[#f5f7fb] shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
      <AppSidebar
        activeDealId={activeDeal.id}
        activeView={activeView}
        deals={deals}
        onDealSelect={setActiveDealId}
        onViewChange={setActiveView}
      />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fbff]">
        <div className="mx-auto max-w-[1480px] px-8 py-10 pb-28 2xl:px-10">
          {activeView === "deal" ? (
            <>
              <DealHeader deal={activeDeal} isInCompare={compareIds.includes(activeDeal.id)} onAddCompare={toggleCompare} />
              <AISnapshot deal={activeDeal} />
              <KeyMetrics deal={activeDeal} />
              <div className="mb-6 grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-1"><DealScorecard deal={activeDeal} /></div>
                <div className="xl:col-span-2"><WhatMovesTheDeal deal={activeDeal} /></div>
              </div>
              <DealCharts deal={activeDeal} />
              <RisksOpportunities deal={activeDeal} />
            </>
          ) : (
            <ComparisonView deals={compareDeals} />
          )}
          <ComparisonBar
            compareIds={compareIds}
            deals={deals}
            onRemove={(id) => setCompareIds((current) => current.filter((item) => item !== id))}
            onCompare={() => setActiveView("compare")}
          />
        </div>
      </main>
    </div>
  );
}
