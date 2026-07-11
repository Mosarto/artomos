export type TechnicalDecorationVariant =
  | "crosshair"
  | "orbit"
  | "grid"
  | "ticks"
  | "diagonals";

export interface TechnicalDecorationProps {
  variant?: TechnicalDecorationVariant;
  className?: string;
  label?: string;
}

const elementCount: Record<TechnicalDecorationVariant, number> = {
  crosshair: 4,
  orbit: 3,
  grid: 9,
  ticks: 8,
  diagonals: 2,
};

export function TechnicalDecoration({
  variant = "crosshair",
  className = "",
  label,
}: TechnicalDecorationProps) {
  return (
    <div
      className={`artomos-technical-decoration artomos-technical-decoration--${variant} ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: elementCount[variant] }, (_, index) => (
        <span
          className={`artomos-technical-decoration__element artomos-technical-decoration__element--${index + 1}`}
          key={index}
        />
      ))}
      {label ? (
        <span className="artomos-technical-decoration__label">{label}</span>
      ) : null}
    </div>
  );
}
