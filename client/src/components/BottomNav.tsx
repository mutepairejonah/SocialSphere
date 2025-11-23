import { Link, useLocation } from "wouter";
import { House, Search, PlusSquare, Heart, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  const [location] = useLocation();
  const currentUser = useStore((state) => state.currentUser);
  const { searchUsers, toggleFollow, allUsers } = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const navItems = [
    { icon: House, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/explore" },
    { icon: PlusSquare, label: "Create", path: "/create" },
    { icon: Heart, label: "Activity", path: "/activity" },
    { icon: MessageCircle, label: "Messages", path: "/messages" },
  ];

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
    setSearchResults(prev => prev.map(user => 
      user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
    ));
  };

  if (showSearch) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 p-3 h-auto max-h-[60vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-muted/80 border-0 h-9 rounded-full focus-visible:ring-0 focus-visible:bg-muted" 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button 
            onClick={() => {
              setShowSearch(false);
              setSearchTerm("");
              setSearchResults([]);
            }}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-2">
          {searchResults.map(user => (
            <div key={user.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted border border-border">
                  {user.avatar && (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.fullName}</p>
                </div>
              </div>
              <Button
                size="sm"
                className={`h-7 text-xs font-semibold ${user.isFollowing ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-white hover:bg-primary/90'}`}
                onClick={() => handleFollowToggle(user.id)}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
          {searchTerm && searchResults.length === 0 && !searching && (
            <p className="text-center text-muted-foreground text-sm py-4">No users found</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background backdrop-blur-sm h-[56px] pb-safe z-50 border-t border-border">
      <div className="flex justify-around items-center h-full px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          // Search button - opens search modal
          if (item.label === "Explore") {
            return (
              <button
                key={item.path}
                onClick={() => setShowSearch(true)}
                className="p-2 cursor-pointer flex items-center justify-center w-10 h-10 transition-all duration-200"
              >
                <Icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "text-foreground stroke-[2.5px]" : "text-foreground/60 stroke-[2px] hover:text-foreground"
                  )}
                  fill={isActive ? "currentColor" : "none"} 
                />
              </button>
            );
          }

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
