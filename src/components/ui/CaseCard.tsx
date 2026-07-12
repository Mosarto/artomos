import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { CaseStudy } from "../../data/cases";

export interface CaseCardProps {
  project: CaseStudy;
  className?: string;
}

export function CaseCard({ project, className = "" }: CaseCardProps) {
  return (
    <article
      className={`artomos-case-card ${className}`.trim()}
      data-project={project.id}
    >
      {project.href ? (
        <a
          className="artomos-case-card__link-overlay"
          href={project.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir o projeto ${project.name} no GitHub`}
        />
      ) : null}

      <header className="artomos-case-card__header">
        <span className="artomos-case-card__number" aria-hidden="true">
          {project.number}
        </span>
        <p className="artomos-case-card__category">{project.category}</p>
      </header>

      <h3 className="artomos-case-card__title">{project.name}</h3>
      <p className="artomos-case-card__description">{project.description}</p>

      <div
        className="artomos-case-card__visual"
        role="img"
        aria-label={
          project.image
            ? `Imagem do projeto ${project.name}`
            : `Espaço reservado para uma imagem do projeto ${project.name}`
        }
      >
        {project.image ? (
          <Image
            className="artomos-case-card__image"
            src={project.image}
            alt={project.imageAlt ?? `Imagem do projeto ${project.name}`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <>
            <span className="artomos-case-card__diagonal artomos-case-card__diagonal--a" />
            <span className="artomos-case-card__diagonal artomos-case-card__diagonal--b" />
            <span className="artomos-case-card__visual-label">
              IMAGEM DO PROJETO
            </span>
          </>
        )}
      </div>

      <ul className="artomos-case-card__highlights" aria-label="Destaques do projeto">
        {project.highlights.map((highlight) => (
          <li className="artomos-case-card__highlight" key={highlight}>
            {highlight}
          </li>
        ))}
      </ul>

      <ul className="artomos-case-card__technologies" aria-label="Tecnologias utilizadas">
        {project.technologies.map((technology) => (
          <li className="artomos-case-card__technology" key={technology}>
            {technology}
          </li>
        ))}
      </ul>

      <ArrowUpRight
        className="artomos-case-card__arrow"
        size={22}
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </article>
  );
}
