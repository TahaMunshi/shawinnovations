export type CatalogSection = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  isBlank?: boolean;
};

export const SECTION_CATALOG: CatalogSection[] = [
  {
    slug: "sonographer-advisors",
    name: "Sonography Advisors",
    description:
      "Secure hub for sonographer advisors with centralized resources and certification tracking.",
    category: "Clinical",
    icon: "stethoscope",
  },
  {
    slug: "advent-health-orlando",
    name: "Advent Health Orlando",
    description: "Protected community for Advent Health Orlando collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
  },
  {
    slug: "orlando-regional-health",
    name: "Orlando Regional Health",
    description: "Protected community for Orlando Regional Health collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
  },
  {
    slug: "hca-florida",
    name: "HCA Florida",
    description: "Protected community for HCA Florida collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
  },
  {
    slug: "sonographers-outside-florida",
    name: "Sonographers Outside Florida",
    description: "Community for sonographer advisors practicing outside Florida.",
    category: "Clinical",
    icon: "users",
  },
  {
    slug: "shared-design-prototypes",
    name: "Shared Design / Prototypes",
    description: "Shared design files, prototypes, and collaborative review materials.",
    category: "Engineering",
    icon: "layers",
  },
  {
    slug: "engineering-collaborative",
    name: "Engineering Collaborative",
    description:
      "Mechanical, electrical, and industrial design teams with CAD and prototype access.",
    category: "Engineering",
    icon: "cog",
  },
  {
    slug: "university-faculty-partners",
    name: "University Faculty Partners",
    description: "Collaboration space for university faculty partners.",
    category: "Partners",
    icon: "graduation-cap",
  },
  {
    slug: "prospective-partners",
    name: "Prospective Partners",
    description:
      "Admin-directed access to unpublished materials such as Google video and sell sheets.",
    category: "Partners",
    icon: "briefcase",
  },
  {
    slug: "clinical-advisors",
    name: "Clinical Advisors",
    description: "Dedicated space for clinical advisors contributing to device development.",
    category: "Clinical",
    icon: "heart-pulse",
  },
  {
    slug: "ideas-board",
    name: "Ideas Board",
    description: "Capture and discuss innovation ideas across the Shaw ecosystem.",
    category: "Collaboration",
    icon: "lightbulb",
  },
  {
    slug: "ip-legal",
    name: "IP / Legal",
    description: "Protected access for intellectual property and legal materials.",
    category: "Legal",
    icon: "scale",
  },
  {
    slug: "future-panel-1",
    name: "Future Panel 1",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
  },
  {
    slug: "future-panel-2",
    name: "Future Panel 2",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
  },
  {
    slug: "future-panel-3",
    name: "Future Panel 3",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
  },
  {
    slug: "future-panel-4",
    name: "Future Panel 4",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
  },
];

export function getCatalogSection(slug: string) {
  return SECTION_CATALOG.find((section) => section.slug === slug) ?? null;
}
