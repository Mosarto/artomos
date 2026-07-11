"use client";

import { useLayoutEffect, useRef } from "react";

import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { gsap } from "@/lib/gsap";
import {
  SectionLabel,
  ServiceCard,
} from "@/components/ui";
import { Container } from "@/components/layout/Container";

export function AboutServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const { reducedMotion } = matchContext.conditions as {
            desktop: boolean;
            mobile: boolean;
            reducedMotion: boolean;
          };

          if (reducedMotion) {
            gsap.set(
              [
                "[data-about-title-line]",
                "[data-about-copy]",
                "[data-about-artwork]",
                ".artomos-service-card",
                "[data-services-connector]",
              ],
              { clearProps: "all" },
            );
            return;
          }

          const introduction = gsap.timeline({
            defaults: { duration: 0.86, ease: "power3.out" },
            scrollTrigger: {
              trigger: ".artomos-services__intro",
              start: "top 76%",
              once: true,
            },
          });

          introduction
            .from("[data-about-eyebrow]", { autoAlpha: 0, y: 18 })
            .from(
              "[data-about-title-line]",
              { autoAlpha: 0, yPercent: 110, stagger: 0.12, duration: 1 },
              "-=0.55",
            )
            .from(
              "[data-about-copy]",
              { autoAlpha: 0, y: 24, stagger: 0.1 },
              "-=0.55",
            )
            .from(
              "[data-about-artwork]",
              { autoAlpha: 0, scale: 0.97, duration: 1.15 },
              "-=0.86",
            );

          gsap.from("[data-services-connector]", {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-services-connector]",
              start: "top 84%",
              once: true,
            },
          });

          gsap.from(".artomos-service-card", {
            autoAlpha: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.82,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".artomos-services__grid",
              start: "top 78%",
              once: true,
            },
          });

        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="artomos-section artomos-services"
      aria-labelledby="artomos-services-title"
    >
      <div className="artomos-services__grid-background" aria-hidden="true" />

      <Container className="artomos-services__container">
        <div className="artomos-services__intro">
          <div
            id={siteConfig.about.id}
            className="artomos-services__intro-copy"
          >
            <div data-about-eyebrow>
              <SectionLabel index="02">{siteConfig.about.eyebrow}</SectionLabel>
            </div>

            <h2 id="artomos-services-title" className="artomos-services__title">
              {siteConfig.about.titleLines.map((line) => (
                <span className="artomos-services__title-mask" key={line}>
                  <span data-about-title-line>{line}</span>
                </span>
              ))}
            </h2>

            <p className="artomos-services__subtitle" data-about-copy>
              {siteConfig.about.subtitle}
            </p>
            <p className="artomos-services__description" data-about-copy>
              {siteConfig.about.description}
            </p>

            <p className="artomos-services__manifesto" data-about-copy>
              {siteConfig.about.manifesto.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>

          <div
            className="artomos-services__artwork-frame"
            aria-hidden="true"
            data-about-artwork
          >
            <div className="artomos-services__artwork-scrim" aria-hidden="true" />
            <div className="artomos-services__artwork-reticle" aria-hidden="true">
              <span />
              <span />
              <i />
            </div>
          </div>
        </div>

        <div
          className="artomos-services__connector"
          aria-hidden="true"
          data-services-connector
        >
          <span>01—06</span>
          <i />
          <span>CAPACIDADES</span>
        </div>

        <div className="artomos-services__grid" aria-label="Serviços da Artomos">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default AboutServicesSection;
