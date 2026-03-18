import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    "Portfolio Intelligence",
    "AI Rent Intelligence",
    "Market Radar Signal",
    "Deal Lens",
  ],
  Company: ["About Us", "Contact"],
  Legal: ["Privacy Policy", "Terms of Use"],
};

const footerRoutes: Record<string, { to: string; state?: { scrollTo: string } }> = {
  "Portfolio Intelligence": { to: "/portfolio_intelligence" },
  "AI Rent Intelligence": { to: "/ai_rent_intelligence" },
  "Market Radar Signal": { to: "/market_radar" },
  "Deal Lens": { to: "/deal_lens" },
  "About Us": { to: "/", state: { scrollTo: "#about" } },
  Contact: { to: "/contact" },
  "Privacy Policy": { to: "/privacy-policy" },
  "Terms of Use": { to: "/terms-of-use" },
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">V</span>
              </div>
              <span className="font-display font-bold text-lg">Vertex AI</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Intelligence that moves real estate decisions forward.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-4 text-background/80">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    {footerRoutes[link] ? (
                      <Link
                        to={footerRoutes[link].to}
                        state={footerRoutes[link].state}
                        className="text-sm text-background/50 hover:text-background transition-colors"
                      >
                        {link}
                      </Link>
                    ) : (
                      <span className="text-sm text-background/50">{link}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <p className="text-sm text-background/40 text-center">
            © 2026 Vertex AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
