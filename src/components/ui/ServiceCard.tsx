import {
  ArrowUpRight,
  Bot,
  Cloud,
  Code2,
  Compass,
  PenTool,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { Service, ServiceIconKey } from "../../data/services";

export interface ServiceCardProps {
  service: Service;
  className?: string;
}

const serviceIcons: Record<ServiceIconKey, LucideIcon> = {
  strategy: Compass,
  design: PenTool,
  software: Code2,
  ai: Bot,
  mobile: Smartphone,
  cloud: Cloud,
};

export function ServiceCard({ service, className = "" }: ServiceCardProps) {
  const Icon = serviceIcons[service.icon];

  return (
    <article
      className={`artomos-service-card ${className}`.trim()}
      data-service={service.id}
    >
      <div className="artomos-service-card__meta">
        <span className="artomos-service-card__number" aria-hidden="true">
          {service.number}
        </span>
        <Icon
          className="artomos-service-card__icon"
          size={26}
          strokeWidth={1.25}
          aria-hidden="true"
        />
      </div>
      <h3 className="artomos-service-card__title">{service.title}</h3>
      <p className="artomos-service-card__description">{service.description}</p>
      <ArrowUpRight
        className="artomos-service-card__arrow"
        size={20}
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </article>
  );
}
