import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export interface OutlineButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  arrow?: boolean;
}

export function OutlineButton({
  href,
  children,
  arrow = true,
  className = "",
  rel,
  target,
  ...anchorProps
}: OutlineButtonProps) {
  const safeRel = target === "_blank" ? rel ?? "noreferrer" : rel;

  return (
    <a
      {...anchorProps}
      href={href}
      target={target}
      rel={safeRel}
      className={`artomos-button artomos-button--outline ${className}`.trim()}
    >
      <span className="artomos-button__label">{children}</span>
      {arrow ? (
        <ArrowUpRight
          className="artomos-button__icon"
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      ) : null}
    </a>
  );
}
