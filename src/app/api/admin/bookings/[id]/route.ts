import { NextResponse } from "next/server";
import { requireAdminApiAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const allowedStatuses = new Set(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status ?? "");

  if (!allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Invalid booking status" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json(
      { error: "Unable to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;

  try {
    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete booking" },
      { status: 500 }
    );
  }
}
