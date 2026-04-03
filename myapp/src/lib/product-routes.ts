export const demoBaseRoute = "/pf";

export const productRoutes = {
  portfolioIntelligence: `${demoBaseRoute}/portfolio_intelligence`,
  propertyIntelligence: `${demoBaseRoute}/property_intelligence`,
  aiRentIntelligence: `${demoBaseRoute}/ai_rent_intelligence`,
  marketRadar: `${demoBaseRoute}/market_radar`,
  dealLens: `${demoBaseRoute}/deal_lens`,
} as const;

export const portfolioAnalyticsRoutes = {
  snapshot: `${productRoutes.portfolioIntelligence}/snapshot`,
  performance_drivers: `${productRoutes.portfolioIntelligence}/performance_drivers`,
  revenue_quality_lease_intelligence: `${productRoutes.portfolioIntelligence}/revenue_leases`,
  expenses_dashboard: `${productRoutes.portfolioIntelligence}/expense_intel`,
  risk_stability_dashboard: `${productRoutes.portfolioIntelligence}/risk_stability`,
} as const;

export type PortfolioAnalyticsRouteId = keyof typeof portfolioAnalyticsRoutes;
