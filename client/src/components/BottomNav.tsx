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
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 h-[60px] pb-safe z-50 shadow-2xl">
      <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "p-2 cursor-pointer transition-all active:scale-90 flex items-center justify-center w-10 h-10 rounded-lg",
                isActive ? "bg-white/20 backdrop-blur-sm" : ""
              )}>
                <Icon 
                  size={26} 
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "text-white stroke-[3px]" : "text-white/60 stroke-[2px]"
                  )}
                  fill={isActive ? "currentColor" : "none"} 
                />
              </div>
            </Link>
          );
        })}
        
        {/* Profile Icon Special Case */}
        <Link href="/profile">
           <div className="p-2 cursor-pointer transition-transform active:scale-90 flex items-center justify-center w-10 h-10">
              <div className={cn(
                 "w-7 h-7 rounded-full overflow-hidden border-2 transition-all",
                 location === '/profile' ? "border-black dark:border-white p-[1px]" : "border-transparent"
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
