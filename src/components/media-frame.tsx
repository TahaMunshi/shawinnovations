import Image from "next/image";

type MediaFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** CSS object-position, e.g. "center", "70% center" */
  objectPosition?: string;
};

/** Full-bleed image frame: no letterboxing, no blur fill. */
export function MediaFrame({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  objectPosition = "center",
}: MediaFrameProps) {
  return (
    <div className={`media-frame ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center"
        style={{ objectPosition, borderRadius: "inherit" }}
      />
    </div>
  );
}
