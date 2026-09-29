export type Persona = {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  role: "admin" | "advisor" | "engineer" | "faculty" | "legal";
  certification?: string;
  headshot?: string;
  panels: string[];
  groupIds: string[];
  status: "active" | "suspended";
  nda: {
    method: "esign" | "in-person";
    signedAt: string;
    signature?: string;
    signerName?: string;
  } | null;
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

const seededNda = (name: string): Persona["nda"] => ({
  method: "esign",
  signedAt: "2026-09-01T12:00:00.000Z",
  signerName: name,
  signature: name,
});

export const personas: Persona[] = [
  {
    id: "admin-1",
    name: "Shaw Preview Admin",
    email: "admin@shawinnovations.com",
    title: "Program administrator",
    organization: "Shaw Solutions",
    role: "admin",
    panels: panels.map(({ slug }) => slug),
    groupIds: ["sonography-advisors", "clinical-advisors", "engineering", "design-prototypes", "university-partners", "ip-legal"],
    status: "active",
    nda: null,
  },
  {
    id: "advisor-1",
    name: "Jordan Ellis",
    email: "jordan@example.test",
    title: "Lead sonographer",
    organization: "Sample Health System",
    role: "advisor",
    certification: "RDMS",
    headshot: "/imagery/sonography.jpg",
    panels: ["sonographer-advisors", "clinical-advisors", "ideas-board"],
    groupIds: ["sonography-advisors"],
    status: "active",
    nda: seededNda("Jordan Ellis"),
  },
  {
    id: "advisor-2",
    name: "Maya Brooks",
    email: "maya@example.test",
    title: "Clinical advisor",
    organization: "Orlando Regional Health",
    role: "advisor",
    certification: "RDCS",
    panels: ["sonographer-advisors", "clinical-advisors"],
    groupIds: ["clinical-advisors"],
    status: "active",
    nda: seededNda("Maya Brooks"),
  },
  {
    id: "engineer-1",
    name: "Morgan Chen",
    email: "morgan@example.test",
    title: "Mechanical engineer",
    organization: "Shaw Solutions",
    role: "engineer",
    panels: ["shared-design-prototypes", "engineering-collaborative"],
    groupIds: ["engineering"],
    status: "active",
    nda: seededNda("Morgan Chen"),
  },
  {
    id: "engineer-2",
    name: "Alex Rivera",
    email: "alex@example.test",
    title: "Electrical engineer",
    organization: "Shaw Solutions",
    role: "engineer",
    panels: ["shared-design-prototypes", "engineering-collaborative"],
    groupIds: ["design-prototypes"],
    status: "active",
    nda: seededNda("Alex Rivera"),
  },
  {
    id: "faculty-1",
    name: "Dr. Avery Patel",
    email: "avery@example.test",
    title: "Faculty research partner",
    organization: "Sample University",
    role: "faculty",
    certification: "PhD",
    panels: ["university-faculty-partners"],
    groupIds: ["university-partners"],
    status: "active",
    nda: seededNda("Dr. Avery Patel"),
  },
  {
    id: "legal-1",
    name: "Elena Park",
    email: "elena@example.test",
    title: "IP counsel",
    organization: "Shaw Solutions",
    role: "legal",
    panels: ["ip-legal"],
    groupIds: ["ip-legal"],
    status: "active",
    nda: seededNda("Elena Park"),
  },
];

export type CollaborationGroup = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  channelId: string;
};

/** Six user-type community tabs on the platform. */
export const fixedGroups: CollaborationGroup[] = [
  { id: "sonography-advisors", name: "Sonography Advisors", shortName: "SA", description: "Sonography workflow insight, scanning experience, and device feedback.", channelId: "group-sonography-advisors" },
  { id: "clinical-advisors", name: "Clinical Advisors", shortName: "CA", description: "Clinical validation, patient-care considerations, and product guidance.", channelId: "group-clinical-advisors" },
  { id: "engineering", name: "Engineering", shortName: "EN", description: "Mechanical, electrical, and industrial engineering collaboration.", channelId: "group-engineering" },
  { id: "design-prototypes", name: "Design & Prototypes", shortName: "DP", description: "Design reviews, CAD handoffs, prototype notes, and testing feedback.", channelId: "group-design-prototypes" },
  { id: "university-partners", name: "University Partners", shortName: "UP", description: "Research collaboration with faculty and university partners.", channelId: "group-university-partners" },
  { id: "ip-legal", name: "IP & Legal", shortName: "IP", description: "Permission-controlled intellectual-property and legal coordination.", channelId: "group-ip-legal" },
];

export type OnboardingRequest = {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  role: Persona["role"];
  note: string;
  preferredTabId: string;
  ndaSignature: string;
  ndaSignerName: string;
  ndaSignedAt: string;
  status: "pending" | "approved";
  createdAt: string;
};

export type GroupCall = {
  groupId: string;
  startedBy: string;
  startedAt: string;
  participantIds: string[];
};

export type Message = {
  id: string;
  channelId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export const seededGroupMessages: Message[] = [
  { id: "group-message-1", channelId: "group-sonography-advisors", authorId: "admin-1", body: "Welcome to the Sonography Advisors community. This room is visible only to assigned members.", createdAt: "2026-09-15T13:00:00.000Z" },
  { id: "group-message-2", channelId: "group-sonography-advisors", authorId: "advisor-1", body: "I’ll share workflow observations from this week’s scanning sessions here.", createdAt: "2026-09-15T13:08:00.000Z" },
  { id: "group-message-3", channelId: "group-clinical-advisors", authorId: "advisor-2", body: "I’m reviewing the clinical validation questions for the next product checkpoint.", createdAt: "2026-09-15T13:20:00.000Z" },
  { id: "group-message-4", channelId: "group-engineering", authorId: "engineer-1", body: "The enclosure and thermal constraints are ready for engineering review.", createdAt: "2026-09-15T13:35:00.000Z" },
  { id: "group-message-5", channelId: "group-design-prototypes", authorId: "engineer-2", body: "Prototype notes and CAD review decisions will stay in this community.", createdAt: "2026-09-15T13:50:00.000Z" },
  { id: "group-message-6", channelId: "group-university-partners", authorId: "faculty-1", body: "The university research team is ready to review the study outline.", createdAt: "2026-09-15T14:05:00.000Z" },
  { id: "group-message-7", channelId: "group-ip-legal", authorId: "legal-1", body: "Please keep invention and disclosure discussions inside this assigned community.", createdAt: "2026-09-15T14:20:00.000Z" },
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
