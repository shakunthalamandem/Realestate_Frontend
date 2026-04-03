import { IcMemoTemplateData } from "./types";

export const icMemoMockData: IcMemoTemplateData = {
  hero: {
    companyName: "Meridian Capital Partners",
    reportTitle: "Monthly Portfolio Performance Review",
    reportMonth: "March 2026",
    verdict:
      "Portfolio performing above underwriting - strong margins and revenue growth, with execution focus shifting to vacancy reduction and pricing optimization.",
    highlights: [
      {
        icon: "^",
        text: "60.21% NOI margin with $5.76M NOI supported by disciplined expense control (43.3% ratio)",
        signal: "green",
      },
      {
        icon: "!",
        text: "Vacancy loss at 11.64% remains the primary drag, with occupancy at 88.3%",
        signal: "yellow",
      },
      {
        icon: "$",
        text: "$404,968 mark-to-market upside identified with 34% units below market",
        signal: "green",
      },
      {
        icon: "+",
        text: "+10% revenue growth and -31% expense decline driving margin expansion",
        signal: "green",
      },
    ],
  },
  kpis: [
    {
      label: "Total Assets",
      value: "3",
      subtitle: "Snapshot",
      signal: "green",
    },
    { label: "Total Units", value: "328", subtitle: "Snapshot", signal: "green" },
    {
      label: "Net Operating Income",
      value: "$5.76M",
      subtitle: "Snapshot",
      signal: "green",
    },
    {
      label: "NOI Margin",
      value: "60.21%",
      subtitle: "Snapshot",
      signal: "green",
    },
    {
      label: "Average Occupancy",
      value: "88.30%",
      subtitle: "Snapshot",
      signal: "yellow",
    },
    {
      label: "Revenue / Unit",
      value: "$29,186",
      subtitle: "Snapshot",
      signal: "green",
    },
    {
      label: "Expense / Unit",
      value: "$12,467",
      subtitle: "Snapshot",
      signal: "green",
    },
    {
      label: "Vacancy Loss",
      value: "11.64%",
      subtitle: "Snapshot",
      signal: "yellow",
    },
  ],
  performanceSnapshot: {
    trends: [
      {
        label: "Revenue",
        values: [781286, 831699, 830568, 837523, 828966, 833623],
        color: "bg-blue-600",
      },
      {
        label: "Expenses",
        values: [471072, 285362, 305761, 419926, 321762, 308015],
        color: "bg-orange-500",
      },
      {
        label: "NOI",
        values: [337880, 573869, 556497, 443550, 542890, 557588],
        color: "bg-green-600",
      },
    ],
    trendFooterLabel: "6-Month Trend",
    trendFooterValue: "Revenue growth with disciplined margin expansion",
    insights: [
      {
        title: "What Improved",
        text: "NOI margin remains strong at 60.2%, supported by solid revenue per unit ($29,186) and consistent occupancy (88.3%). Revenue continues to outpace expense growth, indicating healthy operating leverage across the portfolio.",
        signal: "green",
      },
      {
        title: "What Declined",
        text: "Vacancy loss is elevated at 11.64%, signaling leasing pressure. Concessions (1.2%) are slightly higher, suggesting demand softness in select units or submarkets despite stable overall occupancy.",
        signal: "red",
      },
      {
        title: "What Matters Most",
        text: "Expense ratio is stable at 43.3%, but rising administrative costs and concessions could pressure margins if revenue momentum slows. Strong NOI performance is currently offsetting these risks, but vacancy + concessions trend needs close monitoring to sustain profitability.",
        signal: "neutral",
      },
    ],
  },
  leasingEngine: {
    metrics: [
      { label: "Renewal Rate", value: "60%", bar: 60, signal: "green" },
      { label: "Loss to Lease", value: "4%", bar: 4, signal: "neutral" },
      { label: "Units Below Market", value: "34%", bar: 34, signal: "neutral" },
      {
        label: "Lease Expirations (6 mo)",
        value: "99",
        bar: 50,
        signal: "neutral",
      },
      {
        label: "Mark to Market Opportunity",
        value: "$404,968",
        bar: 85,
        signal: "green",
      },
    ],
    sideTitle: "Revenue Engine Insight",
    sideSections: [
      {
        label: "PRICING POWER",
        text: "Moderate-to-Strong. Loss-to-lease of ~4.0% and 34% of units below market indicate meaningful mark-to-market opportunity, supporting continued rent growth as leases roll.",
      },
      {
        label: "DEMAND STRENGTH",
        text: "Stable. Renewal rate at 60% reflects moderate retention, while manageable loss-to-lease suggests tenants are absorbing rent increases without significant resistance.",
      },
      {
        label: "EMBEDDED UPSIDE",
        text: "~$400K+ near-term upside. Marking below-market units to current rents presents a clear revenue lift opportunity, likely realizable over the next 12–18 months, supported by a staggered lease expiration profile.",
      },
    ],
  },
  expenseIntelligence: {
    increases: [
      {
        label: "Payroll & Benefits",
        change: "+8.2%",
        amount: "+$31K/mo",
        reason: "Wage adjustments",
      },
      {
        label: "Utilities",
        change: "+4.1%",
        amount: "+$14K/mo",
        reason: "Seasonal",
      },
      {
        label: "Contract Services",
        change: "+2.8%",
        amount: "+$9K/mo",
        reason: "New contracts",
      },
    ],
    decreases: [
      {
        label: "Property Taxes",
        change: "-12.4%",
        amount: "-$62K/mo",
        reason: "Reassessment wins",
      },
      {
        label: "Insurance",
        change: "-6.1%",
        amount: "-$18K/mo",
        reason: "Policy renegotiation",
      },
      {
        label: "R&M",
        change: "-9.3%",
        amount: "-$24K/mo",
        reason: "Timing deferral",
      },
    ],
    efficiency: {
      statusTitle: "Improving",
      statusSubtitle:
        "Overall expenses are down 30% YoY, with major savings from taxes, utilities, and operating expenses outweighing increases in renting and grounds.",
      structuralSavings: 58,
      timingDriven: 42,
      structuralNote:
        "Driven by significant and likely sustainable reductions in taxes and utilities.",
      timingNote:
        "Partly supported by expense timing and deferrals, which may normalize.",
      note: "",
    },
  },
  riskRadar: {
    metrics: [
      {
        label: "Revenue at Risk (60 d)",
        value: "$120,428",
        detail: "WATCH",
        level: "medium",
      },
      {
        label: "Revenue at Risk (90 d)",
        value: "$140,628",
        detail: "WATCH",
        level: "medium",
      },
      {
        label: "Concentration Risk",
        value: "66%",
        detail: "ELEVATED",
        level: "high",
      },
      {
        label: "Stability Score",
        value: "70/100",
        detail: "LOW",
        level: "low",
      },
    ],
    assets: [
      {
        name: "Grand Oak Estates",
        badge: "Leasing Up Issue",
        badgeLevel: "red",
        description:
          "85.7% occupancy and declining revenue (-1.6%) are driving underperformance. High expense ratio (50%) is compressing NOI (55%) despite $228K MTM upside. Core Issue: Leasing inefficiency limiting revenue realization.",
        stats: [
          { label: "NOI Growth", value: "-35%" },
          { label: "Revenue Growth", value: "-1.6%" },
          { label: "Expense YoY", value: "-6.9%" },
        ],
      },
    ],
  },
  propertyIntelligence: {
    properties: [
      {
        name: "Summit Ridge Apartments",
        location: "Austin, TX - 428 Units - Year 2 of Hold",
        performance: "Strong",
        metrics: [
          { label: "Occupancy", value: "92.6%", signal: "green" },
          { label: "NOI Margin", value: "68.2%", signal: "green" },
          { label: "Rev Growth", value: "+2.8%", signal: "green" },
          { label: "Exp Ratio", value: "31.8%", signal: "green" },
          { label: "MTM", value: "$10,981", signal: "green" },
        ],
        insights: [
          "Strong fundamentals with 92.6% occupancy and 68.2% NOI margin, though NOI is slightly declining due to expense growth outpacing revenue.",
          "Revenue growth (+2.8%) remains steady, supported by consistent leasing activity and stable demand.",
          "Mark-to-market opportunity ($10,981+) and loss-to-lease (5.5%) indicate clear embedded rent upside across unit types.",
        ],
        risks: [
          "$2.1M revenue at risk with low avg renewal rate (43%), signaling weak tenant retention and higher churn risk.",
          "Heavy lease concentration (May–Aug) increases exposure to seasonal vacancy and execution risk.",
          "Tenant sentiment (3.2 rating, 55% positive) may limit pricing power and impact renewals.",
        ],
        opportunities: [
          "Capture $10,981+ MTM upside by aligning in-place rents to market across units.",
          "Drive renewal increases (+3–5%) supported by occupancy strength and rent gap.",
          "Projected revenue growth to $3.8M indicates strong forward momentum if execution risk is managed.",
        ],
        actions: [
          {
            priority: "HIGH",
            action: "Push renewals +3–5% on below-market units",
            impact: "Capture immediate MTM upside and improve NOI",
          },
          {
            priority: "HIGH",
            action: "Pre-lease May–Aug expirations aggressively",
            impact: "Protect ~$2.1M at-risk revenue and reduce vacancy spikes",
          },
          {
            priority: "MEDIUM",
            action:
              "Improve tenant experience (reviews + maintenance response)",
            impact: "Increase renewal rate and support rent growth",
          },
        ],
      },
      {
        name: "Lakeside Residential",
        location: "Phoenix, AZ - 372 Units - Year 2 of Hold",
        performance: "Stable",
        metrics: [
          { label: "Occupancy", value: "100%", signal: "green" },
          { label: "NOI Margin", value: "71.8%", signal: "green" },
          { label: "Rev Growth", value: "+90%", signal: "green" },
          { label: "Exp Ratio", value: "28.2%", signal: "yellow" },
          { label: "MTM", value: "$5,566", signal: "green" },
        ],
        insights: [
          "Fully stabilized asset with 100% occupancy and strong 71.8% NOI margin, supported by exceptional NOI growth (+80%) and revenue growth (+90%).",
          "Healthy renewal rate (72%) and strong tenant sentiment (4.0 rating, 70% positive) indicate solid demand and retention strength.",
          "However, negative mark-to-market (-$5.6K) suggests rents are already at or above market, limiting pricing upside.",
        ],
        risks: [
          "Revenue at risk ($1.7M) with lease concentration in July–August, increasing rollover exposure despite strong occupancy.",
          "Expense growth (+28%) is rising quickly and could pressure margins if sustained.",
          "Negative MTM across multiple unit types indicates limited ability to push rents further without impacting demand.",
        ],
        opportunities: [
          "Focus on operational efficiency and cost control to protect strong NOI margins rather than relying on rent growth.",
          "Leverage high occupancy and strong reviews to maintain pricing and minimize vacancy during lease rollover periods.",
          "Stabilized revenue base (~$1.1M projected) provides consistency, with upside driven more by retention than pricing.",
        ],
        actions: [
          {
            priority: "HIGH",
            action: "Pre-lease July–August expirations early",
            impact: "Protect ~$1.7M at-risk revenue and maintain full occupancy",
          },
          {
            priority: "HIGH",
            action: "Control expense growth (especially variable costs)",
            impact: "Preserve NOI margin amid rising operating costs",
          },
          {
            priority: "MEDIUM",
            action: "Optimize pricing strategy (avoid overpricing vs market)",
            impact: "Maintain occupancy and renewal strength given negative MTM",
          },
        ],
      },
      {
        name: "Grand Oak Estates",
        location: "85.7% Occupancy - NOI Margin 55% - Rev Growth -1.6% - Exp Ratio 50% - MTM 228780",
        performance: "Weak",
        metrics: [
          { label: "Occupancy", value: "85.7%", signal: "red" },
          { label: "NOI Margin", value: "55%", signal: "red" },
          { label: "Rev Growth", value: "-1.6%", signal: "red" },
          { label: "Exp Ratio", value: "50%", signal: "red" },
          { label: "MTM", value: "$228,780", signal: "green" },
        ],
        insights: [
          "Solid scale asset with $3.48M NOI, but performance is weakening with NOI down -35% YoY driven by revenue softness and operational pressure.",
          "Below-market opportunity ($228K MTM, +2.1% loss-to-lease) provides clear pricing upside across multiple unit types.",
          "Stable renewal base (75%) supports retention, but occupancy at 85.7% signals leasing inefficiency.",
        ],
        risks: [
          "~$2.0M revenue at risk with 24 upcoming expirations and uneven lease ladder concentration.",
          "Low tenant sentiment (3.7 rating, 63% positive, 0% response rate) may be limiting leasing velocity and pricing power.",
          "High expense ratio (50%) and declining revenue (-1.6%) indicate margin compression risk despite some cost control.",
        ],
        opportunities: [
          "Capture $228K+ MTM upside through targeted rent increases on underpriced units (1BR, 2BR variants).",
          "Lease-up opportunity: Improving occupancy from 85.7% toward stabilized levels can materially lift NOI.",
          "Projected revenue lift (~$2.7M) highlights strong upside if pricing + leasing execution improves.",
        ],
        actions: [
          {
            priority: "HIGH",
            action: "Accelerate lease-up strategy to push occupancy >90%",
            impact: "Improve revenue base and stabilize NOI",
          },
          {
            priority: "HIGH",
            action: "Push rents +4-6% on below-market units (selectively)",
            impact: "Capture MTM upside without hurting absorption",
          },
          {
            priority: "MEDIUM",
            action: "Fix reputation and operations (reviews, maintenance, response rate)",
            impact: "Improve leasing velocity and support pricing power",
          },
        ],
      },
    ],
  },
  aiInsights: {
    summary:
      "Portfolio upside exists but is uneven-driven by Grand Oak lease-up and pricing potential, while Summit and Lakeside require retention and cost discipline to sustain NOI.",
    items: [
      {
        title: "Revenue Impact",
        body: "Vacancy and lease rollover concentration are the largest drags on NOI, particularly at Grand Oak (85.7% occupancy) and seasonal spikes at Summit Ridge. Stabilizing occupancy across underperforming assets could unlock ~5-8% NOI uplift portfolio-wide.",
        signal: "red",
      },
      {
        title: "Pricing Opportunity",
        body: "Portfolio shows mixed pricing power: Grand Oak (+$228K MTM) offers strong upside, Summit Ridge (~$10,981 MTM) presents moderate upside, and Lakeside has negative MTM with limited upside. Targeted rent strategy can accelerate revenue capture timelines.",
        signal: "yellow",
      },
      {
        title: "Expense Risk",
        body: "Expense pressure is uneven: Summit Ridge and Lakeside are seeing rising costs (+7-28%), while Grand Oak carries a high expense ratio (50%) despite some decline. Without tighter cost controls, margin compression risk remains elevated across the portfolio.",
        signal: "yellow",
      },
      {
        title: "Portfolio Risk",
        body: "Revenue risk is concentrated with >$5M+ at-risk NOI across assets driven by lease expirations, weak occupancy at Grand Oak, and moderate renewal rates in the 40-70% range. Execution risk is high over the next 2-3 quarters.",
        signal: "red",
      },
      {
        title: "Strategy",
        body: "Portfolio requires a bifurcated approach: lease-up and pricing push at Grand Oak, renewal optimization and retention at Summit Ridge, and margin protection plus cost control at Lakeside. One-size pricing strategy will underperform.",
        signal: "yellow",
      },
      {
        title: "Cross-Portfolio Pattern",
        body: "Assets with strong tenant sentiment, such as Lakeside (4.0 rating), show higher renewal strength and pricing stability versus lower-rated assets like Grand Oak (3.7) and Summit (3.2). Improving tenant experience is directly correlated with NOI durability and rent growth success.",
        signal: "green",
      },
    ],
  },
  executionPriorities: {
    items: [
      {
        priority: "HIGH",
        action: "Accelerate lease-up at Grand Oak Estates (85.7% occupancy)",
        impact: "Recover vacancy loss and stabilize NOI",
        detail: "",
      },
      {
        priority: "HIGH",
        action: "Push renewals on below-market units (Grand Oak + Summit)",
        impact: "Capture $350K+ combined MTM upside over next 12 months",
        detail: "",
      },
      {
        priority: "HIGH",
        action: "Pre-lease upcoming expirations (Summit + Lakeside peak months)",
        impact: "Protect $3M+ revenue at risk and reduce seasonal vacancy spikes",
        detail: "",
      },
      {
        priority: "MEDIUM",
        action: "Control expense growth (Summit + Lakeside)",
        impact: "Prevent further NOI compression from rising operating costs",
        detail: "",
      },
      {
        priority: "MEDIUM",
        action: "Improve tenant experience (Summit + Grand Oak)",
        impact: "Lift renewal rates and support pricing power",
        detail: "",
      },
      {
        priority: "MONITOR",
        action: "Track leasing velocity and absorption (Grand Oak)",
        impact: "Ensure pricing actions do not slow occupancy recovery",
        detail: "",
      },
      {
        priority: "MONITOR",
        action: "Watch expense normalization (Lakeside)",
        impact: "Maintain margin strength as costs stabilize",
        detail: "",
      },
    ],
  },
  forwardOutlook: {
    columns: [
      {
        title: "Expected Trajectory",
        tone: "blue",
        items: [
          "NOI expected to stabilize and improve, led by Grand Oak lease-up.",
          "Occupancy is trending toward 92-96% portfolio-wide.",
          "Revenue growth should continue, but margin performance depends on cost control.",
        ],
      },
      {
        title: "Key Risks",
        tone: "red",
        items: [
          "Lease concentration at Summit and Lakeside creates elevated execution risk.",
          "Weak tenant sentiment at Summit and Grand Oak may pressure renewals.",
          "Expense growth at Lakeside and Summit could compress margins.",
        ],
      },
      {
        title: "Key Opportunities",
        tone: "green",
        items: [
          "Capture $350K+ of mark-to-market upside through targeted rent increases.",
          "Occupancy recovery at Grand Oak remains the biggest NOI lever.",
          "Retention improvement through better tenant experience can drive sustainable growth.",
        ],
      },
    ],
    footerTitle: "Forward Outlook - Next 60-90 Days",
    footerSubtitle:
      "Prepared by Asset Management & Analytics - Meridian Capital Partners",
    footerNote:
      "This document is confidential and intended solely for the Investment Committee.",
  },
};
