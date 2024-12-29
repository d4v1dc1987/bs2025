import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarLogo } from "./SidebarLogo";

export const Sidebar = () => {
  const { isOpen } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-all duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#232228] border-r border-white/10 transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <SidebarLogo />
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav />
        </div>
      </aside>
    </>
  );
};