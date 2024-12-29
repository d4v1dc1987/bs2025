import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarLogo } from "./SidebarLogo";

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
          "shrink-0 bg-[#232228] border-r border-white/10 transition-all duration-300 ease-in-out",
          isOpen ? "w-72" : "w-[72px]",
          "md:block" // Always show on desktop
        )}
      >
        <div className={cn(
          "h-full fixed top-0 left-0 bg-[#232228] border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col",
          isOpen ? "w-72" : "w-[72px]",
          "md:translate-x-0", // Always visible on desktop
          !isOpen && "md:w-[72px]", // Collapsed width on desktop
          !isOpen && "-translate-x-full md:translate-x-0" // Hide on mobile when closed, show on desktop
        )}>
          <SidebarLogo />
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav />
          </div>
        </div>
      </aside>
    </>
  );
};