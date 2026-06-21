import { MenuExplorer } from "@/components/menu-explorer";
import { getMenuItems } from "@/services/content-service";

export const dynamic = "force-dynamic";

type MenuPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const selectedCategory = Array.isArray(params?.category) ? params.category[0] : params?.category;
  const menuItems = await getMenuItems();

  return <MenuExplorer activeCategory={selectedCategory} menuItems={menuItems} />;
}
