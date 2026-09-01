import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "horizontal" | "stacked" | "mark";
  href?: string | null;
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
};

const assets = {
  horizontal: "/brand/logo-horizontal.png",
  stacked: "/brand/logo-stacked.png",
  mark: "/brand/logo-mark.png",
} as const;

/** Intrinsic ratios after trim: horizontal ~3.88:1, stacked ~1.54:1 */
const sizeMap = {
  horizontal: {
    sm: { width: 148, height: 38 },
    md: { width: 176, height: 45 },
    lg: { width: 220, height: 57 },
    xl: { width: 300, height: 77 },
  },
  stacked: {
    sm: { width: 120, height: 78 },
    md: { width: 168, height: 109 },
    lg: { width: 220, height: 143 },
    xl: { width: 280, height: 182 },
  },
  mark: {
    sm: { width: 36, height: 36 },
    md: { width: 44, height: 44 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  },
} as const;

export function BrandLogo({
  variant = "horizontal",
  href = "/",
  className = "",
  priority = false,
  size = "md",
}: BrandLogoProps) {
  const dims = sizeMap[variant][size];

  const image = (
    <Image
      src={assets[variant]}
      alt="Shaw Innovations — Medical Device Collaboration"
      width={dims.width}
      height={dims.height}
      priority={priority}
      unoptimized={false}
      className={`brand-logo brand-logo-${variant} ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
        maxWidth: "100%",
        objectFit: "contain",
      }}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link
      href={href}
      className="brand-logo-link inline-flex items-center leading-none"
      aria-label="Shaw Innovations home"
    >
      {image}
    </Link>
  );
}
