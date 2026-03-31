import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import portfolioDashboard from "../assets/performance_drvers.png";
import marketRadar from "../assets/market_signal_radar.png";
import dealLens from "../assets/deal_lens.png";
import properties from "../assets/properties.png";
import revenueleases from "../assets/Revenue & Leases.jpg";
import expenseintel from "../assets/Expenses Intel.jpg";

const screens = [
  { label: "Expense Intel", tooltip: "Deep insights into expense patterns", image: expenseintel },
  { label: "Performance Drivers", tooltip: "Key factors driving portfolio performance", image: portfolioDashboard },  
  { label: "Revenue & Leases Analysis", tooltip: "Analyze revenue streams and lease trends", image: revenueleases },
  { label: "Risk & Stability Dashboard", tooltip: "Monitor risks and asset stability", image: portfolioDashboard },
  { label: "Market Signal Radar", tooltip: "Track real-time market signals", image: marketRadar },
  { label: "Deal Underwriting Lens", tooltip: "Evaluate deals with AI-powered insights", image: dealLens },
  { label: "Properties", tooltip: "View and manage property portfolio", image: properties },
];

const PlatformExperience = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding section-soft">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="text-lg font-semibold text-indigo-500 uppercase tracking-widest mb-3">
              Platform Experience
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Designed for Decision-Makers
            </h2>
            <p className="text-muted-foreground text-lg">
              Every screen has a purpose, every insight drives action.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {screens.map((s, i) => (
              <button
                key={s.label}
                onClick={() => setActive(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === i
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Screenshot */}
          <div className="max-w-5xl mx-auto">
            <div className="rounded-xl overflow-hidden hero-image-shadow border border-border transition-all duration-500">
              <img
                src={screens[active].image}
                alt={screens[active].label}
                title={screens[active].tooltip}
                className="w-full h-auto"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PlatformExperience;
