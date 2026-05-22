/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const siteContent = {
  id: "site",
  name: "Mignote Catering",
  email: "events@mignote.example",
  tagline: "Seasonal catering for weddings, private dinners, and corporate gatherings.",
  heroKicker: "Mignote",
  heroTitle: "Thoughtful Catering For Every Table",
  heroDescription:
    "Elegant menus, calm service, and memorable hospitality for intimate dinners, polished receptions, and full wedding celebrations.",
  heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2400&q=95",
  storyKicker: "Our Approach",
  storyTitle: "Menus shaped around your guests, your schedule, and your setting.",
  storyParagraphs: [
    "Mignote Catering plans each event around the way people will gather: seated dinners, buffet service, cocktail receptions, and family-style celebrations all need a different rhythm.",
    "Our team pairs practical event planning with warm food service, building menus that feel generous, balanced, and easy for guests to enjoy."
  ],
  storyImage: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1800&q=95"
};

const menuItems = [
  ["Signature Buffet", "Buffet", "A balanced spread of mains, sides, salads, and desserts for weddings and hosted celebrations.", "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Wedding Dinner", "Plated", "Elegant plated courses with vegetarian and allergy-aware options for formal receptions.", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Corporate Bites", "Reception", "Small plates and passed appetizers designed for networking events and office gatherings.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Private Dinner", "Family Style", "Shared courses, seasonal sides, and dessert service for intimate hosted meals.", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Brunch Table", "Morning Events", "Fresh pastries, fruit boards, egg dishes, and coffee service for showers and morning meetings.", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Cocktail Reception", "Passed Bites", "Layered canapes, skewers, dips, and grazing boards paced for standing-room celebrations.", "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Dessert Finale", "Sweets", "Mini cakes, tarts, fruit desserts, and late-night treats arranged for easy guest flow.", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Vegan Feast", "Plant Forward", "Colorful vegetable mains, grains, dips, and seasonal salads built for generous shared service.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&h=2200&q=95"]
];

const galleryItems = [
  ["Wedding Reception", "Plated dinner service for a formal evening celebration.", "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=95"],
  ["Corporate Lunch", "Buffet service designed for fast guest flow and varied diets.", "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1800&q=95"],
  ["Private Dinner", "Family-style courses for an intimate hosted meal.", "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1800&q=95"]
];

const testimonials = [
  ["Hana Bekele", "Private dinner host", "The team made the dinner feel effortless from planning through service."],
  ["Michael Grant", "Corporate event lead", "Reliable timing, polished setup, and a menu that worked for every guest."]
];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.websiteContent.upsert({
    where: { id: "site" },
    update: siteContent,
    create: siteContent
  });

  const categoryTitles = [...new Set(menuItems.map((item) => item[1]))];

  for (const [index, title] of categoryTitles.entries()) {
    await prisma.category.upsert({
      where: { slug: slugify(title) },
      update: { title, sortOrder: index },
      create: { title, slug: slugify(title), sortOrder: index }
    });
  }

  for (const [index, [title, categoryTitle, description, image]] of menuItems.entries()) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: slugify(categoryTitle) }
    });

    const existing = await prisma.menuItem.findFirst({ where: { title } });

    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: { description, image, categoryId: category.id, featured: index < 3, sortOrder: index }
      });
    } else {
      await prisma.menuItem.create({
        data: { title, description, image, categoryId: category.id, featured: index < 3, sortOrder: index }
      });
    }
  }

  for (const [index, [title, description, image]] of galleryItems.entries()) {
    const existing = await prisma.galleryItem.findFirst({ where: { title } });

    if (existing) {
      await prisma.galleryItem.update({
        where: { id: existing.id },
        data: { description, image, featured: index < 3, sortOrder: index }
      });
    } else {
      await prisma.galleryItem.create({
        data: { title, description, image, featured: index < 3, sortOrder: index }
      });
    }
  }

  for (const [index, [name, role, quote]] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { name } });

    if (existing) {
      await prisma.testimonial.update({
        where: { id: existing.id },
        data: { role, quote, featured: index === 0, sortOrder: index }
      });
    } else {
      await prisma.testimonial.create({
        data: { name, role, quote, featured: index === 0, sortOrder: index }
      });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
