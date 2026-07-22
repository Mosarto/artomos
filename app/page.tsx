import AboutServicesSection from "@/components/sections/AboutServicesSection";
import CasesSection from "@/components/sections/CasesSection";
import HeroSection from "@/components/sections/HeroSection";
import HeroToAboutTransition from "@/components/sections/HeroToAboutTransition";
import ProcessContactSection from "@/components/sections/ProcessContactSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://artomos.com/#organization",
      name: "Artomos",
      alternateName: ["Artomos Software House", "Artomos Software House Full Stack"],
      url: "https://artomos.com/",
      logo: "https://artomos.com/apple-touch-icon.png",
      email: "contato@artomos.com",
      description:
        "Software house full stack brasileira especializada em software sob medida, plataformas web, aplicativos mobile, automações e inteligência artificial.",
      areaServed: ["BR", "Worldwide"],
    },
    {
      "@type": "WebSite",
      "@id": "https://artomos.com/#website",
      url: "https://artomos.com/",
      name: "Artomos",
      alternateName: "Artomos — Software House Full Stack",
      inLanguage: "pt-BR",
      publisher: { "@id": "https://artomos.com/#organization" },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://artomos.com/#service",
      name: "Artomos",
      url: "https://artomos.com/",
      image: "https://artomos.com/og.png",
      email: "contato@artomos.com",
      description:
        "Engenharia de software full stack, produtos digitais, plataformas web, aplicativos mobile, automações e soluções com inteligência artificial.",
      areaServed: ["BR", "Worldwide"],
      provider: { "@id": "https://artomos.com/#organization" },
    },
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </SmoothScrollProvider>
  );
}
