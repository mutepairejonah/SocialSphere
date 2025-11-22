import { Link, useLocation } from "wouter";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: PlusSquare, label: "Create", path: "/create" },
    { icon: Heart, label: "Activity", path: "/activity" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background h-16 pb-safe">
      <div className="flex justify-around items-center h-full px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className="p-2 cursor-pointer transition-transform active:scale-95">
                <Icon 
                  size={26} 
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-foreground stroke-[2.5px]" : "text-muted-foreground stroke-[2px]"
                  )} 
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
