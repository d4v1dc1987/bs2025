import { Home, Lightbulb, MessageCircle, Calendar, Users } from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "../ui/Logo";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Accueil", icon: Home, path: "/" },
  { title: "Générateur", icon: Lightbulb, path: "/generator" },
  { title: "Commentaires", icon: MessageCircle, path: "/comments" },
  { title: "Calendrier", icon: Calendar, path: "/calendar" },
  { title: "CRM", icon: Users, path: "/crm" },
];

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <div className="p-4">
        <Logo />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarContainer>
  );
};