import { NextResponse } from "next/server";
import { menuItems as fallbackMenuItems } from "@/config/menu";
import { requireAdminApiAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const allowedCategories = new Set(["Ethiopian Dishes", "Eritrean Dishes", "European Cuisines"]);

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

export async function GET() {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const [items, categories] = await Promise.all([
      prisma.menuItem.findMany({
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }),
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { title: "asc" }]
      })
    ]);

    return NextResponse.json({ items, categories });
  } catch {
    const categoryTitles = Array.from(new Set(fallbackMenuItems.map((item) => item.category)));
    const categories = categoryTitles.map((title, index) => ({
      id: `fallback-category-${index}`,
      title,
      slug: slugify(title)
    }));
    const items = fallbackMenuItems.map((item, index) => ({
      id: `fallback-menu-${index}`,
      title: item.name,
      description: item.description,
      image: item.image,
      price: null,
      available: true,
      featured: index < 3,
      category: categories.find((category) => category.title === item.category) ?? categories[0]
    }));

    return NextResponse.json({
      items,
      categories,
      databaseConnected: false,
      error: "PostgreSQL is not connected. Configure DATABASE_URL and run prisma:migrate plus prisma:seed to enable editing."
    });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminApiAuth();

  if (unauthorized) {
    return unauthorized;
  }

  const body = await request.json();
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const image = String(body.image ?? "").trim();
  const categoryTitle = String(body.category ?? "").trim();

  if (!title || !description || !image || !categoryTitle) {
    return NextResponse.json({ error: "Missing required menu fields" }, { status: 400 });
  }

  if (!allowedCategories.has(categoryTitle)) {
    return NextResponse.json(
      { error: "Menu items must be added to Ethiopian Dishes, Eritrean Dishes, or European Cuisines." },
      { status: 400 }
    );
  }

  try {
    const category = await getOrCreateCategory(categoryTitle);
    const sortOrder = await prisma.menuItem.count();
    const item = await prisma.menuItem.create({
      data: {
        title,
        description,
        image,
        categoryId: category.id,
        price: body.price === "" || body.price == null ? null : Number(body.price),
        available: Boolean(body.available ?? true),
        featured: Boolean(body.featured ?? false),
        sortOrder
      },
      include: { category: true }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to create menu item" }, { status: 500 });
  }
}
