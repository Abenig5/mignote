import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/admin-auth";
import { getAdminContentSummary } from "@/services/content-service";

export async function GET() {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const summary = await getAdminContentSummary();

    return NextResponse.json({ summary });
  } catch {
    return NextResponse.json(
      { error: "Unable to load content summary" },
      { status: 500 }
    );
  }
}
