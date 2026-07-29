/**
 * Resets the admin account to the current ADMIN_USERNAME / ADMIN_PASSWORD values.
 *
 * `ensureAdminAccount()` in src/lib/admin-auth.ts only seeds the AdminAccount row the first
 * time it runs. After that the row is the source of truth and the environment variables are
 * ignored, so changing them has no effect on login. Run this script to force the stored
 * credentials to match the environment again.
 *
 * Usage:
 *   npm run admin:reset
 *
 * Reads DIRECT_URL when present so it works against Supabase's session-mode pooler.
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const username = process.env.ADMIN_USERNAME?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error("ADMIN_USERNAME and ADMIN_PASSWORD must be set before running this script.");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const prisma = new PrismaClient(url ? { datasources: { db: { url } } } : undefined);

const salt = randomBytes(16).toString("hex");
const passwordHash = scryptSync(password, salt, 64).toString("hex");

try {
  await prisma.adminAccount.upsert({
    where: { id: "primary" },
    update: { username, passwordHash, salt },
    create: { id: "primary", username, passwordHash, salt }
  });

  console.log(`Admin account reset. Username is now "${username}".`);
  console.log("Existing admin sessions remain valid until they expire; log out to force a new login.");
} catch (error) {
  console.error("Admin reset failed:", error instanceof Error ? error.message : error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
