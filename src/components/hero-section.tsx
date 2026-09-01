import Link from "next/link";
import {
  ArrowUpRight,
  Cog,
  HeartPulse,
  Lock,
  Scale,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { MediaFrame } from "@/components/media-frame";
import { Reveal } from "@/components/reveal";

const hubItems: {
  label: string;
  icon: LucideIcon;
}[] = [
  { label: "Sonography Advisors", icon: Stethoscope },
  { label: "Engineering Collaborative", icon: Cog },
  { label: "Clinical Partners", icon: HeartPulse },
  { label: "IP / Legal", icon: Scale },
];
export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container-page hero-shell">
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

            <div className="hero-actions">
              <Link href="/#access" className="hero-cta-primary">
                Get Secure Access
                <ArrowUpRight className="h-4 w-4 stroke-[2.4]" />
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

        <Reveal delayMs={100} className="hero-right w-full">
          <div className="hero-media-stack">
            <MediaFrame
              src="/imagery/sonography.jpg"
              alt="Clinical ultrasound imaging for sonographer collaboration"
              className="hero-media"
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              objectPosition="center 35%"
            />

            <div className="hero-hub-overlay">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <BrandLogo variant="horizontal" size="sm" href={null} />
                </div>
                <span className="hero-protected-badge">
                  <Lock className="h-3 w-3" />
                  Protected
                </span>
              </div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.04em] text-[#0A1F44]">
                Secure Hub Preview
              </p>
              <div className="space-y-1.5">
                {hubItems.map((item) => (
                  <div key={item.label} className="hero-data-module">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="hero-module-icon">
                        <item.icon className="h-[14px] w-[14px]" />
                      </span>
                      <span className="truncate text-[13px] font-medium text-[#0A1F44]">
                        {item.label}
                      </span>
                    </div>
                    <span className="hero-access-btn">ACCESS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
