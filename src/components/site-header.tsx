import { SiteHeaderClient } from "@/components/site-header-client";
import { getSiteContent } from "@/services/content-service";

export async function SiteHeader() {
  const siteConfig = await getSiteContent();

  return <SiteHeaderClient siteName={siteConfig.name} />;
}
