import { Link, useLocation } from "wouter";
import { House } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export function BottomNav() {
  const [location] = useLocation();
  const currentUser = useStore((state) => state.currentUser);

  const navItems = [
    { icon: House, label: "Home", path: "/" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="flex justify-around items-center h-[56px] px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="p-2 cursor-pointer flex items-center justify-center w-10 h-10 transition-colors rounded-lg hover:bg-gray-100">
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#0088cc] stroke-[2.5px]" : "text-gray-600 stroke-[2px]"
                  )}
                  fill={isActive ? "#0088cc" : "none"} 
                />
              </div>
            </Link>
          );
        })}
        
        {/* Profile Icon */}
        <Link href="/profile">
          <div className="p-2 cursor-pointer transition-colors rounded-lg hover:bg-gray-100">
            <div className={cn(
              "w-7 h-7 rounded-full overflow-hidden border-2 transition-all",
              location === '/profile' ? "border-[#0088cc]" : "border-gray-400"
            )}>
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                className="w-full h-full rounded-full object-cover bg-gray-200"
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
