import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2, UserPlus, UserCheck } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

export default function Explore() {
  const { searchUsers, toggleFollow } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("IGTV");

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    
    if (!value || value.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(value);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    await toggleFollow(userId);
    // Update local search results
    setSearchResults(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm p-3 pb-2">
        <div className="relative group">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-muted/80 border-0 h-9 rounded-xl focus-visible:ring-0 focus-visible:bg-muted" 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
          {["IGTV", "Shop", "Style", "Sports", "Auto", "Decor", "Art", "DIY"].map((cat) => (
            <div 
              key={cat} 
              className={`flex-shrink-0 px-5 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap border cursor-pointer transition-colors ${
                activeCategory === cat 
                  ? 'border-foreground bg-foreground text-background' 
                  : 'border-border hover:bg-muted'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </header>

      <main className="pt-1">
        {/* Search Results */}
        {searchTerm && searchResults.length > 0 && (
          <div className="bg-background">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={user.isFollowing ? "secondary" : "default"}
                  className="flex-shrink-0 h-8 font-semibold"
                  onClick={() => handleFollowToggle(user.id)}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchTerm && !searching && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <SearchIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-semibold">No users found</p>
            <p className="text-sm">Try searching with a different name</p>
          </div>
        )}

        {/* Masonry Grid (shown when no search) */}
        {!searchTerm && (
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(30)].map((_, i) => {
              const isLarge = i % 10 === 2 || i % 10 === 5;
              
              return (
                <div 
                  key={i} 
                  className={`bg-muted relative group cursor-pointer overflow-hidden ${isLarge ? "row-span-2 col-span-2" : "aspect-square"}`}
                >
                  <img 
                    src={`https://images.unsplash.com/photo-${1600000000000 + i}?w=500&auto=format&fit=crop&q=60`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    alt="Explore"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
