import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getUserAccessibleSections(userId: string, role: Role) {
  if (role === Role.ADMIN) {
    return prisma.section.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  const permissions = await prisma.userPermission.findMany({
    where: {
      userId,
      isActive: true,
      revokedAt: null,
      user: { isActive: true },
    },
    include: { section: true },
    orderBy: { section: { sortOrder: "asc" } },
  });

  return permissions.map((permission) => permission.section);
}

export async function userCanAccessSection(
  userId: string,
  role: Role,
  sectionSlug: string,
) {
  if (role === Role.ADMIN) {
    return true;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) {
    return false;
  }

  const permission = await prisma.userPermission.findFirst({
    where: {
      userId,
      isActive: true,
      revokedAt: null,
      section: { slug: sectionSlug },
    },
  });

  return Boolean(permission);
}

export async function writeAuditLog(input: {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: string;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      details: input.details,
    },
  });
}
