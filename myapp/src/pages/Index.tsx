
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

const Index = () => {
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
      <SocialProof />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
