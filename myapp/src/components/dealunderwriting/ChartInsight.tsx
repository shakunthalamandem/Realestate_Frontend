interface ChartInsightProps {
  insight: string;
  impact: string;
  drives: string;
}

export function ChartInsight({ insight, impact, drives }: ChartInsightProps) {
  return (
    <div className="mt-4 rounded-xl border border-[#d7e2fb] bg-[#f6f8fe] p-3 text-sm text-[#183153]">
      <p className="mb-1">
        <span className="font-semibold">Insight:</span> {insight}
      </p>
      <p className="mb-1">
        <span className="font-semibold">Impact:</span> {impact}
      </p>
      <p>
        <span className="font-semibold">Drives:</span> {drives}
      </p>
    </div>
  );
}
