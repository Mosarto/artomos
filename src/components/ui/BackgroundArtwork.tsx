import Image from "next/image";

export interface BackgroundArtworkProps {
  src: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export function BackgroundArtwork({
  src,
  className = "",
  imageClassName = "",
  objectPosition = "center",
  priority = false,
  quality = 90,
  sizes = "100vw",
}: BackgroundArtworkProps) {
  return (
    <div
      className={`artomos-background-artwork ${className}`.trim()}
      aria-hidden="true"
      data-artwork-src={src}
    >
      <Image
        className={`artomos-background-artwork__image ${imageClassName}`.trim()}
        src={src}
        alt=""
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        draggable={false}
        unoptimized
        style={{ objectPosition }}
      />
      <span className="artomos-background-artwork__veil" />
      <span className="artomos-background-artwork__grain" />
    </div>
  );
}
