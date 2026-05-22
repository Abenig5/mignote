import type { Metadata } from "next";
import "@/styles/globals.css";
import { inter, playfair } from "@/styles/fonts";

export const metadata: Metadata = {
  title: "Mignote Catering",
  description: "Modern catering services for private events, weddings, and corporate gatherings."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
