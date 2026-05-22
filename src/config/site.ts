export const siteConfig = {
  name: "Mignote Catering",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "events@mignote.example",
  tagline: "Seasonal catering for weddings, private dinners, and corporate gatherings.",
  hero: {
    kicker: "Mignote",
    title: "Thoughtful Catering For Every Table",
    description:
      "Elegant menus, calm service, and memorable hospitality for intimate dinners, polished receptions, and full wedding celebrations.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=2400&q=95"
  },
  story: {
    kicker: "Our Approach",
    title: "Menus shaped around your guests, your schedule, and your setting.",
    paragraphs: [
      "Mignote Catering plans each event around the way people will gather: seated dinners, buffet service, cocktail receptions, and family-style celebrations all need a different rhythm.",
      "Our team pairs practical event planning with warm food service, building menus that feel generous, balanced, and easy for guests to enjoy."
    ],
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1800&q=95"
  }
};
