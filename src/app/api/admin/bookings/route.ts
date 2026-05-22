import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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
