import Link from "next/link";
import {
  ArrowUpRight,
  Cog,
  Lock,
  Scale,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { HeroNetwork } from "@/components/hero-network";
import { Reveal } from "@/components/reveal";

function BlueprintIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 14 9 5 9-5" />
      <path d="m3 10 9 5 9-5" />
      <path d="M8 8.5h8" opacity="0.45" />
      <path d="M12 6.5v4" opacity="0.45" />
    </svg>
  );
}

const hubItems: {
  label: string;
  icon: LucideIcon | typeof BlueprintIcon;
}[] = [
  { label: "Sonography Advisors", icon: Stethoscope },
  { label: "Engineering Collaborative", icon: Cog },
  { label: "Shared Design", icon: BlueprintIcon },
  { label: "IP / Legal", icon: Scale },
];

export function HeroSection() {
  return (
    <section className="hero-section">
      <HeroNetwork />

      <div className="container-page relative z-10 grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pb-24 lg:pt-14">
        <Reveal>
          <div className="hero-left">
            <div className="hero-eyebrow">
              MEDICAL DEVICE COLLABORATION PLATFORM
            </div>

            <h1 className="hero-title font-display">
              Advancing
              <br />
              Healthcare
              <br />
              <span className="hero-title-accent">Together.</span>
            </h1>

            <p className="hero-subhead">
              A secure hub where clinicians, engineers, and advisors collaborate on
              medical device breakthroughs — with access limited to exactly what each
              member needs.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/#access" className="hero-cta-primary">
                Get Secure Access
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <Link href="/#ecosystem" className="hero-cta-secondary">
                Explore Ecosystem
              </Link>
            </div>

            <div className="hero-tag-bar">
              {["Sonographers", "Engineering", "Clinical", "IP / Legal"].map(
                (label) => (
                  <span key={label} className="hero-tag">
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={140} className="hero-right relative mx-auto w-full max-w-[420px]">
          <div className="hero-glass-card">
            <div className="hero-glass-glow" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="hero-card-logo">
                <BrandLogo variant="horizontal" size="md" href={null} priority />
              </div>

              <div className="hero-hub-panel mt-5 w-full">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="text-[13px] font-semibold text-[#0A1F44]">
                    Secure Hub Preview
                  </span>
                  <span className="hero-protected-badge">
                    <Lock className="h-3 w-3" />
                    Protected
                  </span>
                </div>

                <div className="space-y-2.5">
                  {hubItems.map((item) => (
                    <div key={item.label} className="hero-data-module">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="hero-module-icon">
                          <item.icon className="h-[15px] w-[15px]" />
                        </span>
                        <span className="truncate text-[13.5px] font-medium text-[#0A1F44]">
                          {item.label}
                        </span>
                      </div>
                      <span className="hero-access-btn">ACCESS</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
