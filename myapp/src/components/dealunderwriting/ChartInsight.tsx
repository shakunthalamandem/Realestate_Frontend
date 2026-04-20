interface ChartInsightProps {
  insight: string;
  impact: string;
  drives: string;
}

export function ChartInsight({ insight, impact, drives }: ChartInsightProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">

      <div className="rounded-lg border border-gray-200 bg-white pl-4 pr-4 py-3 text-sm border-l-[3px] border-l-blue-500">
        <div className="flex items-center gap-1.5 mb-2">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#3B82F6" strokeWidth="1.5"/>
            <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" fill="#3B82F6"/>
            <circle cx="8" cy="5" r="0.9" fill="#3B82F6"/>
          </svg>
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Insight</span>
        </div>
        <p className="text-gray-800 leading-snug">{insight}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white pl-4 pr-4 py-3 text-sm border-l-[3px] border-l-teal-500">
        <div className="flex items-center gap-1.5 mb-2">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 13 L6 9 L9 11 L13 5" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="11,5 13,5 13,7" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider">Impact</span>
        </div>
        <p className="text-gray-800 leading-snug">{impact}</p>
      </div>

      {/* {drives && (
        <div className="col-span-2 rounded-lg border border-gray-200 bg-white pl-4 pr-4 py-3 text-sm border-l-[3px] border-l-purple-500">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M8 2 L8 14 M2 8 L14 8" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Drives</span>
          </div>
          <p className="text-gray-800 leading-snug">{drives}</p>
        </div>
      )} */}

    </div>
  );
}
