import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2, UserPlus, UserCheck, LogOut, Settings, Heart, Send } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation, Link } from "wouter";

export default function Explore() {
  const { searchUsers, toggleFollow, currentUser, logout } = useStore();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("IGTV");

  const handleLogout = async () => {
    await logout();
  };

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
    <div className="pb-20 min-h-screen bg-[#f0f2f5]">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-2 sm:px-4 py-1.5 flex items-center justify-between">
          {/* Logo */}
          <div className="text-lg font-bold text-[#1877F2] whitespace-nowrap">Authentic</div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-700" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setLocation("/profile")}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-settings"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-700" />
            </button>

            {/* Notifications */}
            <Link href="/activity">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" data-testid="button-notifications">
                <Heart className="w-4 h-4 text-gray-700" />
              </button>
            </Link>

            {/* Messages */}
            <Link href="/messages">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors relative" data-testid="button-messages">
                <Send className="w-4 h-4 text-gray-700 -rotate-[15deg]" />
              </button>
            </Link>

            {/* Profile Avatar */}
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#1877F2] cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Header */}
      <div className="sticky top-12 z-40 bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-gray-100 border-0 h-9 rounded-xl focus-visible:ring-0 focus-visible:bg-gray-100" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-500" />
            )}
          </div>
          
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
            {["IGTV", "Shop", "Style", "Sports", "Auto", "Decor", "Art", "DIY"].map((cat) => (
              <div 
                key={cat} 
                className={`flex-shrink-0 px-5 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap border cursor-pointer transition-colors ${
                  activeCategory === cat 
                    ? 'border-[#1877F2] bg-[#1877F2] text-white' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto pt-1">
        {/* Search Results */}
        {searchTerm && searchResults.length > 0 && (
          <div className="bg-white">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  )}
                </div>
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setLocation(`/user/${user.id}`)}
                >
                  <p className="font-semibold truncate">{user.username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.fullName}</p>
                  {user.bio && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  className={`flex-shrink-0 h-8 font-semibold ${user.isFollowing ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-white hover:bg-primary/90'}`}
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
