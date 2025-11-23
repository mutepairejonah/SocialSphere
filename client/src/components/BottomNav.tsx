import { Link, useLocation } from "wouter";
import { House, Search, PlusSquare, Heart, MessageCircle, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function BottomNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const [location] = useLocation();
  const currentUser = useStore((state) => state.currentUser);

  const navItems = [
    { icon: House, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: PlusSquare, label: "Create", path: "/create" },
    { icon: Heart, label: "Activity", path: "/activity" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-sm h-[56px] pb-safe z-50 border-t border-border">
      <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="p-2 cursor-pointer flex items-center justify-center w-10 h-10 transition-all duration-200">
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "text-foreground stroke-[2.5px]" : "text-foreground/60 stroke-[2px] hover:text-foreground"
                  )}
                  fill={isActive && item.label !== 'Search' && item.label !== 'Create' ? "currentColor" : "none"} 
                />
              </div>
            </Link>
          );
        })}
        
        {/* Menu Button */}
        <button 
          onClick={onMenuClick}
          className="p-2 cursor-pointer transition-all flex items-center justify-center w-10 h-10"
          data-testid="button-footer-menu"
        >
          <Menu className="w-5 h-5 text-foreground/60 hover:text-foreground transition-colors" />
        </button>

        {/* Profile Icon Special Case */}
        <Link href="/profile">
           <div className="p-2 cursor-pointer transition-all flex items-center justify-center w-10 h-10">
              <div className={cn(
                 "w-7 h-7 rounded-full overflow-hidden border-[1.5px] transition-all",
                 location === '/profile' ? "border-foreground" : "border-foreground/40"
              )}>
                 <img 
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                    className="w-full h-full rounded-full object-cover bg-muted"
                 />
              </div>
           </div>
        </Link>
      </div>
    </div>
  );
}
