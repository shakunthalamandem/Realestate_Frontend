import HeroSection from "@/components/ic-memo/HeroSection";
import KpiStrip from "@/components/ic-memo/KpiStrip";
import PerformanceSnapshot from "@/components/ic-memo/PerformanceSnapshot";
import LeasingEngine from "@/components/ic-memo/LeasingEngine";
import ExpenseIntelligence from "@/components/ic-memo/ExpenseIntelligence";
import RiskRadar from "@/components/ic-memo/RiskRadar";
import PropertyIntelligence from "@/components/ic-memo/PropertyIntelligence";
import AiInsights from "@/components/ic-memo/AiInsights";
import ExecutionPriorities from "@/components/ic-memo/ExecutionPriorities";
import ForwardOutlook from "@/components/ic-memo/ForwardOutlook";
import { IcMemoTemplateData } from "@/components/ic-memo/types";
import { ArrowLeft } from "lucide-react";

const IcMemoIndex = ({
  data,
  onBack,
}: {
  data?: IcMemoTemplateData | null;
  onBack?: () => void;
}) => {
  return (
    <div className="min-h-screen bg-[#f5f7fc]">
      <div className="mx-auto max-w-[1400px] space-y-5 px-2 py-2 sm:px-3 md:space-y-7 md:py-2 lg:px-4">
        {onBack ? (
          <div className="mb-0.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
        ) : null}
        <HeroSection data={data?.hero} />
        <KpiStrip items={data?.kpis} />
        <PerformanceSnapshot data={data?.performanceSnapshot} />
        <LeasingEngine data={data?.leasingEngine} />
        <ExpenseIntelligence data={data?.expenseIntelligence} />
        <RiskRadar data={data?.riskRadar} />
        <PropertyIntelligence data={data?.propertyIntelligence} />
        <AiInsights data={data?.aiInsights} />
        <ExecutionPriorities data={data?.executionPriorities} />
        <ForwardOutlook data={data?.forwardOutlook} />
      </div>
    </div>
  );
};

export default IcMemoIndex;
