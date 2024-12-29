import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";

export const Sidebar = () => {
  const { open } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background/95 backdrop-blur-sm border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          !open && "-translate-x-full"
        )}
      >
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </aside>
    </>
  );
};