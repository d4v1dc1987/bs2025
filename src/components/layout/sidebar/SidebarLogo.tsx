import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

export const SidebarLogo = () => {
  const { isOpen } = useSidebar();
  
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center gap-3 px-4 py-6",
        !isOpen && "justify-center"
      )}
    >
      <Zap className="h-6 w-6 text-primary shrink-0" />
      {isOpen && (
        <span className="text-xl font-bold text-foreground">Bobby Social</span>
      )}
    </Link>
  );
};