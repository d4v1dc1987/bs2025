import { Button } from "@/components/ui/button";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/layout/sidebar/SidebarContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toggle } = useSidebar();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${(firstName?.[0] || "").toUpperCase()}${(lastName?.[0] || "").toUpperCase()}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_1px_3px_0_rgba(123,38,251,0.1)]">
      <div className="w-full h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          
          {user?.user_metadata && (
            <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">
              {getGreeting()} {user.user_metadata.first_name || user.email}!
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 px-3 flex items-center gap-2 hover:bg-primary/10 group"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url || undefined} 
                    alt="Photo de profil"
                    className="object-cover" 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user?.user_metadata?.avatar_url ? getInitials(user?.user_metadata?.first_name, user?.user_metadata?.last_name) : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56" 
              align="end" 
              forceMount
              onPointerEnter={(e) => {
                const trigger = document.querySelector('[data-radix-dropdown-menu-trigger]') as HTMLElement;
                if (trigger) {
                  trigger.click();
                  trigger.setAttribute('data-state', 'open');
                }
              }}
              onPointerLeave={(e) => {
                const trigger = document.querySelector('[data-radix-dropdown-menu-trigger]') as HTMLElement;
                if (trigger) {
                  trigger.setAttribute('data-state', 'closed');
                  const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
                  document.dispatchEvent(closeEvent);
                }
              }}
            >
              <DropdownMenuLabel className="font-normal py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="py-2">
                <Link to="/profile" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600 py-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};