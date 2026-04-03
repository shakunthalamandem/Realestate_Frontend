import { SectionHeader } from "./KpiStrip";
import { IcExpenseIntelligenceData, IcExpenseRow } from "./types";

const ExpenseList = ({
  title,
  tone,
  rows = [],
}: {
  title: string;
  tone: "green" | "red";
  rows?: IcExpenseRow[] | null;
}) => {
  const styles =
    tone === "green"
      ? {
          text: "text-green-700",
          bg: "bg-green-100",
          heading: "text-green-700",
        }
      : { text: "text-red-700", bg: "bg-red-100", heading: "text-red-700" };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p
        className={`mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${styles.heading}`}
      >
        {title}
      </p>
      <div className="space-y-3">
        {Array.from({ length: Math.max(rows?.length ?? 0, 3) }).map(
          (_, index) => {
            const item = rows?.[index];
            return (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border border-gray-100 p-3 shadow-sm ${styles.bg}`}
              >
                <div>
                  <p className="min-h-[20px] text-sm font-medium text-slate-900">
                    {item?.label ?? ""}
                  </p>
                  <p className="min-h-[16px] text-xs text-slate-500">
                    {item?.reason ?? ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`min-h-[20px] text-sm font-bold ${styles.text}`}
                  >
                    {item?.change ?? ""}
                  </p>
                  <p className="min-h-[16px] text-xs text-slate-500">
                    {item?.amount ?? ""}
                  </p>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

const ExpenseIntelligence = ({
  data,
}: {
  data?: IcExpenseIntelligenceData | null;
}) => {
  const efficiency = data?.efficiency;

  return (
    <section>
      <SectionHeader number="05" title="Expense Intelligence" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ExpenseList title="↑ Cost Increases" tone="red" rows={data?.increases} />
        <ExpenseList title="↓ Cost Decreases" tone="green" rows={data?.decreases} />

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Cost Efficiency Signal
          </p>

          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-200 text-green-700">
                <span className="text-2xl">✓</span>
              </div>
              <p className="min-h-[24px] text-lg font-bold text-green-700">
                {efficiency?.statusTitle ?? ""}
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {efficiency?.statusSubtitle ?? ""}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Structural savings</span>
                <span className="text-base font-semibold text-slate-900">
                  {efficiency?.structuralSavings != null
                    ? `${efficiency.structuralSavings}%`
                    : ""}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#E5E7EB]">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${efficiency?.structuralSavings ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {efficiency?.structuralNote ?? ""}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Timing-driven</span>
                <span className="text-base font-semibold text-slate-900">
                  {efficiency?.timingDriven != null
                    ? `${efficiency.timingDriven}%`
                    : ""}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#E5E7EB]">
                <div
                  className="h-2 rounded-full bg-amber-400"
                  style={{ width: `${efficiency?.timingDriven ?? 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {efficiency?.timingNote ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpenseIntelligence;
