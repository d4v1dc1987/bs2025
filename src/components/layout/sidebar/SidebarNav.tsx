import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare, MessageCircleReply, Calendar, CheckSquare } from "lucide-react";
import { useSidebar } from "./SidebarContext";

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
  
  return (
    <nav className="grid gap-1 px-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;
        
        return (
          <Button
            key={link.to}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2 text-base font-normal group relative",
              isActive && "bg-primary/20 hover:bg-primary/30",
              !isOpen && "px-0 justify-center w-full"
            )}
            asChild
            onClick={handleLinkClick}
          >
            <Link to={link.to}>
              <Icon className={cn(
                "h-5 w-5 shrink-0",
                !isOpen && "absolute left-1/2 -translate-x-1/2"
              )} />
              <span className={cn(
                "transition-all duration-300",
                !isOpen && "w-0 opacity-0"
              )}>
                {link.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};