"use client";

import { useLayoutEffect, useRef } from "react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { BackgroundArtwork } from "@/components/ui/BackgroundArtwork";
import { CaseCard } from "@/components/ui/CaseCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechnicalDecoration } from "@/components/ui/TechnicalDecoration";
import { cases } from "@/data/cases";
import { gsap } from "@/lib/gsap";

type MotionConditions = {
  desktop?: boolean;
  mobile?: boolean;
  reduced?: boolean;
};

export function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const matchMedia = gsap.matchMedia();
    const select = gsap.utils.selector(section);
    const context = gsap.context(() => {
      matchMedia.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile:
            "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const { desktop, reduced } =
            mediaContext.conditions as MotionConditions;
          const label = select(".artomos-cases__label");
          const titleLines = select(".artomos-cases__title-line");
          const description = select(".artomos-cases__description");
          const cards = select(".artomos-cases__card");
          const artworkImage = select(".artomos-cases__artwork-image");
          const orbit = select(".artomos-cases__orbit");

          if (reduced) {
            gsap.set(
              [
                ...label,
                ...titleLines,
                ...description,
                ...cards,
                ...artworkImage,
                ...orbit,
              ],
              { clearProps: "all" },
            );
            return;
          }

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: section,
                start: desktop ? "top 72%" : "top 84%",
                once: true,
              },
            })
            .from(label, { autoAlpha: 0, y: 20, duration: 0.55 })
            .from(
              titleLines,
              {
                autoAlpha: 0,
                yPercent: desktop ? 105 : 55,
                duration: desktop ? 0.85 : 0.7,
                stagger: 0.08,
              },
              "-=0.28",
            )
            .from(
              description,
              { autoAlpha: 0, y: 24, duration: 0.55 },
              "-=0.38",
            )
            .from(
              cards,
              {
                autoAlpha: 0,
                y: desktop ? 64 : 34,
                duration: desktop ? 0.85 : 0.65,
                stagger: desktop ? 0.14 : 0.1,
              },
              "-=0.2",
            );

          gsap.fromTo(
            artworkImage,
            { scale: 1.045, yPercent: -2 },
            {
              scale: 1,
              yPercent: desktop ? 7 : 3,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: desktop ? 1 : 0.5,
              },
            },
          );

          if (desktop) {
            gsap.to(orbit, {
              rotate: 16,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        },
      );
    }, section);

    return () => {
      matchMedia.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={siteConfig.cases.id}
      className="artomos-section artomos-cases"
      aria-labelledby="artomos-cases-title"
    >
      <BackgroundArtwork
        src={siteConfig.artwork.cases}
        className="artomos-cases__artwork"
        imageClassName="artomos-cases__artwork-image"
        objectPosition="76% center"
        sizes="100vw"
      />
      <TechnicalDecoration
        variant="orbit"
        className="artomos-cases__orbit"
      />
      <TechnicalDecoration
        variant="ticks"
        className="artomos-cases__ticks"
        label="03 / PROJETOS"
      />

      <Container className="artomos-cases__container">
        <header className="artomos-cases__header">
          <div className="artomos-cases__heading">
            <SectionLabel index="03" className="artomos-cases__label">
              {siteConfig.cases.eyebrow}
            </SectionLabel>
            <h2 id="artomos-cases-title" className="artomos-cases__title">
              {siteConfig.cases.titleLines.map((line) => (
                <span className="artomos-cases__title-mask" key={line}>
                  <span className="artomos-cases__title-line">{line}</span>
                </span>
              ))}
            </h2>
          </div>

          <div className="artomos-cases__intro">
            <p className="artomos-cases__description">
              {siteConfig.cases.description}
            </p>
          </div>
        </header>

        <div className="artomos-cases__grid">
          {cases.map((project) => (
            <CaseCard
              className="artomos-cases__card"
              key={project.id}
              project={project}
            />
          ))}
        </div>

        <div className="artomos-cases__closing" aria-hidden="true">
          <span>ARQUITETURA</span>
          <span>EXPERIÊNCIA</span>
          <span>AUTOMAÇÃO</span>
        </div>
      </Container>
    </section>
  );
}

export default CasesSection;
