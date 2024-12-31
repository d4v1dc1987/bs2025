import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { SidebarNav } from "./SidebarNav";
import { SidebarLogo } from "./SidebarLogo";
import { X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const { user, signOut } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}`;
  };

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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#232228] border-r border-white/10",
          "transition-all duration-300 ease-in-out",
          "md:relative",
          !isOpen && "-translate-x-full md:translate-x-0 md:w-[72px]"
        )}
      >
        <div className="flex items-center justify-between p-4">
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

        {/* User menu - Desktop */}
        <div className="hidden md:block p-4">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-colors",
            !isOpen ? "justify-center" : "bg-white/5 hover:bg-white/10"
          )}>
            <Avatar className="h-9 w-9">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url || undefined} 
                alt="Photo de profil"
                className="object-cover" 
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.user_metadata?.avatar_url ? getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User menu - Mobile */}
        <div className="md:hidden p-4">
          <div className="flex items-center gap-3 p-3 mb-3 rounded-lg bg-white/5">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user?.user_metadata?.avatar_url || undefined} 
                alt="Photo de profil"
                className="object-cover" 
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.user_metadata?.avatar_url ? getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </div>

          <Separator className="my-2 bg-white/10" />
          
          <Button 
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </aside>
    </>
  );
};