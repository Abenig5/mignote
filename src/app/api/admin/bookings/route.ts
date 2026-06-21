import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApiAuth } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json(
      { error: "Unable to load bookings" },
      { status: 500 }
    );
  }
}
