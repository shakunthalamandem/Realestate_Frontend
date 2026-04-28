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
import { exportElementToPdf } from "@/lib/pdf-export";
import { ArrowLeft, Download } from "lucide-react";

const IcMemoIndex = ({
  data,
  onBack,
}: {
  data?: IcMemoTemplateData | null;
  onBack?: () => void;
}) => {
  return (
    <div className="min-h-screen bg-[#f5f7fc]">
      <div className="mx-auto max-w-[1400px] px-2 py-2 sm:px-3 md:py-2 lg:px-4">
        <div data-html2canvas-ignore="true" className="mb-3 flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() =>
              exportElementToPdf({
                elementId: "ic-memo-pdf-export",
                fileName: "icmemo",
                orientation: "l",
                format: "a3",
                pageMarginMm: 8,
                paginateByChildren: true,
                exportWidthPx: 1587,  // was 1240 — matches A3 landscape content width
                imageScale: 2,         // add this — prevents canvas OOM at larger widths
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-[#0A1B54] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#12286A]"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>

        <div id="ic-memo-pdf-export" className="space-y-5 md:space-y-7">
          <div className="pdf-flow-block">
            <div className="space-y-4">
              <HeroSection data={data?.hero} />
              <div>
                <KpiStrip items={data?.kpis} />
              </div>
            </div>
          </div>

          <div className="pdf-flow-block">
            <div className="space-y-4">
              <div>
                <PerformanceSnapshot data={data?.performanceSnapshot} />
              </div>
              <div>
                <LeasingEngine data={data?.leasingEngine} />
              </div>
            </div>
          </div>

          <div className="pdf-flow-block">
            <div className="space-y-4">
              <div>
                <ExpenseIntelligence data={data?.expenseIntelligence} />
              </div>
              <div>
                <RiskRadar data={data?.riskRadar} />
              </div>
            </div>
          </div>

          <PropertyIntelligence data={data?.propertyIntelligence} />
          <AiInsights data={data?.aiInsights} />
          <ExecutionPriorities data={data?.executionPriorities} />

          <div className="pdf-flow-block">
            <ForwardOutlook data={data?.forwardOutlook} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IcMemoIndex;
