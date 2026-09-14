export type Persona = {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  role: "admin" | "advisor" | "engineer" | "faculty";
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
  { id: "admin-1", name: "Shaw Preview Admin", email: "admin@shawinnovations.com", title: "Program administrator", organization: "Shaw Innovations", role: "admin", panels: panels.map(({ slug }) => slug) },
  { id: "advisor-1", name: "Jordan Ellis", email: "jordan@example.test", title: "Lead sonographer", organization: "Sample Health System", role: "advisor", certification: "RDMS", headshot: "/imagery/sonography.jpg", panels: ["sonographer-advisors", "clinical-advisors", "ideas-board"] },
  { id: "advisor-2", name: "Maya Brooks", email: "maya@example.test", title: "Clinical advisor", organization: "Orlando Regional Health", role: "advisor", certification: "RDCS", panels: ["sonographer-advisors", "clinical-advisors"] },
  { id: "engineer-1", name: "Morgan Chen", email: "morgan@example.test", title: "Mechanical engineer", organization: "Shaw Innovations", role: "engineer", panels: ["shared-design-prototypes", "engineering-collaborative"] },
  { id: "engineer-2", name: "Alex Rivera", email: "alex@example.test", title: "Electrical engineer", organization: "Shaw Innovations", role: "engineer", panels: ["shared-design-prototypes", "engineering-collaborative"] },
  { id: "faculty-1", name: "Dr. Avery Patel", email: "avery@example.test", title: "Faculty research partner", organization: "Sample University", role: "faculty", certification: "PhD", panels: ["university-faculty-partners"] },
];

export type Community = {
  id: "advisors" | "engineers";
  name: string;
  description: string;
  roles: Persona["role"][];
  channelIds: string[];
};

export type Channel = {
  id: string;
  name: string;
  description: string;
};

export type ProjectTeam = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  channelIds: string[];
  archived?: boolean;
};

export type Message = {
  id: string;
  channelId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export const communities: Community[] = [
  {
    id: "advisors",
    name: "Advisor Community",
    description: "A permanent space for clinical and sonography guidance.",
    roles: ["advisor", "faculty"],
    channelIds: ["advisor-general", "clinical-feedback", "workflow-insights"],
  },
  {
    id: "engineers",
    name: "Engineering Community",
    description: "A permanent space for product, mechanical, electrical, and industrial design.",
    roles: ["engineer"],
    channelIds: ["engineering-general", "design-review", "prototype-lab"],
  },
];

export const channels: Channel[] = [
  { id: "advisor-general", name: "general", description: "Introductions, updates, and advisor-wide discussion." },
  { id: "clinical-feedback", name: "clinical-feedback", description: "Clinical feedback on the sonography device experience." },
  { id: "workflow-insights", name: "workflow-insights", description: "Observations from real sonography workflows." },
  { id: "engineering-general", name: "general", description: "Engineering announcements and cross-discipline coordination." },
  { id: "design-review", name: "design-review", description: "Review mechanical, electrical, and industrial design decisions." },
  { id: "prototype-lab", name: "prototype-lab", description: "Prototype updates, questions, and evaluation notes." },
  { id: "portable-sonography-general", name: "general", description: "Shared conversation for the portable sonography initiative." },
  { id: "portable-sonography-clinical", name: "clinical-review", description: "Advisor feedback and clinical validation." },
  { id: "portable-sonography-build", name: "build-room", description: "Engineering implementation and prototype handoff." },
];

export const seededTeams: ProjectTeam[] = [
  {
    id: "portable-sonography",
    name: "Portable Sonography",
    description: "Cross-functional collaboration on an ergonomic portable sonography product.",
    ownerId: "admin-1",
    memberIds: ["admin-1", "advisor-1", "advisor-2", "engineer-1", "engineer-2"],
    channelIds: ["portable-sonography-general", "portable-sonography-clinical", "portable-sonography-build"],
  },
];

export const seededMessages: Message[] = [
  { id: "message-1", channelId: "advisor-general", authorId: "advisor-1", body: "Welcome to the advisor community. Share clinical observations and questions here.", createdAt: "2026-09-14T13:05:00.000Z" },
  { id: "message-2", channelId: "clinical-feedback", authorId: "advisor-2", body: "The probe grip should remain comfortable during longer scanning sessions.", createdAt: "2026-09-14T13:22:00.000Z" },
  { id: "message-3", channelId: "engineering-general", authorId: "engineer-1", body: "The latest enclosure concept is ready for a cross-discipline review.", createdAt: "2026-09-14T14:10:00.000Z" },
  { id: "message-4", channelId: "portable-sonography-general", authorId: "admin-1", body: "This team brings clinical advisors and engineers together around one product goal.", createdAt: "2026-09-14T14:30:00.000Z" },
  { id: "message-5", channelId: "portable-sonography-general", authorId: "advisor-1", body: "I added workflow notes from today’s sonography session for the engineering team.", createdAt: "2026-09-14T14:42:00.000Z" },
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
export const getChannel = (id?: string) => channels.find((channel) => channel.id === id);
