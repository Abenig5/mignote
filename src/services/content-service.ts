import { prisma } from "@/lib/db";
import { galleryItems as fallbackGalleryItems } from "@/config/gallery";
import { menuItems as fallbackMenuItems } from "@/config/menu";
import { siteConfig as fallbackSiteConfig } from "@/config/site";
import { testimonials as fallbackTestimonials } from "@/config/testimonials";

export type SiteMenuItem = {
  id?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price?: number | null;
  available?: boolean;
  featured?: boolean;
};

export type SiteGalleryItem = {
  id?: string;
  title: string;
  description: string;
  image: string;
  album?: string | null;
  featured?: boolean;
};

export type SiteTestimonial = {
  id?: string;
  name: string;
  role?: string | null;
  quote: string;
  featured?: boolean;
};

export async function getSiteContent() {
  try {
    const content = await prisma.websiteContent.findUnique({
      where: { id: "site" }
    });

    if (!content) {
      return fallbackSiteConfig;
    }

    return {
      ...fallbackSiteConfig,
      name: content.name,
      email: content.email,
      tagline: content.tagline,
      hero: {
        kicker: content.heroKicker,
        title: content.heroTitle,
        description: content.heroDescription,
        image: content.heroImage
      },
      story: {
        kicker: content.storyKicker,
        title: content.storyTitle,
        paragraphs: content.storyParagraphs,
        image: content.storyImage
      }
    };
  } catch {
    return fallbackSiteConfig;
  }
}

export async function getMenuItems(): Promise<SiteMenuItem[]> {
  try {
    const items = await prisma.menuItem.findMany({
      where: { available: true },
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    if (items.length === 0) {
      return fallbackMenuItems;
    }

    return items.map((item) => ({
      id: item.id,
      name: item.title,
      category: item.category.title,
      description: item.description,
      image: item.image,
      price: item.price,
      available: item.available,
      featured: item.featured
    }));
  } catch {
    return fallbackMenuItems;
  }
}

export async function getGalleryItems(): Promise<SiteGalleryItem[]> {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });

    if (items.length === 0) {
      return fallbackGalleryItems;
    }

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      album: item.album,
      featured: item.featured
    }));
  } catch {
    return fallbackGalleryItems;
  }
}

export async function getTestimonials(): Promise<SiteTestimonial[]> {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
    });

    if (items.length === 0) {
      return fallbackTestimonials;
    }

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      role: item.role,
      quote: item.quote,
      featured: item.featured
    }));
  } catch {
    return fallbackTestimonials;
  }
}

export async function getAdminContentSummary() {
  const [menuCount, categoryCount, galleryCount, testimonialCount] = await Promise.all([
    prisma.menuItem.count(),
    prisma.category.count(),
    prisma.galleryItem.count(),
    prisma.testimonial.count()
  ]);

  return { menuCount, categoryCount, galleryCount, testimonialCount };
}
