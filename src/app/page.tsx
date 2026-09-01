import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  FolderLock,
  KeyRound,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { HeroSection } from "@/components/hero-section";
import { MediaFrame } from "@/components/media-frame";
import { Reveal } from "@/components/reveal";
import { SectionIcon } from "@/components/section-icon";

const audiences = [
  {
    title: "Sonographer Advisors",
    text: "Access advisor hubs, certifications, and clinical feedback channels.",
    icon: "stethoscope",
  },
  {
    title: "Hospital Partners",
    text: "Dedicated panels for Advent Health, Orlando Regional, HCA Florida, and more.",
    icon: "hospital",
  },
  {
    title: "Engineering Teams",
    text: "Collaborate on CAD, prototypes, and shared design reviews securely.",
    icon: "cog",
  },
  {
    title: "Clinical & Legal Advisors",
    text: "Role-based rooms for clinical guidance and protected IP / legal materials.",
    icon: "scale",
  },
];

const ecosystemCards = [
  {
    title: "Hospital & Clinical Partners",
    description: "Dedicated facility-facing panels for hospital communities and clinical collaboration.",
    icon: "hospital",
  },
  {
    title: "Engineering Collaborative",
    description: "Mechanical, electrical, and industrial design with CAD & prototypes.",
    icon: "cog",
  },
  {
    title: "IP / Legal",
    description: "Protected access for intellectual property and legal materials.",
    icon: "scale",
  },
  {
    title: "Secure Dashboards",
    description: "Permissioned panels so each member only sees what they need.",
    icon: "shield",
  },
  {
    title: "Integrated Meetings",
    description: "Admin-managed Zoom meetings with invites scoped to the right users.",
    icon: "zoom",
  },
  {
    title: "Administrative Control",
    description: "Grant, update, and revoke access across every protected section.",
    icon: "panel",
  },
];

const steps = [
  {
    title: "Discover the ecosystem",
    text: "Explore how clinicians, engineers, and advisors collaborate inside Shaw Innovations.",
  },
  {
    title: "Understand secure access",
    text: "Every panel is permission-based. Members only enter the rooms assigned to them.",
  },
  {
    title: "Request or receive access",
    text: "Administrators authorize accounts, assign sections, and can revoke access anytime.",
  },
  {
    title: "Collaborate with confidence",
    text: "Share resources, track milestones, join Zoom meetings, and move innovation forward.",
  },
];

const securityPillars = [
  {
    icon: FolderLock,
    title: "Protected Sections",
    text: "8+ secured communities with permission checks on every request.",
  },
  {
    icon: Users,
    title: "Admin Visibility",
    text: "See users, profiles, and exact panel access in one place.",
  },
  {
    icon: Video,
    title: "Scoped Meetings",
    text: "Zoom invites limited to the collaborators who should attend.",
  },
  {
    icon: ShieldCheck,
    title: "Instant Revocation",
    text: "Remove a person or a single section’s access immediately.",
  },
  {
    icon: ClipboardList,
    title: "Audit Trail",
    text: "Track sensitive permission changes for accountability.",
  },
  {
    icon: KeyRound,
    title: "Least Privilege",
    text: "Members only enter the rooms assigned to their role.",
  },
];

export default function HomePage() {
  return (
    <div className="premium-shell">
      <HeroSection />

      <section id="who" className="section-pad border-t border-[rgba(16,24,40,0.08)] bg-white">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Who It&apos;s For</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0A1F44] sm:text-5xl">
              Built for every collaborator in the device journey.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#667085]">
              From clinical advisors and hospital partners to engineering and legal teams —
              each community works in a dedicated, permissioned space.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 60}>
                <div className="soft-card-solid h-full p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#f3f6f8] text-[#0f766e]">
                    <SectionIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold tracking-[-0.02em] text-[#0A1F44]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#667085]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="section-pad bg-[#f7f9fb]">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Ecosystem</p>
              <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0A1F44] sm:text-5xl">
                Collaboration panels that stay secure.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-[#667085]">
              From hospital communities to engineering rooms and legal panels — each
              space is password-protected and permission-aware.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ecosystemCards.map((card, index) => (
              <Reveal key={card.title} delayMs={index * 60} as="article">
                <div className="soft-card-solid h-full p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#f3f6f8] text-[#0f766e]">
                    <SectionIcon name={card.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#0A1F44]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
                    {card.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-pad border-y border-[rgba(16,24,40,0.08)] bg-white">
        <div className="container-page">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow">How It Works</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0A1F44] sm:text-5xl">
              A clear path from discovery to collaboration.
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" style={{ counterReset: "funnel" }}>
            {steps.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 80} as="article">
                <div className="funnel-step soft-card-solid h-full p-5">
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#0A1F44]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#667085]">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="section-pad bg-[#f7f9fb]">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Security & Trust</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#0A1F44] sm:text-5xl">
              Designed for sensitive medical collaboration.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#667085]">
              Shaw Innovations prioritizes authentication, authorization, and admin
              control so hospital partners and advisors can collaborate without
              oversharing.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {securityPillars.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 60}>
                <div className="soft-card-solid h-full p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#f3f6f8] text-[#0f766e]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold tracking-[-0.02em] text-[#0A1F44]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#667085]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="section-pad border-t border-[rgba(16,24,40,0.08)] bg-white">
        <div className="container-page">
          <Reveal>
            <div className="soft-card-solid overflow-hidden lg:grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-7 sm:p-10">
                <BrandLogo variant="horizontal" size="sm" href={null} />
                <p className="eyebrow mt-6">Ready to Collaborate</p>
                <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] text-[#0A1F44] sm:text-4xl">
                  Enter the secure hub — or request authorized access.
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#667085]">
                  Existing members can sign in immediately. New collaborators should
                  request access so an administrator can assign the right panels.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold"
                  >
                    Member Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:admin@shawinnovations.com?subject=Access%20Request%20-%20Shaw%20Innovations"
                    className="btn-secondary inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold"
                  >
                    Request Access
                  </a>
                </div>
              </div>
              <MediaFrame
                src="/imagery/engineering-cta.jpg"
                alt="Engineering and prototype collaboration for medical devices"
                className="media-cta"
                sizes="(max-width: 1024px) 100vw, 45vw"
                objectPosition="center"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
