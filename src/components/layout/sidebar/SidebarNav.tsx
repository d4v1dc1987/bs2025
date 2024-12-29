import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare, MessageCircleReply, Calendar, CheckSquare, LayoutDashboard } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import { Separator } from "@/components/ui/separator";

const dashboardLink = {
  to: "/dashboard",
  icon: LayoutDashboard,
  label: "Dashboard",
};

const links = [
  {
    to: "/generator",
    icon: BookOpen,
    label: "Idées de publications",
  },
  {
    to: "/comment",
    icon: MessageSquare,
    label: "Aide-moi à commenter",
  },
  {
    to: "/reply",
    icon: MessageCircleReply,
    label: "Aide-moi à répondre",
  },
  {
    to: "/calendar",
    icon: Calendar,
    label: "Calendrier social",
  },
  {
    to: "/close",
    icon: CheckSquare,
    label: "Aide-moi à closer",
  },
];

export const SidebarNav = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      close();
    }
  };

  const renderNavButton = (link: typeof links[0] | typeof dashboardLink) => {
    const Icon = link.icon;
    const isActive = location.pathname === link.to;
    
    return (
      <Button
        key={link.to}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "justify-start gap-2 text-base font-normal group relative",
          isActive && "bg-primary/20 hover:bg-primary/30",
          !isOpen && "md:justify-center"
        )}
        asChild
        onClick={handleLinkClick}
      >
        <Link to={link.to}>
          <Icon className={cn(
            "h-5 w-5 shrink-0",
            !isOpen && "md:w-5 md:h-5"
          )} />
          <span className={cn(
            "transition-all duration-300",
            !isOpen && "md:hidden"
          )}>
            {link.label}
          </span>
        </Link>
      </Button>
    );
  };
  
  return (
    <nav className="grid gap-1 px-2">
      {/* Dashboard Section */}
      {renderNavButton(dashboardLink)}
      
      {/* Separator */}
      <Separator className="my-2" />
      
      {/* Main Navigation Links */}
      {links.map((link) => renderNavButton(link))}
    </nav>
  );
};