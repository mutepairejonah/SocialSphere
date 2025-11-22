import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin } from "lucide-react";

export default function Explore() {
  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm p-3 pb-2">
        <div className="relative group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:hidden" />
          <Input 
            placeholder="Search" 
            className="pl-9 bg-muted/80 border-0 h-9 rounded-xl focus-visible:ring-0 focus-visible:bg-muted" 
          />
        </div>
        
        {/* Location Suggestions Chips */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
            {["IGTV", "Shop", "Style", "Sports", "Auto", "Decor", "Art", "DIY"].map((cat, i) => (
              <div 
                key={cat} 
                className={`flex-shrink-0 px-5 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap border border-border cursor-pointer hover:bg-muted transition-colors ${i === 0 ? 'ml-0' : ''}`}
              >
                {cat}
              </div>
            ))}
          </div>
      </header>

      <main className="pt-1">
        {/* Masonry Grid Mock */}
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(30)].map((_, i) => {
             const isLarge = i % 10 === 2 || i % 10 === 5; // Pattern for large cells
             
             return (
               <div 
                 key={i} 
                 className={`bg-muted relative group cursor-pointer overflow-hidden ${isLarge ? "row-span-2 col-span-2" : "aspect-square"}`}
               >
                  <img 
                    src={`https://images.unsplash.com/photo-${1600000000000 + i}?w=500&auto=format&fit=crop&q=60`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay for desktop feeling on mobile touch */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity" />
               </div>
             )
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
