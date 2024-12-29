import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/layout/sidebar/SidebarContext";

export const Header = () => {
  const { user, signOut } = useAuth();
  const { isOpen, toggle } = useSidebar();
  
  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-10 w-10 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        
        {user && (
          <span className="ml-4 text-sm text-muted-foreground truncate max-w-[150px] md:max-w-none">
            {getGreeting()} {user.user_metadata.first_name}!
          </span>
        )}
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex items-center space-x-2">
            {user && (
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Déconnexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};