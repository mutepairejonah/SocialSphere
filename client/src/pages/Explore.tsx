import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, MapPin } from "lucide-react";

export default function Explore() {
  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border p-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search" className="pl-9 bg-muted border-0 h-9" />
        </div>
      </header>

      <main>
        {/* Location Suggestions */}
        <div className="p-4">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Nearby
          </h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
            {["Cafés", "Hotels", "Parks", "Art"].map((cat) => (
              <div key={cat} className="flex-shrink-0 px-4 py-2 bg-muted rounded-lg font-semibold text-sm whitespace-nowrap">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Masonry Grid Mock */}
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(24)].map((_, i) => (
            <div key={i} className={`bg-muted relative aspect-square ${i % 3 === 0 && i % 2 !== 0 ? "row-span-2 col-span-2 aspect-auto" : ""}`}>
              <img 
                src={`https://images.unsplash.com/photo-${1600000000000 + i}?w=400&auto=format&fit=crop&q=60`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
