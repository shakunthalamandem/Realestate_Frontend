
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AILayer from "../components/AILayer";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import PlatformExperience from "../components/PlatformExperience";
import PlatformFeatures from "../components/PlatformFeatures";
import SocialProof from "../components/SocialProof";
import UseCases from "../components/UseCases";
import WhyChooseVertex from "../components/WhyChooseVertex";
import WhyVertex from "../components/WhyVertex";
import AboutUs from "@/components/AboutUs";

const scrollToSection = (sectionId: string) => {
  if (!sectionId) return;
  const normalized = sectionId.startsWith("#") ? sectionId.substring(1) : sectionId;
  const target = document.getElementById(normalized);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }
    }

    const scrollTarget = location.state?.scrollTo;
    if (typeof scrollTarget === "string") {
      setTimeout(() => {
        scrollToSection(scrollTarget);
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhyChooseVertex />
      <PlatformFeatures />
      <HowItWorks />
      <UseCases />
      <AILayer />
      <PlatformExperience />
      <WhyVertex />
      <AboutUs/>
      {/* <SocialProof /> */}
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
