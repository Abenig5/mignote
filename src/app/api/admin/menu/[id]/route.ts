import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function getOrCreateCategory(title: string) {
  const normalizedTitle = title.trim();
  const slug = slugify(normalizedTitle);

  return prisma.category.upsert({
    where: { slug },
    update: { title: normalizedTitle },
    create: { title: normalizedTitle, slug }
  });
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const image = String(body.image ?? "").trim();
  const categoryTitle = String(body.category ?? "").trim();

  if (!title || !description || !image || !categoryTitle) {
    return NextResponse.json({ error: "Missing required menu fields" }, { status: 400 });
  }

  try {
    const category = await getOrCreateCategory(categoryTitle);
    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        title,
        description,
        image,
        categoryId: category.id,
        price: body.price === "" || body.price == null ? null : Number(body.price),
        available: Boolean(body.available),
        featured: Boolean(body.featured)
      },
      include: { category: true }
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "Unable to update menu item" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await prisma.menuItem.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete menu item" }, { status: 500 });
  }
}
