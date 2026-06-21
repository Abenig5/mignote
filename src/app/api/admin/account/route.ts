import { NextResponse } from "next/server";
import {
  ensureAdminAccount,
  requireAdminApiAuth,
  setAdminSessionCookie,
  updateAdminAccount
} from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  const account = await ensureAdminAccount();

  return NextResponse.json({ username: account.username });
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const username = String(body.username ?? "").trim();
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const result = await updateAdminAccount({
    currentPassword,
    newPassword: newPassword || undefined,
    username
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await setAdminSessionCookie();

  return NextResponse.json({ username: result.username });
}
