export type IcSignal = "green" | "yellow" | "red" | "neutral";

export interface IcHeroHighlight {
  icon?: string | null;
  text?: string | null;
  signal?: Exclude<IcSignal, "neutral"> | null;
}

export interface IcHeroData {
  companyName?: string | null;
  reportTitle?: string | null;
  reportMonth?: string | null;
  verdict?: string | null;
  highlights?: IcHeroHighlight[] | null;
}

export interface IcKpiItem {
  label?: string | null;
  value?: string | null;
  subtitle?: string | null;
  signal?: IcSignal | null;
}

export interface IcInsightItem {
  title?: string | null;
  text?: string | null;
  signal?: Exclude<IcSignal, "neutral"> | null;
}

export interface IcTrendCard {
  label?: string | null;
  values?: number[] | null;
  color?: string | null;
}

export interface IcPerformanceSnapshotData {
  trends?: IcTrendCard[] | null;
  insights?: IcInsightItem[] | null;
  trendFooterLabel?: string | null;
  trendFooterValue?: string | null;
}

export interface IcProgressMetric {
  label?: string | null;
  value?: string | null;
  subtitle?: string | null;
  bar?: number | null;
  signal?: Exclude<IcSignal, "neutral"> | null;
}

export interface IcTextPanelSection {
  label?: string | null;
  text?: string | null;
}

export interface IcLeasingEngineData {
  metrics?: IcProgressMetric[] | null;
  sideTitle?: string | null;
  sideSections?: IcTextPanelSection[] | null;
}

export interface IcExpenseRow {
  label?: string | null;
  change?: string | null;
  amount?: string | null;
  reason?: string | null;
}

export interface IcExpenseEfficiencyData {
  statusTitle?: string | null;
  statusSubtitle?: string | null;
  structuralSavings?: number | null;
  timingDriven?: number | null;
  structuralNote?: string | null;
  timingNote?: string | null;
  note?: string | null;
}

export interface IcExpenseIntelligenceData {
  increases?: IcExpenseRow[] | null;
  decreases?: IcExpenseRow[] | null;
  efficiency?: IcExpenseEfficiencyData | null;
}

export interface IcRiskMetric {
  label?: string | null;
  value?: string | null;
  detail?: string | null;
  level?: "low" | "medium" | "high" | null;
}

export interface IcRiskAsset {
  name?: string | null;
  description?: string | null;
  badge?: string | null;
  badgeLevel?: Exclude<IcSignal, "neutral"> | null;
  stats?: { label?: string | null; value?: string | null }[] | null;
}

export interface IcRiskRadarData {
  metrics?: IcRiskMetric[] | null;
  assets?: IcRiskAsset[] | null;
}

export interface IcPropertyMetric {
  label?: string | null;
  value?: string | null;
  signal?: Exclude<IcSignal, "neutral"> | null;
}

export interface IcPropertyAction {
  action?: string | null;
  impact?: string | null;
  priority?: "HIGH" | "MEDIUM" | "MONITOR" | null;
}

export interface IcPropertyCardData {
  name?: string | null;
  location?: string | null;
  performance?: "Strong" | "Stable" | "Weak" | null;
  metrics?: IcPropertyMetric[] | null;
  insights?: string[] | null;
  risks?: string[] | null;
  opportunities?: string[] | null;
  actions?: IcPropertyAction[] | null;
}

export interface IcPropertyIntelligenceData {
  properties?: IcPropertyCardData[] | null;
}

export interface IcAiInsightItem {
  title?: string | null;
  body?: string | null;
  signal?: Exclude<IcSignal, "neutral"> | null;
}

export interface IcAiInsightsData {
  summary?: string | null;
  items?: IcAiInsightItem[] | null;
}

export interface IcExecutionPriorityItem {
  priority?: "HIGH" | "MEDIUM" | "MONITOR" | null;
  action?: string | null;
  impact?: string | null;
  detail?: string | null;
}

export interface IcExecutionPrioritiesData {
  items?: IcExecutionPriorityItem[] | null;
}

export interface IcForwardOutlookColumn {
  title?: string | null;
  items?: string[] | null;
  tone?: Exclude<IcSignal, "neutral"> | "blue" | null;
}

export interface IcForwardOutlookData {
  columns?: IcForwardOutlookColumn[] | null;
  footerTitle?: string | null;
  footerSubtitle?: string | null;
  footerNote?: string | null;
}

export interface IcMemoTemplateData {
  hero?: IcHeroData | null;
  kpis?: IcKpiItem[] | null;
  performanceSnapshot?: IcPerformanceSnapshotData | null;
  leasingEngine?: IcLeasingEngineData | null;
  expenseIntelligence?: IcExpenseIntelligenceData | null;
  riskRadar?: IcRiskRadarData | null;
  propertyIntelligence?: IcPropertyIntelligenceData | null;
  aiInsights?: IcAiInsightsData | null;
  executionPriorities?: IcExecutionPrioritiesData | null;
  forwardOutlook?: IcForwardOutlookData | null;
}
