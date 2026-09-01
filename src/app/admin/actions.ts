"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/permissions";
import { requireAdmin } from "@/lib/session";
import { createZoomMeeting } from "@/lib/zoom";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organization: z.string().optional(),
  title: z.string().optional(),
  certification: z.string().optional(),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export async function createUserAction(formData: FormData) {
  const session = await requireAdmin();
  const parsed = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organization: formData.get("organization") || undefined,
    title: formData.get("title") || undefined,
    certification: formData.get("certification") || undefined,
    role: formData.get("role") || "MEMBER",
  });

  if (!parsed.success) {
    return { error: "Invalid user details." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hash(parsed.data.password, 12),
      organization: parsed.data.organization,
      title: parsed.data.title,
      certification: parsed.data.certification,
      role: parsed.data.role as Role,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "CREATE_USER",
    targetType: "user",
    targetId: user.id,
    details: `Created user ${user.email}`,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function setUserActiveAction(userId: string, isActive: boolean) {
  const session = await requireAdmin();

  if (userId === session.user.id && !isActive) {
    return { error: "You cannot deactivate your own admin account." };
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  if (!isActive) {
    await prisma.userPermission.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false, revokedAt: new Date() },
    });
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: isActive ? "ACTIVATE_USER" : "REVOKE_USER_ACCESS",
    targetType: "user",
    targetId: user.id,
    details: isActive
      ? `Reactivated ${user.email}`
      : `Revoked platform access for ${user.email}`,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function grantPermissionAction(userId: string, sectionId: string) {
  const session = await requireAdmin();

  const permission = await prisma.userPermission.upsert({
    where: {
      userId_sectionId: { userId, sectionId },
    },
    update: {
      isActive: true,
      revokedAt: null,
      grantedAt: new Date(),
      grantedBy: session.user.id,
    },
    create: {
      userId,
      sectionId,
      grantedBy: session.user.id,
      isActive: true,
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "GRANT_SECTION_ACCESS",
    targetType: "permission",
    targetId: permission.id,
    details: `Granted section ${sectionId} to user ${userId}`,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function revokePermissionAction(userId: string, sectionId: string) {
  const session = await requireAdmin();

  const permission = await prisma.userPermission.update({
    where: {
      userId_sectionId: { userId, sectionId },
    },
    data: {
      isActive: false,
      revokedAt: new Date(),
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "REVOKE_SECTION_ACCESS",
    targetType: "permission",
    targetId: permission.id,
    details: `Revoked section ${sectionId} from user ${userId}`,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

const meetingSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  sectionId: z.string().optional(),
  scheduledAt: z.string().min(1),
  durationMin: z.coerce.number().min(15).max(480),
  userIds: z.array(z.string()).default([]),
});

export async function createMeetingAction(formData: FormData) {
  const session = await requireAdmin();
  const userIds = formData.getAll("userIds").map(String);

  const parsed = meetingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    sectionId: formData.get("sectionId") || undefined,
    scheduledAt: formData.get("scheduledAt"),
    durationMin: formData.get("durationMin") || 60,
    userIds,
  });

  if (!parsed.success) {
    return { error: "Invalid meeting details." };
  }

  const start = new Date(parsed.data.scheduledAt);
  const zoom = await createZoomMeeting({
    topic: parsed.data.title,
    startTime: start,
    durationMin: parsed.data.durationMin,
    agenda: parsed.data.description,
  });

  const meeting = await prisma.meeting.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      sectionId: parsed.data.sectionId || null,
      scheduledAt: start,
      durationMin: parsed.data.durationMin,
      zoomJoinUrl: zoom.joinUrl,
      zoomMeetingId: zoom.meetingId,
      zoomPasscode: zoom.passcode,
      createdById: session.user.id,
      access: {
        create: parsed.data.userIds.map((userId) => ({ userId })),
      },
    },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "CREATE_MEETING",
    targetType: "meeting",
    targetId: meeting.id,
    details: `Created meeting (${zoom.mode}) ${meeting.title}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/meetings");
  revalidatePath("/dashboard");
  return { success: true, mode: zoom.mode };
}
