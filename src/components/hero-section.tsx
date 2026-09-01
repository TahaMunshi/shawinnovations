import Link from "next/link";
import {
  ArrowUpRight,
  Cog,
  HeartPulse,
  Mail,
  Scale,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

const hubs = [
  { label: "Sonography", icon: Stethoscope },
  { label: "Engineering", icon: Cog },
  { label: "Clinical", icon: HeartPulse },
  { label: "IP / Legal", icon: Scale },
];

export function HeroSection() {
  return (
    <section className="hero-diagonal">
      <div className="hero-diagonal-frame">
        <div className="hero-diagonal-visual">
          <div className="hero-diagonal-pattern" aria-hidden="true" />
          <div className="hero-diagonal-glow" aria-hidden="true" />

          <div className="hero-diagonal-left-content">
            <div className="hero-diagonal-icons">
              {hubs.map((item) => (
                <div key={item.label} className="hero-diagonal-icon-card">
                  <item.icon aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-diagonal-meta">
              <p className="hero-diagonal-meta-title">Shaw Innovations</p>
              <p className="hero-diagonal-meta-line">Medical Device Collaboration</p>
              <a
                href="mailto:admin@shawinnovations.com"
                className="hero-diagonal-meta-link"
              >
                <Mail className="h-3.5 w-3.5" />
                admin@shawinnovations.com
              </a>
            </div>
          </div>
        </div>

        <div className="hero-diagonal-copy">
          <Reveal>
            <p className="hero-diagonal-eyebrow">Medical Device Platform</p>
            <h1 className="hero-diagonal-title font-display">
              Advancing
              <br />
              Healthcare
              <br />
              <span>Together.</span>
            </h1>
            <p className="hero-diagonal-sub">
              A secure hub where clinicians, engineers, and advisors collaborate on
              medical device breakthroughs — with access limited to exactly what each
              member needs.
            </p>

            <div className="hero-diagonal-actions">
              <Link href="/#access" className="hero-diagonal-cta">
                Get Secure Access
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/#ecosystem" className="hero-diagonal-link">
                Explore Ecosystem
              </Link>
            </div>

            <div className="hero-diagonal-trust">
              <ShieldCheck className="h-4 w-4" />
              Role-based access · Admin controlled · Protected panels
            </div>
          </Reveal>
        </div>

        <div className="hero-diagonal-slash" aria-hidden="true" />
      </div>
    </section>
  );
}
