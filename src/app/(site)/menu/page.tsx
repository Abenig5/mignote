import { MenuExplorer } from "@/components/menu-explorer";
import { getMenuItems } from "@/services/content-service";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menuItems = await getMenuItems();

  return <MenuExplorer menuItems={menuItems} />;
}
