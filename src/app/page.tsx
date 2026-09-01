import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FolderLock,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
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
    title: "Sonographer Advisors Hub",
    description: "Centralized resources and advisor workflows in one protected space.",
    icon: "stethoscope",
  },
  {
    title: "Engineering Collaborative",
    description: "Mechanical, electrical, and industrial design with CAD & prototypes.",
    icon: "cog",
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
  {
    title: "Future-Ready Panels",
    description: "Blank reserved communities ready as the collaboration network grows.",
    icon: "layers",
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

const trustPoints = [
  "Role-based section permissions on every protected route",
  "Admin visibility into users, profiles, and exact access maps",
  "Instant access revocation for people and individual panels",
  "Zoom meeting invites limited to relevant collaborators",
  "Audit trail for sensitive permission changes",
];

export default function HomePage() {
  return (
    <div className="premium-shell">
      {/* 1. Awareness */}
      <section className="relative overflow-hidden">
        <div className="container-page grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-16">
          <Reveal>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(16,24,40,0.06)] bg-white/80 px-3 py-1 text-[12px] font-semibold tracking-[0.08em] text-[#667085] shadow-[0_8px_24px_rgba(16,24,40,0.04)]">
                MEDICAL DEVICE COLLABORATION PLATFORM
              </div>

              <h1 className="font-display max-w-[12ch] text-[3.25rem] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#101828] sm:text-[4.5rem] lg:text-[5rem]">
                Advancing Healthcare
                <span className="accent-dot"> Together</span>
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[#667085]">
                A secure hub where clinicians, engineers, and advisors collaborate on
                medical device breakthroughs — with access limited to exactly what each
                member needs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/#access"
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Get Secure Access
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#ecosystem"
                  className="btn-secondary rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Explore Ecosystem
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-2">
                {["Sonographers", "Engineering", "Clinical", "IP / Legal"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full bg-[#e6f7f5] px-3.5 py-1.5 text-[12px] font-semibold text-[#0f766e]"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={120} className="relative mx-auto w-full max-w-md">
            <div className="hero-orb relative overflow-hidden rounded-[2.5rem] p-6 sm:p-8">
              <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-white/50 blur-2xl" />
              <div className="float-slow absolute left-1/2 top-[10%] h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-300/40 via-white to-cyan-200/50 blur-xl" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="rounded-3xl bg-white/70 p-5 shadow-[0_10px_40px_rgba(16,24,40,0.06)] ring-1 ring-white/80 backdrop-blur">
                  <BrandLogo variant="horizontal" size="lg" href={null} priority />
                </div>
                <div className="soft-card mt-6 w-full rounded-2xl p-4 text-left">
                  <div className="mb-3 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#101828]">Secure Hub Preview</span>
                    <span className="rounded-full bg-[#e6f7f5] px-2 py-0.5 font-semibold text-[#0f766e]">
                      Protected
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      "Sonography Advisors",
                      "Engineering Collaborative",
                      "Shared Design",
                      "IP / Legal",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl bg-[#f5f7fa] px-3 py-2.5"
                      >
                        <span className="text-sm font-medium text-[#101828]">{item}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0f766e]">
                          Access
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Interest — Who it's for */}
      <section id="who" className="section-pad border-t border-[rgba(16,24,40,0.06)] bg-white/65">
        <div className="container-page">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow">Who It&apos;s For</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl">
              Built for every collaborator in the device journey
              <span className="text-[#0d9488]">.</span>
            </h2>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ counterReset: "funnel" }}>
            {audiences.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 80} as="article">
                <div className="soft-card-solid h-full rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(16,24,40,0.08)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f7fa] text-[#0f766e]">
                    <SectionIcon name={item.icon} />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#101828]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#667085]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Interest — Ecosystem */}
      <section id="ecosystem" className="section-pad">
        <div className="container-page">
          <Reveal className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Ecosystem</p>
              <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl">
                Collaboration panels that stay secure
                <span className="text-[#0d9488]">.</span>
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-[#667085]">
              From hospital communities to engineering rooms and legal panels — each
              space is password-protected and permission-aware.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemCards.map((card, index) => (
              <Reveal key={card.title} delayMs={index * 70} as="article">
                <div className="soft-card-solid group h-full rounded-[1.6rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(16,24,40,0.08)]">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f7fa] text-[#0f766e] transition group-hover:bg-[#e6f7f5]">
                    <SectionIcon name={card.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-[#101828]">
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

      {/* 4. Consideration — How it works */}
      <section
        id="how-it-works"
        className="section-pad border-y border-[rgba(16,24,40,0.06)] bg-white/70"
      >
        <div className="container-page">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow">How It Works</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl">
              A clear path from discovery to collaboration
              <span className="text-[#0d9488]">.</span>
            </h2>
          </Reveal>

          <div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            style={{ counterReset: "funnel" }}
          >
            {steps.map((step, index) => (
              <Reveal key={step.title} delayMs={index * 90} as="article">
                <div className="funnel-step soft-card-solid h-full rounded-[1.5rem] p-5">
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#101828]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#667085]">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Consideration — Security / trust */}
      <section id="security" className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Security & Trust</p>
            <h2 className="font-display mt-2 text-4xl font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl">
              Designed for sensitive medical collaboration
              <span className="text-[#0d9488]">.</span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#667085]">
              Shaw Innovations prioritizes authentication, authorization, and admin
              control so hospital partners and advisors can collaborate without
              oversharing.
            </p>
            <ul className="mt-8 space-y-3">
              {trustPoints.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] font-medium text-[#344054]"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e6f7f5] text-[#0f766e]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: FolderLock,
                  title: "Protected Sections",
                  text: "8+ secured communities with checks on every request.",
                },
                {
                  icon: Users,
                  title: "Admin Visibility",
                  text: "See users, profiles, and exact panel permissions.",
                },
                {
                  icon: Video,
                  title: "Zoom Meetings",
                  text: "Invite only the collaborators who should attend.",
                },
                {
                  icon: ShieldCheck,
                  title: "Access Revocation",
                  text: "Remove user or section access instantly when needed.",
                },
              ].map((item) => (
                <div key={item.title} className="soft-card-solid rounded-[1.5rem] p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f7fa] text-[#0f766e]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] text-[#101828]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#667085]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Conversion */}
      <section id="access" className="section-pad border-t border-[rgba(16,24,40,0.06)]">
        <div className="container-page">
          <Reveal>
            <div className="soft-card-solid relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 lg:px-14">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#e6f7f5] blur-2xl" />
              <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-cyan-100/60 blur-2xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-4 flex items-center gap-3">
                    <BrandLogo variant="horizontal" size="sm" href={null} />
                  </div>
                  <p className="eyebrow">Ready to Collaborate</p>
                  <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] text-[#101828] sm:text-4xl">
                    Enter the secure hub — or request authorized access
                    <span className="text-[#0d9488]">.</span>
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#667085]">
                    Existing members can sign in immediately. New collaborators should
                    request access so an administrator can assign the right panels.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/login"
                    className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Member Login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="mailto:admin@shawinnovations.com?subject=Access%20Request%20-%20Shaw%20Innovations"
                    className="btn-secondary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
                  >
                    Request Access
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
