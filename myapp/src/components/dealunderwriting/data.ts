import { useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-api";
import { isDemoMode } from "@/lib/demo-mode";
import type { IcMemoTemplateData, IcPropertyCardData } from "@/components/ic-memo/types";

export type DealSignal = "Strong Buy" | "Buy" | "Neutral" | "Avoid";

type TrendPoint = {
  month?: string;
  value?: number;
};

type RevenueExpensePoint = {
  month?: string;
  revenue?: number;
  expense?: number;
};

type PropertyResponse = {
  kpis?: {
    noi?: number;
    noiMargin?: number;
    revenue?: number;
    revenueYoY?: number;
    expenseRatio?: number;
    expenseYoY?: number;
    occupancy?: number;
    lossToLease?: number;
    markToMarket?: number;
    renewalRate?: number;
  };
  trends?: {
    noiTrend12Month?: TrendPoint[];
    revenueVsExpense?: RevenueExpensePoint[];
  };
  property?: {
    units?: number;
    location?: string;
    yearBuilt?: number | null;
  };
  intelligence?: {
    overview?: string;
    aiGuidedRecommendations?: string[];
    riskAlert?: {
      riskScore?: number;
      riskDrivers?: string[];
      revenueAtRisk?: number;
      expiringUnits?: number;
      expiringUnitsNext90Days?: number;
      avgTenure?: number;
      avgTenureMonths?: number;
      confidence?: string;
      whyThisMatters?: string;
      nextBestActions?: string[];
    };
    marketMomentum?: {
      vacancy?: string;
      vacancyTrend?: string;
      rentGrowth?: string;
      rentGrowthTrend?: string;
      momentumView?: string;
      confidence?: string;
      whyThisMatters?: string;
      nextBestActions?: string[];
    };
    reviewIntelligence?: {
      avgRating?: number;
      rating?: number;
      ratingScore?: number;
      sentimentPercent?: number;
      sentimentPositive?: number;
      keyStrengths?: string[];
      keyRisks?: string[];
    };
  };
  rentComparison?: Array<{
    unitType?: string;
    market?: number;
    inPlace?: number;
  }> | {
    averageMarketRent?: number | null;
    averageInPlaceRent?: number | null;
    totalMarkToMarket?: number | null;
    lossToLeasePercent?: number | null;
  };
  leaseExpirationLadder?: Array<{
    month?: string;
    units?: number;
  }>;
};

type PropertyRecord = {
  property_name?: string;
  submarket?: string;
  region?: string;
  address?: string;
  location?: string;
  class_type?: string;
  units?: number | string;
  occupancy?: string | number;
  property_response?: PropertyResponse | null;
};

type AiRentResponse = {
  dashboard?: {
    charts?: {
      inPlaceVsRecommended?: Array<{
        unitType?: string;
        inPlace?: number;
        market?: number;
        recommended?: number;
      }>;
      renewalVsNewLeaseSplit?: Array<{
        month?: string;
        renewals?: number;
        newLeases?: number;
      }>;
      revenueProjection12Months?: Array<{
        month?: string;
        projectedRevenue?: number;
      }>;
    };
    basic_info?: {
      revenueAtRisk?: number;
      avgrenewalrate?: number;
      mtmcapturepotential?: number;
      projected12MonthRevenue?: number;
      totalprojectedrevenuelift?: number;
    };
    unitSummary?: Array<{
      unitType?: string;
      units?: string;
      inPlace?: number;
      market?: number;
      recommended?: number;
      annualRevenueLift?: number | string;
    }>;
  };
};

type AiRentRecord = {
  property_name?: string;
  ai_rent_intelligence_response?: AiRentResponse | null;
};

export interface Deal {
  id: string;
  name: string;
  address: string;
  strategy: "Core" | "Core+" | "Value-Add" | "Opportunistic";
  units: number;
  yearBuilt: number;
  askingPrice: number;
  signal: DealSignal;
  confidence: number;
  thesis: string;
  metrics: {
    noi: number;
    noiMargin: number;
    revenuePerUnit: number;
    expenseRatio: number;
    totalExpenses: number;
    occupancy: number;
    vacancyLoss: number;
    rentGap: number;
  };
  scores: {
    overall: number;
    marketPosition: number;
    cashFlowStability: number;
    valueAddPotential: number;
    riskLevel: number;
  };
  movers: {
    rentIncrease: number;
    expenseOptimization: number;
    occupancyImprovement: number;
  };
  risks: Array<{
    title: string;
    severity: "High" | "Medium" | "Low";
    impact: string;
    explanation: string;
  }>;
  opportunities: Array<{
    title: string;
    severity: "High" | "Medium" | "Low";
    impact: string;
    explanation: string;
  }>;
  tenantMix: Array<{ name: string; percentage: number }>;
  rentVsMarket: Array<{ type: string; current: number; market: number }>;
  noiProjection: Array<{ year: string; noi: number }>;
  revenueVsExpenses: Array<{ month: string; revenue: number; expenses: number }>;
  expenseBreakdown: Array<{ category: string; amount: number }>;
  leaseExpirations: Array<{ year: string; units: number }>;
  occupancyHistory: Array<{ month: string; occupancy: number; vacancy: number }>;
  tenantConcentration: Array<{ tenant: string; revenue: number }>;
  chartInsights: Record<
    | "tenantMix"
    | "rentVsMarket"
    | "noiProjection"
    | "revenueVsExpenses"
    | "expenseBreakdown"
    | "expenseDistribution"
    | "leaseExpirations"
    | "occupancyVacancy"
    | "tenantConcentration",
    {
      insight: string;
      impact: string;
      drives: string;
    }
  >;
}

type DealDataState = {
  deals: Deal[];
  loading: boolean;
  error: string | null;
};

const defaultDealIds = ["deal-a", "deal-b", "deal-c"];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const toPercent = (value: unknown, fallback = 0) => {
  const parsed = toNumber(value, fallback);
  return parsed <= 1 ? parsed * 100 : parsed;
};

const titleCase = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

function getStrategy(classType?: string, riskLevel?: number, rentGap?: number): Deal["strategy"] {
  const normalized = (classType ?? "").toUpperCase();
  if (normalized === "A") return "Core";
  if (normalized === "B" && (riskLevel ?? 0) < 35) return "Core+";
  if ((rentGap ?? 0) >= 10 || normalized === "C") return "Value-Add";
  return "Opportunistic";
}

function getSeverity(score: number): "High" | "Medium" | "Low" {
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function getSignal(overall: number, riskLevel: number): DealSignal {
  if (overall >= 80 && riskLevel < 45) return "Strong Buy";
  if (overall >= 68 && riskLevel < 55) return "Buy";
  if (overall >= 55) return "Neutral";
  return "Avoid";
}

function getConfidence(overall: number, riskLevel: number) {
  return clamp(Math.round(overall - riskLevel * 0.15 + 15));
}

function getIcPropertyCard(memoData: IcMemoTemplateData | null, propertyName: string) {
  const properties = memoData?.propertyIntelligence?.properties ?? [];
  return properties.find(
    (property) => property.name?.trim().toLowerCase() === propertyName.trim().toLowerCase()
  );
}

function deriveScores(
  propertyResponse: PropertyResponse | null | undefined,
  aiRent: AiRentResponse | null | undefined
) {
  const kpis = propertyResponse?.kpis;
  const riskAlert = propertyResponse?.intelligence?.riskAlert;
  const review = propertyResponse?.intelligence?.reviewIntelligence;

  const occupancy = toPercent(kpis?.occupancy);
  const noiMargin = toPercent(kpis?.noiMargin);
  const expenseRatio = toPercent(kpis?.expenseRatio);
  const lossToLease = toPercent(kpis?.lossToLease);
  const reviewRating = toNumber(review?.ratingScore ?? review?.avgRating ?? review?.rating, 3.5);
  const riskScore = toNumber(riskAlert?.riskScore, 50);
  const mtm = toNumber(
    aiRent?.dashboard?.basic_info?.mtmcapturepotential ?? kpis?.markToMarket,
    0
  );
  const totalLift = toNumber(aiRent?.dashboard?.basic_info?.totalprojectedrevenuelift, 0);

  const marketPosition = clamp(
    Math.round(occupancy * 0.45 + noiMargin * 0.2 + reviewRating * 10 + 15)
  );
  const cashFlowStability = clamp(
    Math.round(occupancy * 0.55 + noiMargin * 0.35 - expenseRatio * 0.1 + 10)
  );
  const valueAddPotential = clamp(
    Math.round(lossToLease * 1.6 + Math.min(mtm / 10000, 25) + Math.min(totalLift / 30000, 25))
  );
  const riskLevel = clamp(Math.round(riskScore || 100 - occupancy + expenseRatio * 0.4));
  const overall = clamp(
    Math.round(
      marketPosition * 0.25 +
        cashFlowStability * 0.3 +
        valueAddPotential * 0.25 +
        (100 - riskLevel) * 0.2
    )
  );

  return { marketPosition, cashFlowStability, valueAddPotential, riskLevel, overall };
}

function buildTenantMix(aiRent: AiRentResponse | null | undefined) {
  const unitSummary = aiRent?.dashboard?.unitSummary ?? [];
  const numericUnits = unitSummary
    .map((item) => ({
      name: item.unitType || "Unit",
      units: toNumber(item.units),
    }))
    .filter((item) => item.units > 0);

  const totalUnits = numericUnits.reduce((sum, item) => sum + item.units, 0);
  if (!totalUnits) {
    return [
      { name: "1BR", percentage: 40 },
      { name: "2BR", percentage: 45 },
      { name: "3BR", percentage: 15 },
    ];
  }

  return numericUnits.map((item) => ({
    name: item.name,
    percentage: Math.round((item.units / totalUnits) * 100),
  }));
}

function buildRentVsMarket(
  propertyResponse: PropertyResponse | null | undefined,
  aiRent: AiRentResponse | null | undefined
) {
  const rentComparison = propertyResponse?.rentComparison;
  if (Array.isArray(rentComparison) && rentComparison.length) {
    return rentComparison.map((item) => ({
      type: item.unitType || "Unit",
      current: toNumber(item.inPlace),
      market: toNumber(item.market),
    }));
  }

  const inPlaceChart = aiRent?.dashboard?.charts?.inPlaceVsRecommended ?? [];
  if (inPlaceChart.length) {
    return inPlaceChart.map((item) => ({
      type: item.unitType || "Unit",
      current: toNumber(item.inPlace),
      market: toNumber(item.market || item.recommended),
    }));
  }

  return [
    { type: "1BR", current: 1400, market: 1500 },
    { type: "2BR", current: 1650, market: 1800 },
  ];
}

function buildNoiProjection(propertyResponse: PropertyResponse | null | undefined, currentNoi: number) {
  const trend = propertyResponse?.trends?.noiTrend12Month ?? [];
  if (trend.length >= 4) {
    const recent = trend.slice(-4);
    return recent.map((point, index) => ({
      year: String(new Date().getFullYear() + index),
      noi: toNumber(point.value, currentNoi),
    }));
  }

  return Array.from({ length: 5 }, (_, index) => ({
    year: String(new Date().getFullYear() + index),
    noi: Math.round(currentNoi * (1 + index * 0.06)),
  }));
}

function buildRevenueVsExpenses(propertyResponse: PropertyResponse | null | undefined, revenue: number, expenseRatio: number) {
  const points = propertyResponse?.trends?.revenueVsExpense ?? [];
  if (points.length) {
    return points.map((point) => ({
      month: point.month || "",
      revenue: toNumber(point.revenue),
      expenses: toNumber(point.expense),
    }));
  }

  const monthlyRevenue = revenue / 12;
  const monthlyExpense = monthlyRevenue * (expenseRatio / 100);
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    month,
    revenue: Math.round(monthlyRevenue * (0.97 + index * 0.01)),
    expenses: Math.round(monthlyExpense * (0.98 + index * 0.008)),
  }));
}

function buildExpenseBreakdown(totalExpenses: number) {
  const weights = [
    ["Payroll", 0.32],
    ["Maintenance", 0.2],
    ["Utilities", 0.15],
    ["Insurance", 0.12],
    ["Property Tax", 0.18],
    ["Admin", 0.03],
  ] as const;

  return weights.map(([category, weight]) => ({
    category,
    amount: Math.round(totalExpenses * weight),
  }));
}

function buildLeaseExpirations(propertyResponse: PropertyResponse | null | undefined, units: number) {
  const ladder = propertyResponse?.leaseExpirationLadder ?? [];
  if (ladder.length) {
    return ladder.map((item) => ({
      year: item.month || "Period",
      units: toNumber(item.units),
    }));
  }

  return [
    { year: "2024", units: Math.round(units * 0.18) },
    { year: "2025", units: Math.round(units * 0.26) },
    { year: "2026", units: Math.round(units * 0.22) },
    { year: "2027", units: Math.round(units * 0.14) },
    { year: "2028", units: Math.round(units * 0.08) },
  ];
}

function buildOccupancyHistory(occupancy: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => {
    const occ = clamp(Math.round((occupancy - 1 + (index % 3)) * 10) / 10, 75, 100);
    return { month, occupancy: occ, vacancy: Math.round((100 - occ) * 10) / 10 };
  });
}

function buildTenantConcentration() {
  return [
    { tenant: "Top 1", revenue: 8 },
    { tenant: "Top 2-5", revenue: 22 },
    { tenant: "Top 6-10", revenue: 18 },
    { tenant: "Remaining", revenue: 52 },
  ];
}

function buildRisks(
  propertyResponse: PropertyResponse | null | undefined,
  icPropertyCard: IcPropertyCardData | undefined,
  riskLevel: number,
  revenueAtRisk: number
) {
  const riskDrivers = propertyResponse?.intelligence?.riskAlert?.riskDrivers ?? [];
  const icRisks = icPropertyCard?.risks?.filter(Boolean) ?? [];
  const titles = [...riskDrivers, ...icRisks].slice(0, 3);

  if (!titles.length) {
    titles.push("Lease Rollover Exposure", "Expense Pressure");
  }

  return titles.map((title, index) => ({
    title,
    severity: getSeverity(riskLevel + index * 5),
    impact: index === 0 ? `-${formatCompactCurrencyValue(revenueAtRisk || 120000)} revenue at risk` : "Monitor operational downside",
    explanation:
      propertyResponse?.intelligence?.riskAlert?.whyThisMatters ||
      "Derived from existing property intelligence and operating signals.",
  }));
}

function buildOpportunities(
  propertyResponse: PropertyResponse | null | undefined,
  icPropertyCard: IcPropertyCardData | undefined,
  totalLift: number,
  markToMarket: number
) {
  const actions = propertyResponse?.intelligence?.aiGuidedRecommendations ?? [];
  const icOpps = icPropertyCard?.opportunities?.filter(Boolean) ?? [];
  const titles = [...actions, ...icOpps].slice(0, 3);

  if (!titles.length) {
    titles.push("Mark-to-Market Opportunity", "Renewal Pricing Optimization");
  }

  return titles.map((title, index) => ({
    title,
    severity: index === 0 ? "High" : "Medium",
    impact:
      index === 0
        ? `+${formatCompactCurrencyValue(totalLift || markToMarket || 100000)} upside`
        : "Incremental NOI improvement",
    explanation:
      propertyResponse?.intelligence?.marketMomentum?.whyThisMatters ||
      "Built from AI rent, property intelligence, and memo recommendations.",
  }));
}

function buildChartInsights(propertyName: string, occupancy: number, rentGap: number, noiMargin: number) {
  return {
    tenantMix: {
      insight: `${propertyName} unit mix is mapped from AI rent or property detail responses.`,
      impact: "Supports demand and retention analysis.",
      drives: "Cash Flow Stability",
    },
    rentVsMarket: {
      insight: `Current rents are approximately ${rentGap.toFixed(1)}% below market.`,
      impact: "Highlights mark-to-market upside.",
      drives: "Value-Add Potential",
    },
    noiProjection: {
      insight: "NOI projection is built from available trend data when present, with a simple fallback otherwise.",
      impact: "Shows expected earnings direction.",
      drives: "Overall Deal Score",
    },
    revenueVsExpenses: {
      insight: "Revenue and expense trends come from the property response trends payload.",
      impact: "Makes margin pressure or expansion visible.",
      drives: "NOI Margin",
    },
    expenseBreakdown: {
      insight: "Expense mix is estimated from total expenses when line items are not explicitly available.",
      impact: "Still provides a usable underwriting cost view.",
      drives: "Expense Ratio",
    },
    expenseDistribution: {
      insight: "Largest cost buckets are surfaced for quick operating review.",
      impact: "Helps prioritize savings work.",
      drives: "Expense Optimization",
    },
    leaseExpirations: {
      insight: "Lease ladder is taken from property response when present.",
      impact: "Shows rollover concentration risk.",
      drives: "Risk Level",
    },
    occupancyVacancy: {
      insight: `Occupancy is currently ${occupancy.toFixed(1)}%.`,
      impact: "Anchors the current income base.",
      drives: "Cash Flow Stability",
    },
    tenantConcentration: {
      insight: "Tenant concentration is a simplified view for the underwriting compare flow.",
      impact: "Keeps risk review consistent across properties.",
      drives: "Risk Level",
    },
  };
}

function formatCompactCurrencyValue(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildDeal(
  property: PropertyRecord,
  aiRentRecord: AiRentRecord | undefined,
  icMemoData: IcMemoTemplateData | null,
  index: number
): Deal {
  const propertyResponse = property.property_response ?? null;
  const aiRent = aiRentRecord?.ai_rent_intelligence_response ?? null;
  const kpis = propertyResponse?.kpis;
  const propertyMeta = propertyResponse?.property;
  const icPropertyCard = getIcPropertyCard(icMemoData, property.property_name ?? "");

  const occupancy = toPercent(kpis?.occupancy ?? property.occupancy, 92);
  const noi = toNumber(kpis?.noi, 2000000 + index * 350000);
  const revenue = toNumber(kpis?.revenue, noi / 0.6);
  const noiMargin = toPercent(kpis?.noiMargin, 55);
  const expenseRatio = toPercent(kpis?.expenseRatio, 100 - noiMargin);
  const totalExpenses = Math.max(Math.round(revenue * (expenseRatio / 100)), 0);
  const units = toNumber(propertyMeta?.units ?? property.units, 100);
  const lossToLease = toPercent(kpis?.lossToLease, 5);
  const rentComparison = propertyResponse?.rentComparison;
  const rentGap = Array.isArray(rentComparison)
    ? clamp(
        rentComparison.reduce((sum, item) => {
          const market = toNumber(item.market);
          const inPlace = toNumber(item.inPlace);
          return sum + (market > 0 ? ((market - inPlace) / market) * 100 : 0);
        }, 0) / Math.max(rentComparison.length, 1),
        0,
        40
      )
    : toPercent(rentComparison?.lossToLeasePercent ?? lossToLease, lossToLease);

  const scores = deriveScores(propertyResponse, aiRent);
  const strategy = getStrategy(property.class_type, scores.riskLevel, rentGap);
  const confidence = getConfidence(scores.overall, scores.riskLevel);
  const signal = getSignal(scores.overall, scores.riskLevel);
  const yearBuilt = toNumber(propertyMeta?.yearBuilt, 2005);
  const address = property.address || propertyMeta?.location || property.location || "-";
  const askingPrice = Math.round(noiMargin > 0 ? noi / (noiMargin / 100) * 8.5 : revenue * 7);
  const revenuePerUnit = units > 0 ? Math.round(revenue / 12 / units) : 0;

  const totalLift = toNumber(aiRent?.dashboard?.basic_info?.totalprojectedrevenuelift, 0);
  const markToMarket = toNumber(
    aiRent?.dashboard?.basic_info?.mtmcapturepotential ?? kpis?.markToMarket,
    0
  );
  const revenueAtRisk = toNumber(
    aiRent?.dashboard?.basic_info?.revenueAtRisk ??
      propertyResponse?.intelligence?.riskAlert?.revenueAtRisk,
    0
  );
  const avgRenewalRate = toPercent(
    aiRent?.dashboard?.basic_info?.avgrenewalrate ?? kpis?.renewalRate,
    60
  );

  const movers = {
    rentIncrease: Math.round(totalLift || markToMarket || revenue * (rentGap / 100) * 0.35),
    expenseOptimization: Math.round(totalExpenses * Math.min(expenseRatio / 100, 0.12)),
    occupancyImprovement: Math.round((100 - occupancy) / 100 * revenue * 0.4),
  };

  const tenantMix = buildTenantMix(aiRent);
  const rentVsMarket = buildRentVsMarket(propertyResponse, aiRent);
  const noiProjection = buildNoiProjection(propertyResponse, noi);
  const revenueVsExpenses = buildRevenueVsExpenses(propertyResponse, revenue, expenseRatio);
  const expenseBreakdown = buildExpenseBreakdown(totalExpenses);
  const leaseExpirations = buildLeaseExpirations(propertyResponse, units);
  const occupancyHistory = buildOccupancyHistory(occupancy);
  const tenantConcentration = buildTenantConcentration();

  return {
    id: property.property_name?.trim().toLowerCase().replace(/\s+/g, "-") || defaultDealIds[index] || `deal-${index + 1}`,
    name: property.property_name || `Property ${index + 1}`,
    address,
    strategy,
    units,
    yearBuilt,
    askingPrice,
    signal,
    confidence,
    thesis:
      propertyResponse?.intelligence?.overview ||
      icPropertyCard?.insights?.join(" ") ||
      `${property.property_name || "This property"} underwriting view is mapped from the existing property and rent intelligence responses.`,
    metrics: {
      noi,
      noiMargin,
      revenuePerUnit,
      expenseRatio,
      totalExpenses,
      occupancy,
      vacancyLoss: clamp(100 - occupancy, 0, 100),
      rentGap,
    },
    scores,
    movers,
    risks: buildRisks(propertyResponse, icPropertyCard, scores.riskLevel, revenueAtRisk),
    opportunities: buildOpportunities(propertyResponse, icPropertyCard, totalLift, markToMarket),
    tenantMix,
    rentVsMarket,
    noiProjection,
    revenueVsExpenses,
    expenseBreakdown,
    leaseExpirations,
    occupancyHistory,
    tenantConcentration,
    chartInsights: buildChartInsights(property.property_name || "Property", occupancy, rentGap, noiMargin),
  };
}

async function loadPropertyRecords() {
  const endpoint = isDemoMode()
    ? "/api/get_property_model_data/"
    : "/api/get_property_model_data_user_view/";
  const response = await authClient.post<{ data?: PropertyRecord[] }>(endpoint, { fetch: "all" });
  return response.data?.data ?? [];
}

async function loadAiRentRecords() {
  const endpoint = isDemoMode()
    ? "/api/get_ai_rent_intelligence_data/"
    : "/api/get_ai_rent_intelligence_data_user_view/";
  const response = await authClient.post<{ data?: AiRentRecord[] }>(endpoint, { fetch: "all" });
  return response.data?.data ?? [];
}

async function loadIcMemoData() {
  if (isDemoMode()) return null;
  try {
    const response = await authClient.post<{ data?: IcMemoTemplateData }>("/api/get_icmemo_data_user_view/", {});
    return response.data?.data ?? null;
  } catch {
    return null;
  }
}

export function useDealUnderwritingData(): DealDataState {
  const [propertyRecords, setPropertyRecords] = useState<PropertyRecord[]>([]);
  const [aiRentRecords, setAiRentRecords] = useState<AiRentRecord[]>([]);
  const [icMemoData, setIcMemoData] = useState<IcMemoTemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [properties, aiRent, icMemo] = await Promise.all([
          loadPropertyRecords(),
          loadAiRentRecords().catch(() => []),
          loadIcMemoData(),
        ]);

        if (!mounted) return;
        setPropertyRecords(properties);
        setAiRentRecords(aiRent);
        setIcMemoData(icMemo);
      } catch {
        if (!mounted) return;
        setError("Unable to load deal underwriting data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const deals = useMemo(() => {
    return propertyRecords.map((property, index) =>
      buildDeal(
        property,
        aiRentRecords.find(
          (record) =>
            record.property_name?.trim().toLowerCase() === property.property_name?.trim().toLowerCase()
        ),
        icMemoData,
        index
      )
    );
  }, [aiRentRecords, icMemoData, propertyRecords]);

  return { deals, loading, error };
}

export function getDealById(deals: Deal[], id: string) {
  return deals.find((deal) => deal.id === id);
}
