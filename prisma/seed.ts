import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const sections = [
  {
    slug: "sonographer-advisors",
    name: "Sonography Advisors",
    description:
      "Secure hub for sonographer advisors with centralized resources and certification tracking.",
    category: "Clinical",
    icon: "stethoscope",
    sortOrder: 1,
  },
  {
    slug: "advent-health-orlando",
    name: "Advent Health Orlando",
    description: "Protected community for Advent Health Orlando collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
    sortOrder: 2,
  },
  {
    slug: "orlando-regional-health",
    name: "Orlando Regional Health",
    description: "Protected community for Orlando Regional Health collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
    sortOrder: 3,
  },
  {
    slug: "hca-florida",
    name: "HCA Florida",
    description: "Protected community for HCA Florida collaborators.",
    category: "Hospital Partners",
    icon: "hospital",
    sortOrder: 4,
  },
  {
    slug: "sonographers-outside-florida",
    name: "Sonographers Outside Florida",
    description: "Community for sonographer advisors practicing outside Florida.",
    category: "Clinical",
    icon: "users",
    sortOrder: 5,
  },
  {
    slug: "shared-design-prototypes",
    name: "Shared Design / Prototypes",
    description: "Shared design files, prototypes, and collaborative review materials.",
    category: "Engineering",
    icon: "layers",
    sortOrder: 6,
  },
  {
    slug: "engineering-collaborative",
    name: "Engineering Collaborative",
    description:
      "Mechanical, electrical, and industrial design teams with CAD and prototype access.",
    category: "Engineering",
    icon: "cog",
    sortOrder: 7,
  },
  {
    slug: "university-faculty-partners",
    name: "University Faculty Partners",
    description: "Collaboration space for university faculty partners.",
    category: "Partners",
    icon: "graduation-cap",
    sortOrder: 8,
  },
  {
    slug: "prospective-partners",
    name: "Prospective Partners",
    description:
      "Admin-directed access to unpublished materials such as Google video and sell sheets.",
    category: "Partners",
    icon: "briefcase",
    sortOrder: 9,
  },
  {
    slug: "clinical-advisors",
    name: "Clinical Advisors",
    description: "Dedicated space for clinical advisors contributing to device development.",
    category: "Clinical",
    icon: "heart-pulse",
    sortOrder: 10,
  },
  {
    slug: "ideas-board",
    name: "Ideas Board",
    description: "Capture and discuss innovation ideas across the Shaw ecosystem.",
    category: "Collaboration",
    icon: "lightbulb",
    sortOrder: 11,
  },
  {
    slug: "ip-legal",
    name: "IP / Legal",
    description: "Protected access for intellectual property and legal materials.",
    category: "Legal",
    icon: "scale",
    sortOrder: 12,
  },
  {
    slug: "future-panel-1",
    name: "Future Panel 1",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
    sortOrder: 20,
  },
  {
    slug: "future-panel-2",
    name: "Future Panel 2",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
    sortOrder: 21,
  },
  {
    slug: "future-panel-3",
    name: "Future Panel 3",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
    sortOrder: 22,
  },
  {
    slug: "future-panel-4",
    name: "Future Panel 4",
    description: "Blank undesignated panel reserved for future growth.",
    category: "Reserved",
    icon: "panel",
    isBlank: true,
    sortOrder: 23,
  },
];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.meetingMinutes.deleteMany();
  await prisma.meetingAccess.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.section.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("ShawDemo2026!", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@shawinnovations.com",
      passwordHash,
      name: "Platform Administrator",
      role: Role.ADMIN,
      organization: "Shaw Innovations",
      title: "Administrator",
      isActive: true,
    },
  });

  const advisor = await prisma.user.create({
    data: {
      email: "advisor@shawinnovations.com",
      passwordHash,
      name: "Jordan Rivera",
      role: Role.MEMBER,
      organization: "Advent Health Orlando",
      title: "Sonographer Advisor",
      certification: "RDMS, RVT",
      isActive: true,
    },
  });

  const engineer = await prisma.user.create({
    data: {
      email: "engineer@shawinnovations.com",
      passwordHash,
      name: "Alex Chen",
      role: Role.MEMBER,
      organization: "Shaw Engineering",
      title: "Mechanical Engineer",
      isActive: true,
    },
  });

  const createdSections = [];
  for (const section of sections) {
    createdSections.push(
      await prisma.section.create({
        data: {
          slug: section.slug,
          name: section.name,
          description: section.description,
          category: section.category,
          icon: section.icon,
          isBlank: section.isBlank ?? false,
          sortOrder: section.sortOrder,
        },
      }),
    );
  }

  const bySlug = Object.fromEntries(createdSections.map((s) => [s.slug, s]));

  await prisma.userPermission.createMany({
    data: [
      {
        userId: advisor.id,
        sectionId: bySlug["sonographer-advisors"].id,
        grantedBy: admin.id,
      },
      {
        userId: advisor.id,
        sectionId: bySlug["advent-health-orlando"].id,
        grantedBy: admin.id,
      },
      {
        userId: advisor.id,
        sectionId: bySlug["ideas-board"].id,
        grantedBy: admin.id,
      },
      {
        userId: engineer.id,
        sectionId: bySlug["engineering-collaborative"].id,
        grantedBy: admin.id,
      },
      {
        userId: engineer.id,
        sectionId: bySlug["shared-design-prototypes"].id,
        grantedBy: admin.id,
      },
      {
        userId: engineer.id,
        sectionId: bySlug["ip-legal"].id,
        grantedBy: admin.id,
      },
    ],
  });

  await prisma.resource.createMany({
    data: [
      {
        sectionId: bySlug["sonographer-advisors"].id,
        title: "Advisor Onboarding Guide",
        description: "Orientation materials for new sonographer advisors.",
        type: "document",
        url: "#",
      },
      {
        sectionId: bySlug["engineering-collaborative"].id,
        title: "CAD Workspace Index",
        description: "Index of mechanical and electrical CAD packages.",
        type: "cad",
        url: "#",
      },
      {
        sectionId: bySlug["shared-design-prototypes"].id,
        title: "Prototype Review Pack v0.3",
        description: "Latest shared prototype files for cross-team review.",
        type: "prototype",
        url: "#",
      },
    ],
  });

  await prisma.milestone.createMany({
    data: [
      {
        sectionId: bySlug["engineering-collaborative"].id,
        title: "Transducer housing CAD freeze",
        description: "Lock mechanical housing before first tooling run.",
        status: "in_progress",
        dueDate: new Date("2026-10-15"),
        cadRef: "CAD-HOUSING-REV-B",
        prototypeRef: "PROTO-HOUSING-02",
      },
      {
        sectionId: bySlug["sonographer-advisors"].id,
        title: "Advisor feedback cycle 1",
        description: "Collect usability notes from Florida sonographer advisors.",
        status: "planned",
        dueDate: new Date("2026-09-30"),
      },
    ],
  });

  const meeting = await prisma.meeting.create({
    data: {
      title: "Sonographer Advisors Monthly Sync",
      description: "Collective review of usability feedback and next milestones.",
      sectionId: bySlug["sonographer-advisors"].id,
      scheduledAt: new Date("2026-09-12T16:00:00.000Z"),
      durationMin: 60,
      zoomJoinUrl: "https://zoom.us/j/demo-shaw-sonographers",
      zoomMeetingId: "DEMO-1001",
      zoomPasscode: "shaw-adv",
      createdById: admin.id,
      access: {
        create: [{ userId: advisor.id }, { userId: admin.id }],
      },
      minutes: {
        create: {
          content:
            "Discussed certification uploads, Advent Health feedback themes, and upcoming prototype review.",
          summary: "Advisors aligned on certification tracking and next feedback cycle.",
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "SEED_PLATFORM",
      targetType: "system",
      targetId: meeting.id,
      details: "Initial Shaw Innovations platform seed completed.",
    },
  });

  console.log("Seed complete.");
  console.log("Admin: admin@shawinnovations.com / ShawDemo2026!");
  console.log("Advisor: advisor@shawinnovations.com / ShawDemo2026!");
  console.log("Engineer: engineer@shawinnovations.com / ShawDemo2026!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
