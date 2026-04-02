import { IcMemoTemplateData } from "./types";

export const icMemoMockData: IcMemoTemplateData = {
  hero: {
    companyName: "Meridian Capital Partners",
    reportTitle: "Monthly Portfolio Performance Review",
    reportMonth: "March 2026",
    verdict:
      "Portfolio performing above underwriting - execution focus shifting from stabilization to revenue optimization.",
    highlights: [
      {
        icon: "^",
        text: "NOI margin expanded to 68.2% via expense control",
        signal: "green",
      },
      {
        icon: "!",
        text: "Vacancy remains the primary drag on performance",
        signal: "yellow",
      },
      {
        icon: "$",
        text: "$412K+ mark-to-market upside identified",
        signal: "green",
      },
      {
        icon: "+",
        text: "+2.1% MoM effective rent growth across portfolio",
        signal: "green",
      },
    ],
  },
  kpis: [
    { label: "Total Assets", value: "12", subtitle: "Sun Belt markets", signal: "green" },
    { label: "Total Units", value: "3,847", signal: "green" },
    { label: "Net Operating Income", value: "$2.14M", subtitle: "+4.8% MoM", signal: "green" },
    { label: "NOI Margin", value: "68.2%", subtitle: "+140bps MoM", signal: "green" },
    { label: "Occupancy", value: "94.3%", subtitle: "Target: 96%", signal: "yellow" },
    { label: "Revenue / Unit", value: "$816", subtitle: "4.2% below market", signal: "yellow" },
    { label: "Expense / Unit", value: "$260", subtitle: "8% below peers", signal: "green" },
    { label: "Vacancy Loss", value: "$196K", subtitle: "5.8% of GPR", signal: "red" },
  ],
  performanceSnapshot: {
    trends: [
      { label: "Revenue", values: [72, 75, 74, 78, 80, 82], color: "bg-blue-600" },
      { label: "Expenses", values: [35, 36, 34, 33, 31, 30],  color: "bg-orange-500" },
      { label: "NOI", values: [37, 39, 40, 45, 49, 52], color: "bg-green-600" },
    ],
    trendFooterLabel: "6-Month Trend",
    trendFooterValue: "Positive trajectory",
    insights: [
      {
        title: "What Improved",
        text:
          "NOI margin expanded 140bps MoM. Effective rent growth of 2.1% outpacing expense increases. 4 of last 5 months show consecutive NOI improvement.",
        signal: "green",
      },
      {
        title: "What Declined",
        text:
          "Vacancy concentrated at Riverstone Commons and Oakmont Ridge. These two assets account for most current portfolio vacancy loss.",
        signal: "red",
      },
      {
        title: "What Matters Most",
        text:
          "R&M deferral accounts for 42% of expense savings. This is timing-driven, not structural. Budget catch-up spend for Q2-Q3.",
        signal: "yellow",
      },
    ],
  },
  leasingEngine: {
    metrics: [
      { label: "Renewal Rate", value: "72.4%", bar: 72, signal: "green" },
      { label: "Loss-to-Lease", value: "4.2%", bar: 42, signal: "yellow" },
      {
        label: "Units Below Market",
        value: "1,308",
        subtitle: "34% of portfolio",
        bar: 34,
        signal: "yellow",
      },
      {
        label: "Lease Expirations (6mo)",
        value: "812",
        subtitle: "21.1% of units",
        bar: 21,
        signal: "red",
      },
      { label: "Mark-to-Market", value: "$412K", subtitle: "annualized upside", bar: 85, signal: "green" },
    ],
    sideTitle: "Revenue Engine Insight",
    sideSections: [
      {
        label: "Pricing Power",
        text: "Moderate-to-strong. Market rents continue to trend up, with room for measured renewal pushes.",
      },
      {
        label: "Demand Strength",
        text: "Renewal performance and new lease spreads point to healthy resident demand across the portfolio.",
      },
      {
        label: "Embedded Upside",
        text: "The current below-market unit mix leaves meaningful annualized upside over the next 12-18 months.",
      },
    ],
  },
  expenseIntelligence: {
    increases: [
      { label: "Payroll & Benefits", change: "+8.2%", amount: "+$31K/mo", reason: "Wage adjustments" },
      { label: "Utilities", change: "+4.1%", amount: "+$14K/mo", reason: "Seasonal" },
      { label: "Contract Services", change: "+2.8%", amount: "+$9K/mo", reason: "New contracts" },
    ],
    decreases: [
      { label: "Property Taxes", change: "-12.4%", amount: "-$62K/mo", reason: "Reassessment wins" },
      { label: "Insurance", change: "-6.1%", amount: "-$18K/mo", reason: "Policy renegotiation" },
      { label: "R&M", change: "-9.3%", amount: "-$24K/mo", reason: "Timing deferral" },
    ],
    efficiency: {
      statusTitle: "Improving",
      statusSubtitle: "Net savings outpacing increases",
      structuralSavings: 58,
      timingDriven: 42,
      note: "R&M deferral will normalize in Q2. Budget catch-up spend and monitor cost absorption.",
    },
  },
  riskRadar: {
    metrics: [
      { label: "Revenue at Risk (60d)", value: "$148K", detail: "4.7%", level: "medium" },
      { label: "Revenue at Risk (90d)", value: "$234K", detail: "7.5%", level: "high" },
      { label: "Concentration Risk", value: "41.2%", detail: "Top 3 assets", level: "medium" },
      { label: "Stability Score", value: "8.1/10", detail: "Strong", level: "low" },
    ],
    assets: [
      {
        name: "Riverstone Commons",
        badge: "Pricing Issue",
        badgeLevel: "red",
        description:
          "Occupancy softness is tied to post-renovation pricing that currently sits above the relevant comp set.",
        stats: [
          { label: "NOI Margin:", value: "58.4%" },
          { label: "Impact:", value: "$58K/mo" },
        ],
      },
      {
        name: "Oakmont Ridge",
        badge: "Operational",
        badgeLevel: "yellow",
        description:
          "Elevated turnover and slower maintenance responsiveness continue to weigh on occupancy and resident retention.",
        stats: [
          { label: "Turnover:", value: "18%" },
          { label: "Type:", value: "Structural" },
        ],
      },
    ],
  },
  propertyIntelligence: {
    properties: [
      {
        name: "Summit Place",
        location: "Austin, TX - 428 Units - Year 2 of Hold",
        performance: "Strong",
        metrics: [
          { label: "Occupancy", value: "96.8%", signal: "green" },
          { label: "NOI Margin", value: "72.1%", signal: "green" },
          { label: "Rev Growth", value: "+8.2%", signal: "green" },
          { label: "Exp Ratio", value: "27.9%", signal: "green" },
          { label: "LTL", value: "12.0%", signal: "yellow" },
          { label: "MTM", value: "$148K", signal: "green" },
        ],
        insights: [
          "Strongest portfolio performer with outsized revenue growth and sustained pricing power.",
          "Occupancy remains above portfolio average and supports measured rent pushes.",
          "Below-market legacy leases continue to leave embedded upside in the asset.",
        ],
        risks: [
          "Concentration risk remains elevated due to NOI weighting within the overall portfolio.",
          "Austin supply pipeline needs monitoring over the next 12 months.",
          "Upcoming expirations should be pre-leased to protect momentum.",
        ],
        opportunities: [
          "Push renewals on below-market units through natural rollover.",
          "Capture amenity premium where renovation scope supports it.",
          "Leverage market strength before new supply fully delivers.",
        ],
        actions: [
          { priority: "HIGH", action: "Push renewals on below-market units", impact: "Capture annualized NOI upside" },
          { priority: "HIGH", action: "Pre-lease upcoming expirations", impact: "Reduce vacancy loss and turnover cost" },
          { priority: "MEDIUM", action: "Evaluate amenity upgrade ROI", impact: "Test additional rent premium potential" },
        ],
      },
      {
        name: "The Meridian at Chandler",
        location: "Phoenix, AZ - 372 Units - Year 2 of Hold",
        performance: "Stable",
        metrics: [
          { label: "Occupancy", value: "95.1%", signal: "green" },
          { label: "NOI Margin", value: "66.8%", signal: "green" },
          { label: "Rev Growth", value: "+5.4%", signal: "green" },
          { label: "Exp Ratio", value: "33.2%", signal: "yellow" },
          { label: "LTL", value: "6.3%", signal: "yellow" },
          { label: "MTM", value: "$89K", signal: "green" },
        ],
        insights: [
          "Stable occupancy and recent improvements validate the operating plan.",
          "Amenity-driven premiums are showing through on renewals.",
          "Expense pressure is present but remains manageable.",
        ],
        risks: [
          "Lease expiration concentration is high over the next 90 days.",
          "Insurance-related uncertainty may affect near-term cost performance.",
          "Competitive concessions in the submarket should be monitored closely.",
        ],
        opportunities: [
          "Extend amenity premiums across remaining un-upgraded units.",
          "Reduce concessions as velocity improves.",
          "Pilot ancillary income programs on upcoming renewals.",
        ],
        actions: [
          { priority: "HIGH", action: "Launch renewal campaign on near-term expirations", impact: "Protect retention and pricing" },
          { priority: "HIGH", action: "Reduce concessions where feasible", impact: "Recover annualized revenue" },
          { priority: "MEDIUM", action: "Resolve pending insurance exposure", impact: "Reduce expense drag" },
        ],
      },
      {
        name: "Riverstone Commons",
        location: "Charlotte, NC - 316 Units - Year 1 of Hold",
        performance: "Weak",
        metrics: [
          { label: "Occupancy", value: "89.1%", signal: "red" },
          { label: "NOI Margin", value: "58.4%", signal: "red" },
          { label: "Rev Growth", value: "+1.1%", signal: "yellow" },
          { label: "Exp Ratio", value: "41.6%", signal: "red" },
          { label: "LTL", value: "-2.8%", signal: "red" },
          { label: "MTM", value: "-$34K", signal: "red" },
        ],
        insights: [
          "Performance remains pressured by aggressive renovated-unit pricing.",
          "Vacancy drag is concentrated and actionable with pricing correction.",
          "Turn costs are compounding the NOI underperformance.",
        ],
        risks: [
          "Revenue erosion continues if pricing is not reset quickly.",
          "Submarket softness could prolong lease-up timing.",
          "Expense ratio is the highest in the current portfolio set.",
        ],
        opportunities: [
          "Reset pricing to improve absorption on renovated inventory.",
          "Renegotiate vendor costs to reduce turn expense.",
          "Test alternate lease-up channels while occupancy stabilizes.",
        ],
        actions: [
          { priority: "HIGH", action: "Implement pricing reset on vacant renovated units", impact: "Recover monthly revenue and occupancy" },
          { priority: "HIGH", action: "Launch focused leasing blitz", impact: "Speed absorption and improve cash flow" },
          { priority: "MEDIUM", action: "Renegotiate turn-cost vendors", impact: "Reduce annual operating cost" },
        ],
      },
    ],
  },
  aiInsights: {
    summary:
      "The portfolio is showing healthy top-line momentum, but targeted operational follow-through is needed to fully convert embedded upside and protect near-term occupancy.",
    items: [
      {
        title: "Revenue Signal",
        body: "Mark-to-market and renewal trends suggest continued upside if pricing discipline is maintained asset by asset.",
        signal: "green",
      },
      {
        title: "Risk Signal",
        body: "Vacancy concentration remains the clearest drag and should stay at the top of weekly operating reviews.",
        signal: "red",
      },
      {
        title: "Execution Signal",
        body: "The next phase of value creation depends more on portfolio execution than on broad market tailwinds.",
        signal: "yellow",
      },
    ],
  },
  executionPriorities: {
    items: [
      {
        priority: "HIGH",
        action: "Implement pricing reset at Riverstone Commons",
        impact: "Recover monthly lost revenue",
        detail: "Target occupancy improvement over the next 60 days",
      },
      {
        priority: "HIGH",
        action: "Launch proactive renewal campaign",
        impact: "Lock in higher renewals and lower turnover cost",
        detail: "Focus first on assets with highest expiration concentration",
      },
      {
        priority: "HIGH",
        action: "Push renewals toward market on below-market units",
        impact: "Unlock annualized NOI upside",
        detail: "Achievable through natural rollover over the next 12-18 months",
      },
      {
        priority: "MEDIUM",
        action: "Deploy maintenance response protocol at Oakmont Ridge",
        impact: "Lower turnover and improve retention",
        detail: "Address resident service issues behind non-renewal decisions",
      },
      {
        priority: "MONITOR",
        action: "Evaluate reinvestment versus distribution allocation",
        impact: "Support capital planning decisions",
        detail: "Reassess once Q2 trajectory is confirmed",
      },
    ],
  },
  forwardOutlook: {
    columns: [
      {
        title: "Expected Trajectory",
        tone: "blue",
        items: [
          "NOI expected to remain on a positive trend with upside from targeted repricing actions.",
          "Expense normalization should be manageable if deferred items are budgeted proactively.",
          "Occupancy is expected to stabilize as asset-specific action plans are executed.",
        ],
      },
      {
        title: "Key Risks",
        tone: "red",
        items: [
          "Watch leasing velocity at Riverstone after pricing changes.",
          "Monitor turnover and service metrics at Oakmont Ridge.",
          "Confirm tax and insurance assumptions continue to hold through Q2.",
        ],
      },
      {
        title: "Key Opportunities",
        tone: "green",
        items: [
          "Continue capturing renewal upside on below-market unit exposure.",
          "Use stronger-performing assets to test incremental premium strategies.",
          "Prepare portfolio decisions for year-3 hold and capital recycling discussions.",
        ],
      },
    ],
    footerTitle: "End of Memorandum",
    footerSubtitle: "Prepared by Asset Management & Analytics - Meridian Capital Partners",
    footerNote: "This document is confidential and intended solely for the Investment Committee.",
  },
};
