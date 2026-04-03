import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import asset72FooterLogo from "@/assets/asset72-footer-logo.svg";
import { Linkedin, Mail } from "lucide-react";
import { productRoutes } from "@/lib/product-routes";
const footerLinks = {
  Product: [
    "Portfolio Intelligence",
    "AI Rent Intelligence",
    "Market Radar Signal",
    "Deal Lens",
  ],
  Company: ["About Us", "Contact"],
  Legal: ["Privacy Policy", "Terms of Use"],
  Platforms: ["LinkedIn", "Email"],
};

const footerRoutes: Record<
  string,
  { to?: string; state?: { scrollTo: string }; href?: string }
> = {
  "Portfolio Intelligence": { to: productRoutes.portfolioIntelligence },
  "AI Rent Intelligence": { to: productRoutes.aiRentIntelligence },
  "Market Radar Signal": { to: productRoutes.marketRadar },
  "Deal Lens": { to: productRoutes.dealLens },
  "About Us": { to: "/", state: { scrollTo: "#about" } },
  Contact: { to: "/contact" },
  "Privacy Policy": { to: "/privacy-policy" },
  "Terms of Use": { to: "/terms-of-use" },
  LinkedIn: { href: "https://www.linkedin.com/company/asset72/" },
  Email: { href: "mailto:asset72@ghills.ai" },
};
const footerIcons: Record<string, any> = {
  LinkedIn: Linkedin,
  Email: Mail,
};
const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-7">
          <div className="flex flex-col items-start">
            <img
              src={asset72FooterLogo}
              alt="Asset72"
              className="-mb-7 h-[9rem] w-auto max-w-[29rem] object-contain"
            />
            <p className="mt-0 text-sm text-background/60 leading-relaxed">
              Analyze in Minutes. Act with Conviction
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-sm uppercase tracking-widest mb-4 text-background/80 ">
                {category}
              </h4>
              {category === "Platforms" ? (
                
                <div className="flex items-center gap-4">
                  {links.map((link) => {
                    const Icon = footerIcons[link];
                    const route = footerRoutes[link];

                    return (
                      <a
                        key={link}
                        href={route?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link}
                        className="p-2 rounded-md bg-background/5 text-background/70 hover:text-white hover:bg-background/10 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      {footerRoutes[link]?.to ? (
                        <Link
                          to={footerRoutes[link].to}
                          state={footerRoutes[link].state}
                          className="text-sm text-background/50 hover:text-background transition-colors"
                        >
                          {link}
                        </Link>
                      ) : (
                        <span className="text-sm text-background/50">
                          {link}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <p className="text-sm text-background/40 text-center">
            Copyright 2026 Asset72. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
