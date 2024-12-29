import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarLogo } from "./SidebarLogo";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggle}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <SidebarLogo />
        
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="absolute right-4 top-4 h-8 w-8 md:hidden text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </aside>
    </>
  );
};