import { NextResponse } from "next/server";
import { setAdminSessionCookie, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  if (!(await verifyAdminCredentials(username, password))) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await setAdminSessionCookie();

  return NextResponse.json({ ok: true });
}
