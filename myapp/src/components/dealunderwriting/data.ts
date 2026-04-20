import { useCallback, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-api";
import { isDemoMode } from "@/lib/demo-mode";
import type { IcMemoTemplateData, IcPropertyCardData } from "@/components/ic-memo/types";

export type DealSignal = "Strong Buy" | "Buy" | "Neutral" | "Avoid";

type TrendPoint = { month?: string; value?: number };
type RevenueExpensePoint = { month?: string; revenue?: number; expense?: number };
type ChartInsightRecord = { insight?: string; impact?: string; drives?: string };

type PropertyResponse = {
  kpis?: {
    noi?: number;
    noiMargin?: number;
    revenue?: number;
    expenseRatio?: number;
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
      whyThisMatters?: string;
    };
    marketMomentum?: { whyThisMatters?: string };
    reviewIntelligence?: {
      avgRating?: number;
      rating?: number;
      ratingScore?: number;
    };
  };
  rentComparison?: Array<{ unitType?: string; market?: number; inPlace?: number }> | { lossToLeasePercent?: number | null };
  leaseExpirationLadder?: Array<{ month?: string; units?: number }>;
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
      inPlaceVsRecommended?: Array<{ unitType?: string; inPlace?: number; market?: number; recommended?: number }>;
    };
    basic_info?: {
      revenueAtRisk?: number;
      avgrenewalrate?: number;
      mtmcapturepotential?: number;
      totalprojectedrevenuelift?: number;
    };
    unitSummary?: Array<{ unitType?: string; units?: string }>;
  };
};

type AiRentRecord = {
  property_name?: string;
  ai_rent_intelligence_response?: AiRentResponse | null;
};

type DealUnderwritingApiRecord = {
  propertyName: string;
  address: string;
  location: string;
  submarket: string;
  region: string;
  classType: string;
  header: {
    units: number | null;
    yearBuilt: number | null;
    locationAddress: string | null;
    locationSubtitle: string | null;
  };
  aiAcquisitionSnapshot: {
    recommendation: DealSignal;
    confidenceScore: number;
    investmentThesis: string;
  };
  kpiCards: {
    noOfUnits: number | null;
    yearBuilt: number | null;
    rentPerSqft: number | null;
    occupancyRate: number | null;
    occupancyUnits?: { occupied: number | null; total: number | null } | null;
    vacancyLoss: number | null;
    parkingSpace?: number | null;
    parkingSpaces?: number | null;
    parking_space?: number | null;
    siteSize?: number | null;
    site_size?: number | null;
    siteAcreage?: number | null;
    noiMargin: number | null;
    revenuePerUnit: number | null;
    expenseRatio: number | null;
    rentVsMarketGap: number | null;
    totalProjectedRevenueLift: number | null;
  };
  dealScorecard: {
    marketPosition: number;
    cashFlowStability: number;
    valueAddPotential: number;
    riskLevel: number;
    overallDealScore: number;
  };
  whatDrivesThisInvestment: {
    rentIncrease: number;
    expenseOptimization: number;
    occupancyImprovement: number;
    totalPotentialNoiUplift: number;
  };
  risks: Array<{ title: string; severity: "High" | "Medium" | "Low"; impact: string; explanation: string }>;
  opportunities: Array<{ title: string; severity: "High" | "Medium" | "Low"; impact: string; explanation: string }>;
  performanceAnalytics: {
    tenantMix?: Array<{ unitType: string; count: number; percent: number }>;
    rentVsMarket?: Array<{ unitType: string; market: number; inPlace: number }>;
    noiGrowthProjection?: Array<{ year: number; noi: number }>;
    revenueVsExpenses?: Array<{ month: string; revenue: number; expense: number }>;
    expenseBreakdown?: Array<{ category: string; amount: number; percent?: number }>;
    expenseDistribution?: Array<{ category: string; amount: number; percent?: number }>;
    leaseExpiration?: Array<{ month: string; units: number }>;
    occupancyVsVacancy?: Array<{ month: string; occupancyRate: number; vacancyRate: number }>;
    leaseExpirationFloorplan?: {
      title?: string;
      xlabels?: string[];
      ylabels?: string[];
      data?: number[][];
    };
    tenantMixInsights?: ChartInsightRecord;
    rentVsMarketInsights?: ChartInsightRecord;
    revenueVsExpensesInsights?: ChartInsightRecord;
    expenseDistributionInsights?: ChartInsightRecord;
    leaseExpirationInsights?: ChartInsightRecord;
    occupancyVsVacancyInsights?: ChartInsightRecord;
  };
  sourceOverview?: string | null;
  dealDocumentsUploadedAt?: string | null;
  deal_documents_uploaded_at?: string | null;
  dealMemorandumResponse?: unknown;
  deal_memorandum_response?: unknown;
  dealT12Response?: unknown;
  deal_t12_response?: unknown;
  dealRentrollResponse?: unknown;
  deal_rentroll_response?: unknown;
};

export interface Deal {
  id: string;
  name: string;
  address: string;
  location: string;
  submarket?: string;
  region?: string;
  strategy: "Core" | "Core+" | "Value-Add" | "Opportunistic";
  units: number;
  yearBuilt: number;
  askingPrice: number;
  signal: DealSignal;
  confidence: number;
  thesis: string;
  metrics: {
    noOfUnits?: number;
    yearBuilt?: number;
    noi: number;
    noiMargin: number;
    revenuePerUnit: number;
    expenseRatio: number;
    totalExpenses: number;
    occupancy: number;
    occupancyUnits?: { occupied: number; total: number };
    vacancyLoss: number;
    rentGap: number;
    totalProjectedRevenueLift?: number;
    rentPerSqft?: number;
    parkingSpace?: number;
    siteSize?: number;
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
    totalPotentialNoiUplift?: number;
  };
  risks: Array<{ title: string; severity: "High" | "Medium" | "Low"; impact: string; explanation: string }>;
  opportunities: Array<{ title: string; severity: "High" | "Medium" | "Low"; impact: string; explanation: string }>;
  tenantMix: Array<{ name: string; percentage: number; count?: number }>;
  rentVsMarket: Array<{ type: string; current: number; market: number }>;
  noiProjection: Array<{ year: string; noi: number }>;
  revenueVsExpenses: Array<{ month: string; revenue: number; expenses: number }>;
  expenseBreakdown: Array<{ category: string; amount: number; percent?: number }>;
  expenseDistribution: Array<{ category: string; amount: number; percent?: number }>;
  leaseExpirations: Array<{ year: string; units: number }>;
  occupancyHistory: Array<{ month: string; occupancy: number; vacancy: number }>;
  leaseExpirationFloorplan?: {
    title: string;
    xlabels: string[];
    ylabels: string[];
    data: number[][];
  };
  docStatus?: {
    memorandum: boolean;
    t12: boolean;
    rentRoll: boolean;
  };
  chartInsights: Record<"tenantMix" | "rentVsMarket" | "noiProjection" | "revenueVsExpenses" | "expenseBreakdown" | "expenseDistribution" | "leaseExpirations" | "occupancyVacancy", { insight: string; impact: string; drives: string }>;
}

type DealDataState = { deals: Deal[]; loading: boolean; error: string | null; refresh: () => Promise<void> };

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

function getKpiNumber(
  kpiCards: Record<string, unknown> | undefined,
  keys: string[],
  fallback = 0
) {
  if (!kpiCards) return fallback;
  for (const key of keys) {
    const value = kpiCards[key];
    if (value !== undefined && value !== null && value !== "") {
      return toNumber(value, fallback);
    }
  }
  return fallback;
}

const createDealId = (value: string, index: number) =>
  value?.trim().toLowerCase().replace(/\s+/g, "-") || defaultDealIds[index] || `deal-${index + 1}`;

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
  return properties.find((property) => property.name?.trim().toLowerCase() === propertyName.trim().toLowerCase());
}

function deriveScores(propertyResponse: PropertyResponse | null | undefined, aiRent: AiRentResponse | null | undefined) {
  const kpis = propertyResponse?.kpis;
  const riskAlert = propertyResponse?.intelligence?.riskAlert;
  const review = propertyResponse?.intelligence?.reviewIntelligence;
  const occupancy = toPercent(kpis?.occupancy);
  const noiMargin = toPercent(kpis?.noiMargin);
  const expenseRatio = toPercent(kpis?.expenseRatio);
  const lossToLease = toPercent(kpis?.lossToLease);
  const reviewRating = toNumber(review?.ratingScore ?? review?.avgRating ?? review?.rating, 3.5);
  const riskScore = toNumber(riskAlert?.riskScore, 50);
  const mtm = toNumber(aiRent?.dashboard?.basic_info?.mtmcapturepotential ?? kpis?.markToMarket, 0);
  const totalLift = toNumber(aiRent?.dashboard?.basic_info?.totalprojectedrevenuelift, 0);
  const marketPosition = clamp(Math.round(occupancy * 0.45 + noiMargin * 0.2 + reviewRating * 10 + 15));
  const cashFlowStability = clamp(Math.round(occupancy * 0.55 + noiMargin * 0.35 - expenseRatio * 0.1 + 10));
  const valueAddPotential = clamp(Math.round(lossToLease * 1.6 + Math.min(mtm / 10000, 25) + Math.min(totalLift / 30000, 25)));
  const riskLevel = clamp(Math.round(riskScore || 100 - occupancy + expenseRatio * 0.4));
  const overall = clamp(Math.round(marketPosition * 0.25 + cashFlowStability * 0.3 + valueAddPotential * 0.25 + (100 - riskLevel) * 0.2));
  return { marketPosition, cashFlowStability, valueAddPotential, riskLevel, overall };
}

function buildTenantMix(aiRent: AiRentResponse | null | undefined) {
  const unitSummary = aiRent?.dashboard?.unitSummary ?? [];
  const numericUnits = unitSummary.map((item) => ({ name: item.unitType || "Unit", units: toNumber(item.units) })).filter((item) => item.units > 0);
  const totalUnits = numericUnits.reduce((sum, item) => sum + item.units, 0);
  if (!totalUnits) return [{ name: "1BR", percentage: 40, count: 40 }, { name: "2BR", percentage: 45, count: 45 }, { name: "3BR", percentage: 15, count: 15 }];
  return numericUnits.map((item) => ({ name: item.name, percentage: Math.round((item.units / totalUnits) * 1000) / 10, count: item.units }));
}

function buildRentVsMarket(propertyResponse: PropertyResponse | null | undefined, aiRent: AiRentResponse | null | undefined) {
  const rentComparison = propertyResponse?.rentComparison;
  if (Array.isArray(rentComparison) && rentComparison.length) {
    return rentComparison.map((item) => ({ type: item.unitType || "Unit", current: toNumber(item.inPlace), market: toNumber(item.market) }));
  }
  const inPlaceChart = aiRent?.dashboard?.charts?.inPlaceVsRecommended ?? [];
  if (inPlaceChart.length) {
    return inPlaceChart.map((item) => ({ type: item.unitType || "Unit", current: toNumber(item.inPlace), market: toNumber(item.market || item.recommended) }));
  }
  return [{ type: "1BR", current: 1400, market: 1500 }, { type: "2BR", current: 1650, market: 1800 }];
}

function buildNoiProjection(propertyResponse: PropertyResponse | null | undefined, currentNoi: number) {
  const trend = propertyResponse?.trends?.noiTrend12Month ?? [];
  if (trend.length >= 4) {
    const recent = trend.slice(-4);
    return recent.map((point, index) => ({ year: String(new Date().getFullYear() + index), noi: toNumber(point.value, currentNoi) }));
  }
  return Array.from({ length: 5 }, (_, index) => ({
    year: String(new Date().getFullYear() + index),
    noi: Math.round(currentNoi * (1 + index * 0.06)),
  }));
}

function buildRevenueVsExpenses(propertyResponse: PropertyResponse | null | undefined, revenue: number, expenseRatio: number) {
  const points = propertyResponse?.trends?.revenueVsExpense ?? [];
  if (points.length) {
    return points.map((point) => ({ month: point.month || "", revenue: toNumber(point.revenue), expenses: toNumber(point.expense) }));
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
  const weights = [["Payroll", 0.32], ["Maintenance", 0.2], ["Utilities", 0.15], ["Insurance", 0.12], ["Property Tax", 0.18], ["Admin", 0.03]] as const;
  return weights.map(([category, weight]) => ({ category, amount: Math.round(totalExpenses * weight), percent: Math.round(weight * 1000) / 10 }));
}

function buildLeaseExpirations(propertyResponse: PropertyResponse | null | undefined, units: number) {
  const ladder = propertyResponse?.leaseExpirationLadder ?? [];
  if (ladder.length) return ladder.map((item) => ({ year: item.month || "Period", units: toNumber(item.units) }));
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

function buildRisks(propertyResponse: PropertyResponse | null | undefined, icPropertyCard: IcPropertyCardData | undefined, riskLevel: number, revenueAtRisk: number) {
  const riskDrivers = propertyResponse?.intelligence?.riskAlert?.riskDrivers ?? [];
  const icRisks = icPropertyCard?.risks?.filter(Boolean) ?? [];
  const titles = [...riskDrivers, ...icRisks].slice(0, 3);
  if (!titles.length) titles.push("Lease Rollover Exposure", "Expense Pressure");
  return titles.map((title, index) => ({
    title,
    severity: getSeverity(riskLevel + index * 5),
    impact: index === 0 ? `-${formatCompactCurrencyValue(revenueAtRisk || 120000)} revenue at risk` : "Monitor operational downside",
    explanation: propertyResponse?.intelligence?.riskAlert?.whyThisMatters || "Derived from existing property intelligence and operating signals.",
  }));
}

function buildOpportunities(propertyResponse: PropertyResponse | null | undefined, icPropertyCard: IcPropertyCardData | undefined, totalLift: number, markToMarket: number) {
  const actions = propertyResponse?.intelligence?.aiGuidedRecommendations ?? [];
  const icOpps = icPropertyCard?.opportunities?.filter(Boolean) ?? [];
  const titles = [...actions, ...icOpps].slice(0, 3);
  if (!titles.length) titles.push("Mark-to-Market Opportunity", "Renewal Pricing Optimization");
  return titles.map((title, index) => ({
    title,
    severity: index === 0 ? "High" : "Medium",
    impact: index === 0 ? `+${formatCompactCurrencyValue(totalLift || markToMarket || 100000)} upside` : "Incremental NOI improvement",
    explanation: propertyResponse?.intelligence?.marketMomentum?.whyThisMatters || "Built from AI rent, property intelligence, and memo recommendations.",
  }));
}

function buildChartInsights(propertyName: string, occupancy: number, rentGap: number, noiMargin: number) {
  return {
    tenantMix: { insight: `${propertyName} unit mix is mapped from backend underwriting data.`, impact: "Supports demand and retention analysis.", drives: "Cash Flow Stability" },
    rentVsMarket: { insight: `Current rents are approximately ${rentGap.toFixed(1)}% below market.`, impact: "Highlights mark-to-market upside.", drives: "Value-Add Potential" },
    noiProjection: { insight: "NOI projection is sourced from the underwriting performance analytics response.", impact: "Shows expected earnings direction.", drives: "Overall Deal Score" },
    revenueVsExpenses: { insight: "Revenue and expense trends come from the underwriting response.", impact: "Makes margin pressure or expansion visible.", drives: "NOI Margin" },
    expenseBreakdown: { insight: "Expense categories are taken directly from the underwriting payload when available.", impact: "Shows where costs concentrate.", drives: "Expense Ratio" },
    expenseDistribution: { insight: "Distribution mirrors the expense category mix from the backend.", impact: "Helps prioritize savings work.", drives: "Expense Optimization" },
    leaseExpirations: { insight: "Lease rollover timing is sourced from the underwriting response.", impact: "Shows concentration risk by month.", drives: "Risk Level" },
    occupancyVacancy: { insight: `Occupancy is currently ${occupancy.toFixed(1)}%.`, impact: "Anchors the current income base.", drives: "Cash Flow Stability" },
  };
}

function mergeChartInsight(
  fallback: { insight: string; impact: string; drives: string },
  override?: ChartInsightRecord | null
) {
  if (!override) return fallback;
  return {
    insight: override.insight?.trim() || fallback.insight,
    impact: override.impact?.trim() || fallback.impact,
    drives: override.drives?.trim() || fallback.drives,
  };
}

function formatCompactCurrencyValue(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function getDealDocStatus(record: DealUnderwritingApiRecord) {
  return {
    memorandum: Boolean(record.dealMemorandumResponse || record.deal_memorandum_response),
    t12: Boolean(record.dealT12Response || record.deal_t12_response),
    rentRoll: Boolean(record.dealRentrollResponse || record.deal_rentroll_response),
  };
}

function buildDemoDeal(property: PropertyRecord, aiRentRecord: AiRentRecord | undefined, icMemoData: IcMemoTemplateData | null, index: number): Deal {
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
    ? clamp(rentComparison.reduce((sum, item) => {
        const market = toNumber(item.market);
        const inPlace = toNumber(item.inPlace);
        return sum + (market > 0 ? ((market - inPlace) / market) * 100 : 0);
      }, 0) / Math.max(rentComparison.length, 1), 0, 40)
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
  const markToMarket = toNumber(aiRent?.dashboard?.basic_info?.mtmcapturepotential ?? kpis?.markToMarket, 0);
  const revenueAtRisk = toNumber(aiRent?.dashboard?.basic_info?.revenueAtRisk ?? propertyResponse?.intelligence?.riskAlert?.revenueAtRisk, 0);

  return {
    id: createDealId(property.property_name || "", index),
    name: property.property_name || `Property ${index + 1}`,
    address,
    location: property.location || propertyMeta?.location || "",
    submarket: property.submarket,
    region: property.region,
    strategy,
    units,
    yearBuilt,
    askingPrice,
    signal,
    confidence,
    thesis: propertyResponse?.intelligence?.overview || icPropertyCard?.insights?.join(" ") || `${property.property_name || "This property"} underwriting view is mapped from the existing property and rent intelligence responses.`,
    metrics: {
      noOfUnits: units,
      yearBuilt,
      noi,
      noiMargin,
      revenuePerUnit,
      expenseRatio,
      totalExpenses,
      occupancy,
      occupancyUnits: { occupied: Math.round((units * occupancy) / 100), total: units },
      vacancyLoss: clamp(100 - occupancy, 0, 100),
      rentGap,
      totalProjectedRevenueLift: totalLift,
      rentPerSqft: 0,
      parkingSpace: 0,
      siteSize: 0,
    },
    scores,
    movers: {
      rentIncrease: Math.round(totalLift || markToMarket || revenue * (rentGap / 100) * 0.35),
      expenseOptimization: Math.round(totalExpenses * Math.min(expenseRatio / 100, 0.12)),
      occupancyImprovement: Math.round((100 - occupancy) / 100 * revenue * 0.4),
    },
    risks: buildRisks(propertyResponse, icPropertyCard, scores.riskLevel, revenueAtRisk),
    opportunities: buildOpportunities(propertyResponse, icPropertyCard, totalLift, markToMarket),
    tenantMix: buildTenantMix(aiRent),
    rentVsMarket: buildRentVsMarket(propertyResponse, aiRent),
    noiProjection: buildNoiProjection(propertyResponse, noi),
    revenueVsExpenses: buildRevenueVsExpenses(propertyResponse, revenue, expenseRatio),
    expenseBreakdown: buildExpenseBreakdown(totalExpenses),
    expenseDistribution: buildExpenseBreakdown(totalExpenses),
    leaseExpirations: buildLeaseExpirations(propertyResponse, units),
    occupancyHistory: buildOccupancyHistory(occupancy),
    leaseExpirationFloorplan: undefined,
    chartInsights: buildChartInsights(property.property_name || "Property", occupancy, rentGap, noiMargin),
  };
}

function createPlaceholderDeal(property: PropertyRecord, index: number): Deal {
  const units = toNumber(property.units, 0);
  const occupancy = toPercent(property.occupancy, 0);
  return {
    id: createDealId(property.property_name || "", index),
    name: property.property_name || `Property ${index + 1}`,
    address: property.address || property.location || "",
    location: property.location || "",
    submarket: property.submarket,
    region: property.region,
    strategy: getStrategy(property.class_type, 50, 0),
    units,
    yearBuilt: 0,
    askingPrice: 0,
    signal: "Neutral",
    confidence: 0,
    thesis: "Loading underwriting response...",
    metrics: {
      noOfUnits: units,
      yearBuilt: 0,
      noi: 0,
      noiMargin: 0,
      revenuePerUnit: 0,
      expenseRatio: 0,
      totalExpenses: 0,
      occupancy,
      occupancyUnits: { occupied: Math.round((units * occupancy) / 100), total: units },
      vacancyLoss: clamp(100 - occupancy, 0, 100),
      rentGap: 0,
      totalProjectedRevenueLift: 0,
      rentPerSqft: 0,
      parkingSpace: 0,
      siteSize: 0,
    },
    scores: { overall: 0, marketPosition: 0, cashFlowStability: 0, valueAddPotential: 0, riskLevel: 0 },
    movers: { rentIncrease: 0, expenseOptimization: 0, occupancyImprovement: 0, totalPotentialNoiUplift: 0 },
    risks: [],
    opportunities: [],
    tenantMix: [],
    rentVsMarket: [],
    noiProjection: [],
    revenueVsExpenses: [],
    expenseBreakdown: [],
    expenseDistribution: [],
    leaseExpirations: [],
    occupancyHistory: [],
    leaseExpirationFloorplan: undefined,
    chartInsights: buildChartInsights(property.property_name || "Property", occupancy, 0, 0),
  };
}

function mapUserApiRecordToDeal(record: DealUnderwritingApiRecord, index: number): Deal {
  const kpiCards = record.kpiCards as Record<string, unknown> | undefined;
  const defaultChartInsights = buildChartInsights(
    record.propertyName,
    toNumber(record.kpiCards.occupancyRate, 0),
    toNumber(record.kpiCards.rentVsMarketGap, 0),
    toNumber(record.kpiCards.noiMargin, 0)
  );
  const units = toNumber(record.header.units ?? record.kpiCards.noOfUnits, 0);
  const revenuePerUnit = toNumber(record.kpiCards.revenuePerUnit, 0);
  const estimatedRevenue = revenuePerUnit > 0 && units > 0
    ? revenuePerUnit * units
    : record.performanceAnalytics.revenueVsExpenses?.reduce((sum, item) => sum + toNumber(item.revenue), 0) || 0;
  const noiMargin = toNumber(record.kpiCards.noiMargin, 0);
  const totalExpenses = record.performanceAnalytics.revenueVsExpenses?.reduce((sum, item) => sum + toNumber(item.expense), 0) || estimatedRevenue * (toNumber(record.kpiCards.expenseRatio, 0) / 100);
  const noi = estimatedRevenue > 0 ? estimatedRevenue * (noiMargin / 100) : Math.max(estimatedRevenue - totalExpenses, 0);
  const rentGap = toNumber(record.kpiCards.rentVsMarketGap, 0);
  const docStatus = getDealDocStatus(record);
  return {
    id: createDealId(record.propertyName, index),
    name: record.propertyName,
    address: record.address || record.header.locationAddress || "",
    location: record.location || record.header.locationSubtitle || "",
    submarket: record.submarket,
    region: record.region,
    strategy: getStrategy(record.classType, record.dealScorecard.riskLevel, rentGap),
    units,
    yearBuilt: toNumber(record.header.yearBuilt, 0),
    askingPrice: estimatedRevenue > 0 ? Math.round(estimatedRevenue * 8.5) : 0,
    signal: record.aiAcquisitionSnapshot.recommendation || "Neutral",
    confidence: clamp(toNumber(record.aiAcquisitionSnapshot.confidenceScore, 0)),
    thesis: record.aiAcquisitionSnapshot.investmentThesis || record.sourceOverview || "",
    metrics: {
      noOfUnits: toNumber(record.kpiCards.noOfUnits, units),
      yearBuilt: toNumber(record.kpiCards.yearBuilt ?? record.header.yearBuilt, 0),
      noi,
      noiMargin,
      revenuePerUnit,
      expenseRatio: toNumber(record.kpiCards.expenseRatio, 0),
      totalExpenses,
      occupancy: toNumber(record.kpiCards.occupancyRate, 0),
      occupancyUnits: record.kpiCards.occupancyUnits ? {
        occupied: toNumber(record.kpiCards.occupancyUnits.occupied, 0),
        total: toNumber(record.kpiCards.occupancyUnits.total, units),
      } : undefined,
      vacancyLoss: toNumber(record.kpiCards.vacancyLoss, 0),
      rentGap,
      totalProjectedRevenueLift: toNumber(record.kpiCards.totalProjectedRevenueLift, 0),
      rentPerSqft: toNumber(record.kpiCards.rentPerSqft, 0),
      parkingSpace: getKpiNumber(kpiCards, ["parkingSpace", "parkingSpaces", "parking_space"], 0),
      siteSize: getKpiNumber(kpiCards, ["siteSize", "site_size", "siteAcreage"], 0),
    },
    scores: {
      overall: toNumber(record.dealScorecard.overallDealScore, 0),
      marketPosition: toNumber(record.dealScorecard.marketPosition, 0),
      cashFlowStability: toNumber(record.dealScorecard.cashFlowStability, 0),
      valueAddPotential: toNumber(record.dealScorecard.valueAddPotential, 0),
      riskLevel: toNumber(record.dealScorecard.riskLevel, 0),
    },
    movers: {
      rentIncrease: toNumber(record.whatDrivesThisInvestment.rentIncrease, 0),
      expenseOptimization: toNumber(record.whatDrivesThisInvestment.expenseOptimization, 0),
      occupancyImprovement: toNumber(record.whatDrivesThisInvestment.occupancyImprovement, 0),
      totalPotentialNoiUplift: toNumber(record.whatDrivesThisInvestment.totalPotentialNoiUplift, 0),
    },
    risks: record.risks ?? [],
    opportunities: record.opportunities ?? [],
    tenantMix: (record.performanceAnalytics.tenantMix ?? []).map((item) => ({ name: item.unitType, percentage: toNumber(item.percent), count: toNumber(item.count) })),
    rentVsMarket: (record.performanceAnalytics.rentVsMarket ?? []).map((item) => ({ type: item.unitType, current: toNumber(item.inPlace), market: toNumber(item.market) })),
    noiProjection: (record.performanceAnalytics.noiGrowthProjection ?? []).map((item) => ({ year: String(item.year), noi: toNumber(item.noi) })),
    revenueVsExpenses: (record.performanceAnalytics.revenueVsExpenses ?? []).map((item) => ({ month: item.month, revenue: toNumber(item.revenue), expenses: toNumber(item.expense) })),
    expenseBreakdown: (record.performanceAnalytics.expenseBreakdown ?? []).map((item) => ({ category: item.category, amount: toNumber(item.amount), percent: toNumber(item.percent) })),
    expenseDistribution: (record.performanceAnalytics.expenseDistribution ?? record.performanceAnalytics.expenseBreakdown ?? []).map((item) => ({ category: item.category, amount: toNumber(item.amount), percent: toNumber(item.percent) })),
    leaseExpirations: (record.performanceAnalytics.leaseExpiration ?? []).map((item) => ({ year: item.month, units: toNumber(item.units) })),
    occupancyHistory: (record.performanceAnalytics.occupancyVsVacancy ?? []).map((item) => ({ month: item.month, occupancy: toNumber(item.occupancyRate), vacancy: toNumber(item.vacancyRate) })),
    leaseExpirationFloorplan: record.performanceAnalytics.leaseExpirationFloorplan
      ? {
          title: record.performanceAnalytics.leaseExpirationFloorplan.title || "Lease Expirations and Occupied Units by Floorplan",
          xlabels: record.performanceAnalytics.leaseExpirationFloorplan.xlabels ?? [],
          ylabels: record.performanceAnalytics.leaseExpirationFloorplan.ylabels ?? [],
          data: record.performanceAnalytics.leaseExpirationFloorplan.data ?? [],
        }
      : undefined,
    docStatus,
    chartInsights: {
      ...defaultChartInsights,
      tenantMix: mergeChartInsight(defaultChartInsights.tenantMix, record.performanceAnalytics.tenantMixInsights),
      rentVsMarket: mergeChartInsight(defaultChartInsights.rentVsMarket, record.performanceAnalytics.rentVsMarketInsights),
      revenueVsExpenses: mergeChartInsight(defaultChartInsights.revenueVsExpenses, record.performanceAnalytics.revenueVsExpensesInsights),
      expenseDistribution: mergeChartInsight(defaultChartInsights.expenseDistribution, record.performanceAnalytics.expenseDistributionInsights),
      leaseExpirations: mergeChartInsight(defaultChartInsights.leaseExpirations, record.performanceAnalytics.leaseExpirationInsights),
      occupancyVacancy: mergeChartInsight(defaultChartInsights.occupancyVacancy, record.performanceAnalytics.occupancyVsVacancyInsights),
    },
  };
}

function hasDealUnderwritingData(record: DealUnderwritingApiRecord) {
  return Boolean(
    record.dealDocumentsUploadedAt ||
      record.deal_documents_uploaded_at ||
      record.dealMemorandumResponse ||
      record.deal_memorandum_response ||
      record.dealT12Response ||
      record.deal_t12_response ||
      record.dealRentrollResponse ||
      record.deal_rentroll_response
  );
}

async function loadPropertyRecords() {
  const endpoint = isDemoMode() ? "/api/get_property_model_data/" : "/api/get_property_model_data_user_view/";
  const response = await authClient.post<{ data?: PropertyRecord[] }>(endpoint, { fetch: "all" });
  return response.data?.data ?? [];
}

async function loadAiRentRecords() {
  const endpoint = isDemoMode() ? "/api/get_ai_rent_intelligence_data/" : "/api/get_ai_rent_intelligence_data_user_view/";
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

async function loadUserDealUnderwriting(propertyNames?: string[]) {
  const payload = propertyNames?.length ? { property_names: propertyNames } : {};
  const response = await authClient.post<{ data?: DealUnderwritingApiRecord[] }>("/api/dealunderwriting_demouser/", payload);
  return response.data?.data ?? [];
}

export function useDealUnderwritingData(requestedIds: string[] = []): DealDataState {
  const [propertyRecords, setPropertyRecords] = useState<PropertyRecord[]>([]);
  const [aiRentRecords, setAiRentRecords] = useState<AiRentRecord[]>([]);
  const [icMemoData, setIcMemoData] = useState<IcMemoTemplateData | null>(null);
  const [userDealCache, setUserDealCache] = useState<Record<string, Deal>>({});
  const [userDeals, setUserDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBaseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        const properties = await loadPropertyRecords();
        setPropertyRecords(properties);
        const [aiRent, icMemo] = await Promise.all([loadAiRentRecords().catch(() => []), loadIcMemoData()]);
        setAiRentRecords(aiRent);
        setIcMemoData(icMemo);
      } else {
        const records = await loadUserDealUnderwriting();
        setUserDeals(
          records
            .filter(hasDealUnderwritingData)
            .map((record, index) => mapUserApiRecordToDeal(record, index))
        );
      }
    } catch {
      setError("Unable to load deal underwriting data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadBaseData().catch(() => {
      if (mounted) setError("Unable to load deal underwriting data.");
    });
    return () => {
      mounted = false;
    };
  }, [loadBaseData]);

  const placeholderDeals = useMemo(() => propertyRecords.map((property, index) => createPlaceholderDeal(property, index)), [propertyRecords]);

  useEffect(() => {
    if (isDemoMode() || !placeholderDeals.length || userDeals.length) return;
    const idToName = new Map(placeholderDeals.map((deal) => [deal.id, deal.name]));
    const candidateNames = requestedIds.length
      ? requestedIds
          .map((id) => idToName.get(id))
          .filter((name): name is string => Boolean(name))
      : placeholderDeals.map((deal) => deal.name);
    const namesToFetch = candidateNames.filter((name) => !userDealCache[name.toUpperCase()]);
    if (!namesToFetch.length) return;

    let mounted = true;
    loadUserDealUnderwriting(namesToFetch)
      .then((records) => {
        if (!mounted) return;
        setUserDealCache((current) => {
          const next = { ...current };
          records.forEach((record, index) => {
            next[record.propertyName.toUpperCase()] = mapUserApiRecordToDeal(record, index);
          });
          return next;
        });
      })
      .catch(() => {
        if (mounted) setError("Unable to load deal underwriting data.");
      });
    return () => {
      mounted = false;
    };
  }, [placeholderDeals, requestedIds, userDealCache, userDeals.length]);

  const deals = useMemo(() => {
    if (isDemoMode()) {
      return propertyRecords.map((property, index) =>
        buildDemoDeal(
          property,
          aiRentRecords.find((record) => record.property_name?.trim().toLowerCase() === property.property_name?.trim().toLowerCase()),
          icMemoData,
          index
        )
      );
    }
    return userDeals;
  }, [aiRentRecords, icMemoData, propertyRecords, userDeals]);

  return { deals, loading, error, refresh: loadBaseData };
}

export function getDealById(deals: Deal[], id: string) {
  return deals.find((deal) => deal.id === id);
}
