import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavButtonProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const NavButton = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  isOpen, 
  onClick,
  className 
}: NavButtonProps) => {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "justify-start gap-3 text-base font-normal group relative w-full",
        "transition-all duration-200",
        "hover:bg-primary/20 hover:text-white",
        isActive && "bg-primary/30 text-white border border-primary/30",
        !isOpen && "md:justify-center",
        "mb-1",
        className
      )}
      asChild
      onClick={onClick}
    >
      <Link to={to}>
        <Icon className={cn(
          "h-5 w-5 shrink-0",
          !isOpen && "md:w-5 md:h-5",
          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
        )} />
        <span className={cn(
          "transition-all duration-300",
          !isOpen && "md:hidden"
        )}>
          {label}
        </span>
      </Link>
    </Button>
  );
};