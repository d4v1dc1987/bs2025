import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarLogo } from "./SidebarLogo";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const { signOut } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-all duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={close}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#232228] border-r border-white/10 transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 md:justify-center">
          <SidebarLogo />
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="md:hidden text-white hover:text-white/80"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
        <div className="p-4 md:hidden">
          <Button 
            variant="primary"
            onClick={signOut}
            className="w-full bg-[#7b26fb] text-white hover:bg-[#7b26fb]/90"
          >
            Déconnexion
          </Button>
        </div>
      </aside>
    </>
  );
};