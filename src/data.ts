export type Persona = {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  certification?: string;
  headshot?: string;
  panels: string[];
};

export type Resource = {
  title: string;
  kind: "Document" | "Video" | "CAD" | "Prototype" | "Sell sheet";
  status: string;
};

export type Milestone = {
  title: string;
  date: string;
  status: "Complete" | "In review" | "Planned";
  linkedAsset?: string;
};

export type Meeting = {
  id: string;
  title: string;
  panel: string;
  date: string;
  duration: number;
  attendees: string[];
  minutes: string;
  aiSummary: string;
};

export type Panel = {
  slug: string;
  name: string;
  community: string;
  description: string;
  reserved?: boolean;
  resources: Resource[];
  milestones: Milestone[];
};

const empty = { resources: [] as Resource[], milestones: [] as Milestone[] };

export const panels: Panel[] = [
  {
    slug: "sonographer-advisors",
    name: "Sonography Advisors",
    community: "Clinical Communities",
    description: "Advisor profiles, certifications, research references, and clinical feedback.",
    resources: [
      { title: "Advisor onboarding overview", kind: "Document", status: "Preview copy" },
      { title: "Clinical workflow interview", kind: "Video", status: "Placeholder" },
    ],
    milestones: [
      { title: "Workflow discovery", date: "Sep 2026", status: "Complete" },
      { title: "Clinical feedback synthesis", date: "Oct 2026", status: "In review" },
    ],
  },
  {
    slug: "advent-health-orlando",
    name: "AdventHealth Orlando",
    community: "Hospital Partners",
    description: "A prospective facility collaboration panel for Orlando-based stakeholders.",
    ...empty,
  },
  {
    slug: "orlando-regional-health",
    name: "Orlando Regional Health",
    community: "Hospital Partners",
    description: "A prospective community panel for regional clinical collaboration.",
    ...empty,
  },
  {
    slug: "hca-florida",
    name: "HCA Florida",
    community: "Hospital Partners",
    description: "A prospective hospital partner panel represented with sample content only.",
    ...empty,
  },
  {
    slug: "sonographers-outside-florida",
    name: "Sonographers Outside Florida",
    community: "Clinical Communities",
    description: "A distributed community for sonographer perspectives beyond Florida.",
    ...empty,
  },
  {
    slug: "shared-design-prototypes",
    name: "Shared Design / Prototypes",
    community: "Product Development",
    description: "Concept files and prototype review materials represented as static fixtures.",
    resources: [
      { title: "Enclosure assembly v3", kind: "CAD", status: "Static placeholder" },
      { title: "Ergonomic grip prototype", kind: "Prototype", status: "Review sample" },
    ],
    milestones: [
      { title: "CAD concept freeze", date: "Sep 2026", status: "In review", linkedAsset: "Enclosure assembly v3" },
      { title: "Prototype evaluation", date: "Nov 2026", status: "Planned", linkedAsset: "Ergonomic grip prototype" },
    ],
  },
  {
    slug: "engineering-collaborative",
    name: "Engineering Collaborative",
    community: "Product Development",
    description: "Mechanical, electrical, and industrial design collaboration preview.",
    resources: [{ title: "Design review packet", kind: "Document", status: "Preview copy" }],
    milestones: [{ title: "Cross-discipline design review", date: "Sep 2026", status: "Planned" }],
  },
  {
    slug: "university-faculty-partners",
    name: "University Faculty Partners",
    community: "External Partners",
    description: "Prospective faculty collaboration, research, and educational resources.",
    ...empty,
  },
  {
    slug: "prospective-partners",
    name: "Prospective Partners",
    community: "External Partners",
    description: "A sample introduction area for prospective collaborators; no materials are distributed here.",
    resources: [
      { title: "Product introduction video", kind: "Video", status: "Placeholder" },
      { title: "Collaboration overview", kind: "Sell sheet", status: "Preview copy" },
    ],
    milestones: [],
  },
  {
    slug: "clinical-advisors",
    name: "Clinical Advisors",
    community: "Clinical Communities",
    description: "Clinical guidance and device-development feedback represented with sample records.",
    ...empty,
  },
  {
    slug: "ideas-board",
    name: "Ideas Board",
    community: "Shared Collaboration",
    description: "A design preview of future idea capture and discussion workflows.",
    ...empty,
  },
  {
    slug: "ip-legal",
    name: "IP / Legal",
    community: "Governance",
    description: "Intended production area for permission-controlled legal materials; none are present here.",
    ...empty,
  },
  ...[1, 2, 3, 4].map((number): Panel => ({
    slug: `future-panel-${number}`,
    name: `Future Panel ${number}`,
    community: "Reserved",
    description: "Reserved for future growth. No purpose or access model has been assigned.",
    reserved: true,
    resources: [],
    milestones: [],
  })),
];

export const personas: Persona[] = [
  { id: "admin-1", name: "Shaw Preview Admin", email: "admin@shawinnovations.com", title: "Program administrator", organization: "Shaw Innovations", panels: panels.map(({ slug }) => slug) },
  { id: "advisor-1", name: "Jordan Ellis", email: "jordan@example.test", title: "Lead sonographer", organization: "Sample Health System", certification: "RDMS", headshot: "/imagery/sonography.jpg", panels: ["sonographer-advisors", "clinical-advisors", "ideas-board"] },
  { id: "engineer-1", name: "Morgan Chen", email: "morgan@example.test", title: "Mechanical engineer", organization: "Shaw Innovations", panels: ["shared-design-prototypes", "engineering-collaborative"] },
  { id: "faculty-1", name: "Dr. Avery Patel", email: "avery@example.test", title: "Faculty research partner", organization: "Sample University", certification: "PhD", panels: ["university-faculty-partners"] },
];

export const meetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Weekly design review",
    panel: "engineering-collaborative",
    date: "2026-09-12T15:00:00.000Z",
    duration: 60,
    attendees: ["Shaw Preview Admin", "Morgan Chen"],
    minutes: "Sample minutes: review enclosure constraints and the next prototype checkpoint.",
    aiSummary: "AI summary placeholder — no transcription or AI service runs in this preview.",
  },
  {
    id: "meeting-2",
    title: "Clinical workflow roundtable",
    panel: "sonographer-advisors",
    date: "2026-09-18T18:00:00.000Z",
    duration: 45,
    attendees: ["Jordan Ellis", "Shaw Preview Admin"],
    minutes: "Sample minutes will appear here after a future production meeting workflow.",
    aiSummary: "AI summary placeholder — this static build does not process meeting data.",
  },
];

export const calendarEvents = meetings.map((meeting) => ({
  id: meeting.id,
  title: meeting.title,
  date: meeting.date,
  kind: "Meeting" as const,
}));

export const getPanel = (slug?: string) => panels.find((panel) => panel.slug === slug);
export const getPersona = (id?: string) => personas.find((persona) => persona.id === id);
