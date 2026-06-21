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

const starterMenuTitles = [
  "Signature Buffet",
  "Wedding Dinner",
  "Corporate Bites",
  "Private Dinner",
  "Brunch Table",
  "Cocktail Reception",
  "Dessert Finale",
  "Vegan Feast",
  "Ethiopian Dishes",
  "Eritrean Dishes",
  "European Cuisines"
];

const menuItems = [
  ["Doro Wot", "Ethiopian Dishes", "Chicken simmered in berbere, onions, spiced butter, and boiled egg, served with injera.", "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Siga Wot", "Ethiopian Dishes", "Tender beef stew with berbere, garlic, ginger, and slow-cooked onion base.", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Misir Wot", "Ethiopian Dishes", "Red lentils cooked with berbere and aromatics for a rich plant-forward favorite.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Shiro", "Ethiopian Dishes", "Silky chickpea stew seasoned with garlic, onion, mild spices, and a warm finish.", "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Tibs", "Ethiopian Dishes", "Sauteed beef or lamb with peppers, onions, rosemary, garlic, and awaze on the side.", "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Gomen", "Ethiopian Dishes", "Collard greens cooked gently with onion, garlic, ginger, and clarified spiced butter.", "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Atkilt Wot", "Ethiopian Dishes", "Cabbage, carrots, and potatoes cooked with turmeric and mild Ethiopian aromatics.", "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Kitfo", "Ethiopian Dishes", "Finely minced beef with mitmita and spiced butter, served traditional or lightly warmed.", "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Zigni", "Eritrean Dishes", "Eritrean beef stew with berbere, tomato, onions, garlic, and warm spice depth.", "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Tsebhi Derho", "Eritrean Dishes", "Chicken stew with berbere, slow-cooked onions, tomato, and hard-boiled egg.", "https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Tsebhi Sga", "Eritrean Dishes", "Hearty Eritrean meat stew prepared for injera platters and buffet service.", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Timtimo", "Eritrean Dishes", "Spiced red lentils with berbere, onions, and a smooth stew texture.", "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Alicha Birsen", "Eritrean Dishes", "Mild lentil stew with turmeric, garlic, and onion for guests who prefer less heat.", "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Hamli", "Eritrean Dishes", "Eritrean greens cooked with onion, garlic, tomato, and gentle spice.", "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Fata", "Eritrean Dishes", "Torn bread tossed with spiced tomato sauce, yogurt, and fresh herbs.", "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Ga'at", "Eritrean Dishes", "Traditional porridge served with spiced butter and yogurt for breakfast or cultural events.", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Chicken Cacciatore", "European Cuisines", "Italian chicken braised with tomato, herbs, peppers, olives, and garlic.", "https://images.unsplash.com/photo-1604908177522-402c166d1cb4?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Beef Bourguignon", "European Cuisines", "French-style beef slow-braised with red wine, mushrooms, carrots, and pearl onions.", "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Lasagna al Forno", "European Cuisines", "Layered pasta with tomato ragu, bechamel, cheese, and oven-baked finish.", "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Herb-Roasted Salmon", "European Cuisines", "Salmon roasted with lemon, dill, parsley, olive oil, and seasonal vegetables.", "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Greek Mezze Table", "European Cuisines", "Hummus, tzatziki, grilled vegetables, olives, feta, pita, and fresh salads.", "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Spanish Paella", "European Cuisines", "Saffron rice with vegetables, seafood or chicken, peppers, peas, and lemon.", "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Roasted Vegetable Tart", "European Cuisines", "Flaky pastry with seasonal vegetables, herbs, cheese, and bright salad garnish.", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&h=2200&q=95"],
  ["Tiramisu Cups", "European Cuisines", "Individual espresso-soaked ladyfinger cups layered with mascarpone and cocoa.", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&h=2200&q=95"]
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

  await prisma.menuItem.updateMany({
    where: { title: { in: starterMenuTitles } },
    data: { available: false, featured: false }
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
