import { motion } from "framer-motion";
import { Database, Layers, BarChart3, Zap } from "lucide-react";

const cards = [
  {
    title: "Data-Driven",
    description:
      "Built on deep experience in analytics, financial modeling, and large-scale data analysis.",
    icon: Database,
  },
  {
    title: "Research-Oriented",
    description:
      "Designed with an analytical approach that combines structured data, market research, and financial insights.",
    icon: Layers,
  },
  {
    title: "Investment-Focused",
    description:
      "Built for investment professionals who need clear signals across portfolios, markets, and deals.",
    icon: BarChart3,
  },
  {
    title: "Built for Decision-Making",
    description:
      "Focused on turning complex real estate data into practical insights that support capital allocation decisions.",
    icon: Zap,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutPlatform() {
  return (
    <section className="bg-background py-24 px-6 border-t border-border" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground block mb-4">
            About the Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground mb-6">
            Built by Golden Hills
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mt-9" data-nosnippet>
            Asset72 is developed by Golden Hills, an analytics and research
            firm focused on building data-driven decision intelligence platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: ease, delay: i * 0.1 }}

                whileHover={{
                    y: -6,
                    backgroundColor: "#0E2238",
                    boxShadow: "0px 12px 30px rgba(0,0,0,0.35)",
                }}

                className="p-8 rounded-2xl border border-white/10 bg-[#0B1A2B] shadow-md will-change-transform"
                >
              <div className="mb-6">
                <card.icon className="w-6 h-6 text-white/80" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                {card.title}
              </h3>
              <p className="text-white/70 text-[15px] leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
