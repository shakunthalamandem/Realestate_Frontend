import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import IcMemoIndex from "../ic-memo/Index";
import { IcMemoTemplateData } from "../ic-memo/types";

type PfDemoIcMemoProps = {
  hasStarted: boolean;
  onGenerate: () => void;
  onBack: () => void;
  data?: IcMemoTemplateData | null;
};

const PfDemoIcMemo: React.FC<PfDemoIcMemoProps> = ({ hasStarted, onGenerate, onBack, data }) => {
  if (hasStarted) {
    return <IcMemoIndex data={data ?? null} onBack={onBack} />;
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9f0ff] text-[#22327f]">
          <FileText className="h-8 w-8" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#5b6aa5]">
          IC Memo
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Build your investment committee memo
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Click below to open the IC Memo template on the right side. All sections
          are connected through props and currently left empty for backend mapping later.
        </p>
        <button
          type="button"
          onClick={onGenerate}
          className="mx-auto mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#0fa77d] px-7 py-4 text-base font-semibold text-white shadow-[0_16px_30px_rgba(15,167,125,0.24)] transition hover:bg-[#0c8f6b]"
        >
          <span>Generate Your IC Memo</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PfDemoIcMemo;
