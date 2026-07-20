export interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <svg
      className={`artomos-brand-mark ${className}`.trim()}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 2h9v9H2V2Z" className="artomos-brand-mark__tile" />
      <path d="M17 2h9v9h-9V2Z" className="artomos-brand-mark__tile" />
      <path d="M2 17h9v9H2v-9Z" className="artomos-brand-mark__tile" />
      <path d="M17 17h9v9h-9v-9Z" className="artomos-brand-mark__tile artomos-brand-mark__tile--accent" />
      <path d="M11 6.5h6M6.5 11v6M21.5 11v6M11 21.5h6" className="artomos-brand-mark__bridge" />
    </svg>
  );
}

export default BrandMark;
