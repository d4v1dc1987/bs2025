import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
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

export const Sidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !open && "-translate-x-full"
        )}
      >
        <div className="flex-1 overflow-y-auto py-4">
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
        </div>
      </aside>
    </>
  );
};