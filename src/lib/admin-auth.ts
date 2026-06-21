import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const sessionCookieName = "mignote_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || "mignote-dev-session-secret";
}

function getInitialUsername() {
  return process.env.ADMIN_USERNAME || "adminAb";
}

function getInitialPassword() {
  return process.env.ADMIN_PASSWORD || "Admin@123";
}

function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const passwordHash = scryptSync(password, salt, 64).toString("hex");

  return { passwordHash, salt };
}

function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actualHash = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");

  return expected.length === actualHash.length && timingSafeEqual(actualHash, expected);
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function encodeSession(payload: SessionPayload) {
  const value = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

  return `${value}.${sign(value)}`;
}

function decodeSession(session: string | undefined) {
  if (!session) {
    return null;
  }

  const [value, signature] = session.split(".");

  if (!value || !signature || sign(value) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as SessionPayload;

    if (!payload.username || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function ensureAdminAccount() {
  const existing = await prisma.adminAccount.findUnique({ where: { id: "primary" } });

  if (existing) {
    return existing;
  }

  const { passwordHash, salt } = hashPassword(getInitialPassword());

  return prisma.adminAccount.create({
    data: {
      id: "primary",
      username: getInitialUsername(),
      passwordHash,
      salt
    }
  });
}

export async function verifyAdminCredentials(username: string, password: string) {
  const account = await ensureAdminAccount();

  if (username !== account.username) {
    return false;
  }

  return verifyPassword(password, account.salt, account.passwordHash);
}

export async function getAdminSession() {
  const cookieStore = await cookies();

  return decodeSession(cookieStore.get(sessionCookieName)?.value);
}

export async function isAdminAuthenticated() {
  return Boolean(await getAdminSession());
}

export async function requireAdminApiAuth() {
  if (await isAdminAuthenticated()) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function setAdminSessionCookie() {
  const cookieStore = await cookies();
  const account = await ensureAdminAccount();
  const session = encodeSession({
    username: account.username,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000
  });

  cookieStore.set(sessionCookieName, session, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function updateAdminAccount({
  currentPassword,
  newPassword,
  username
}: {
  currentPassword: string;
  newPassword?: string;
  username: string;
}) {
  const account = await ensureAdminAccount();

  if (!verifyPassword(currentPassword, account.salt, account.passwordHash)) {
    return { ok: false, error: "Current password is incorrect." };
  }

  const nextUsername = username.trim();

  if (nextUsername.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }

  const data =
    newPassword && newPassword.length > 0
      ? {
          username: nextUsername,
          ...hashPassword(newPassword)
        }
      : { username: nextUsername };

  if (newPassword && newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  const updated = await prisma.adminAccount.update({
    where: { id: "primary" },
    data
  });

  return { ok: true, username: updated.username };
}
