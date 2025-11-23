import { Link, useLocation } from "wouter";
import { House, Search, PlusSquare, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function BottomNav() {
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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-lg h-[60px] pb-safe z-50 border-t-2 border-gradient-to-r from-blue-400 via-pink-400 to-yellow-400">
      <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "p-2 cursor-pointer flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group",
                isActive ? "bg-gradient-to-br from-blue-400/20 to-pink-400/20" : "hover:bg-muted/60"
              )}>
                <div className={cn(
                  "transition-all duration-300",
                  isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                )}>
                  <Icon 
                    size={24} 
                    className={cn(
                      "transition-all duration-200",
                      isActive ? "text-blue-500 stroke-[3px]" : "text-foreground/70 group-hover:text-foreground stroke-[2px]"
                    )}
                    fill={isActive && item.label !== 'Search' && item.label !== 'Create' ? "currentColor" : "none"} 
                  />
                </div>
              </div>
            </Link>
          );
        })}
        
        {/* Profile Icon Special Case */}
        <Link href="/profile">
           <div className={cn(
             "p-1 cursor-pointer transition-all flex items-center justify-center w-12 h-12 rounded-2xl",
             location === '/profile' ? "bg-gradient-to-br from-pink-400/20 to-yellow-400/20 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]" : "hover:bg-muted/60"
           )}>
              <div className={cn(
                 "w-8 h-8 rounded-full overflow-hidden border-2 transition-all",
                 location === '/profile' ? "border-pink-400 p-[2px] ring-2 ring-pink-400/30" : "border-foreground/30 hover:border-foreground"
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
