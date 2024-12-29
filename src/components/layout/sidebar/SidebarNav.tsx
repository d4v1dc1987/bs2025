import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare, MessageCircleReply, Calendar, CheckSquare } from "lucide-react";

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
              "justify-start gap-2 text-base font-normal",
              isActive && "bg-primary/20 hover:bg-primary/30"
            )}
            asChild
          >
            <Link to={link.to}>
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};