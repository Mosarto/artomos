import {
  ArrowRight,
  Hammer,
  PenTool,
  RefreshCw,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ProcessIconKey, ProcessStep } from "../../data/process";

export interface ProcessCardProps {
  step: ProcessStep;
  className?: string;
  isLast?: boolean;
}

const processIcons: Record<ProcessIconKey, LucideIcon> = {
  discover: Search,
  design: PenTool,
  build: Hammer,
  evolve: RefreshCw,
};

export function ProcessCard({
  step,
  className = "",
  isLast = false,
}: ProcessCardProps) {
  const Icon = processIcons[step.icon];

  return (
    <article
      className={`artomos-process-card ${className}`.trim()}
      data-process-step={step.id}
    >
      <header className="artomos-process-card__header">
        <span className="artomos-process-card__number" aria-hidden="true">
          {step.number}
        </span>
        {!isLast ? (
          <ArrowRight
            className="artomos-process-card__connector-arrow"
            size={30}
            strokeWidth={1.1}
            aria-hidden="true"
          />
        ) : null}
      </header>

      <div className="artomos-process-card__icon-frame" aria-hidden="true">
        <Icon
          className="artomos-process-card__icon"
          size={30}
          strokeWidth={1.2}
        />
      </div>

      <h3 className="artomos-process-card__title">{step.title}</h3>
      <span className="artomos-process-card__rule" aria-hidden="true" />
      <p className="artomos-process-card__description">{step.description}</p>
    </article>
  );
}
