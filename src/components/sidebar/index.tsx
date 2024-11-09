import {
  Heart,
  Home,
  ListMusic,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Search from "../global/search";
import Toggle from "./toggle";
import UserIcon from "../global/user";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Liked Songs",
    url: "/liked-songs",
    icon: Heart,
  },
  {
    title: "My playlists",
    url: "/playlists",
    icon: ListMusic,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export async function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-4 mt-4 flex flex-col items-start justify-start gap-2 h-20">
            <h3 className="text-3xl font-bold text-primary">
              {process.env.BRAND_NAME}
            </h3>
            <Search />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Toggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer with UserButton */}
      <SidebarFooter>
        <UserIcon />
      </SidebarFooter>
    </Sidebar>
  );
}
