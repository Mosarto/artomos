import AboutServicesSection from "@/components/sections/AboutServicesSection";
import CasesSection from "@/components/sections/CasesSection";
import HeroSection from "@/components/sections/HeroSection";
import HeroToAboutTransition from "@/components/sections/HeroToAboutTransition";
import ProcessContactSection from "@/components/sections/ProcessContactSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Artomos",
  url: "https://artomos.com.br",
  email: "contato@artomos.com.br",
  description:
    "Software house brasileira especializada em software sob medida, aplicativos, plataformas web, automações e inteligência artificial.",
  areaServed: ["BR", "Worldwide"],
};

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <Header />
      <main id="conteudo-principal">
        <div className="artomos-hero-about-experience">
          <HeroToAboutTransition />
          <HeroSection />
          <AboutServicesSection />
        </div>
        <CasesSection />
        <ProcessContactSection />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </SmoothScrollProvider>
  );
}
