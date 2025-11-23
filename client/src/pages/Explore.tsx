import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2, UserPlus, UserCheck, Menu, Home as HomeIcon, Compass, Plus, MessageCircle, User, LogOut, Settings, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Explore() {
  const { searchUsers, toggleFollow, logout } = useStore();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState("IGTV");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* White Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 overflow-hidden",
        sidebarOpen ? "w-64" : "w-0"
      )}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="font-bold text-2xl text-primary">Authentic</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="button-close-sidebar"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <button
            onClick={() => handleNavigation("/")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavigation("/explore")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/explore" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Compass className="w-5 h-5" />
            <span className="font-medium">Explore</span>
          </button>
          <button
            onClick={() => handleNavigation("/create")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/create" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create</span>
          </button>
          <button
            onClick={() => handleNavigation("/messages")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/messages" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </button>
          <button
            onClick={() => handleNavigation("/profile")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/profile" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/profile/edit")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors -ml-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-2xl select-none cursor-pointer text-primary">Authentic</h1>
          <div className="w-6"></div>
        </header>

        {/* Content */}
        <div className="pb-20 flex-1 overflow-y-auto">
        {/* Search Header */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm p-3 pb-2 border-b border-border">
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
                    ? 'border-primary bg-primary text-white' 
                    : 'border-border hover:bg-muted'
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
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
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
}
