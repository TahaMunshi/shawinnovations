export type StagingRole = "ADMIN" | "MEMBER";

export type StagingUser = {
  id: string;
  name: string;
  email: string;
  role: StagingRole;
  isActive: boolean;
  organization?: string;
  title?: string;
  certification?: string;
  sections: string[];
};

export type StagingMeeting = {
  id: string;
  title: string;
  scheduledAt: string;
  durationMin: number;
  panel: string;
  invitees: string[];
};

export const STAGING_USERS: StagingUser[] = [
  {
    id: "admin-1",
    name: "Shaw Admin",
    email: "admin@shawinnovations.com",
    role: "ADMIN",
    isActive: true,
    organization: "Shaw Innovations",
    title: "Administrator",
    sections: [],
  },
  {
    id: "advisor-1",
    name: "Sonographer Advisor",
    email: "advisor@shawinnovations.com",
    role: "MEMBER",
    isActive: true,
    organization: "AdventHealth",
    title: "Lead Sonographer",
    certification: "RDMS",
    sections: ["Sonography Advisors", "Clinical Advisors", "Ideas Board"],
  },
  {
    id: "engineer-1",
    name: "Device Engineer",
    email: "engineer@shawinnovations.com",
    role: "MEMBER",
    isActive: true,
    organization: "Shaw Innovations",
    title: "Mechanical Engineer",
    sections: ["Shared Design / Prototypes", "Engineering Collaborative"],
  },
];

export const STAGING_MEETINGS: StagingMeeting[] = [
  {
    id: "meeting-1",
    title: "Weekly Design Review",
    scheduledAt: "2026-09-12T15:00:00.000Z",
    durationMin: 60,
    panel: "Engineering Collaborative",
    invitees: ["Shaw Admin", "Device Engineer"],
  },
];

export function getStagingUser(id: string) {
  return STAGING_USERS.find((user) => user.id === id) ?? null;
}
