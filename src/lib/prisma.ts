import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function datasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("serverSelectionTimeoutMS")) {
    return url;
  }
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}serverSelectionTimeoutMS=2000&connectTimeoutMS=2000&socketTimeoutMS=2000`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: datasourceUrl() ? { db: { url: datasourceUrl() } } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
