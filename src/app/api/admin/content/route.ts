import { NextResponse } from "next/server";
import { getAdminContentSummary } from "@/services/content-service";

export async function GET() {
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
