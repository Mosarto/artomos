import type { ReactNode } from "react";

export interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  index?: string;
}

export function SectionLabel({
  children,
  className = "",
  index,
}: SectionLabelProps) {
  return (
    <p className={`artomos-section-label ${className}`.trim()}>
      {index ? (
        <span className="artomos-section-label__index" aria-hidden="true">
          {index}
        </span>
      ) : null}
      <span className="artomos-section-label__text">{children}</span>
    </p>
  );
}
