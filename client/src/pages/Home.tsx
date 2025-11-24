import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Menu, LogOut, Search as SearchIcon, X, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { posts, userPosts, stories, markStoryViewed, currentUser, logout, loadUserPosts, loadPosts, searchUsers } = useStore();
  const [, setLocation] = useLocation();
  const [allPostsLoaded, setAllPostsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    Promise.all([loadPosts(), loadUserPosts()]).then(() => setAllPostsLoaded(true));
  }, [loadPosts, loadUserPosts]);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    
    if (!value || value.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    try {
      const results = await searchUsers(value);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Combine Instagram videos and user posts
  const allPosts = allPostsLoaded ? [...posts, ...userPosts].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA;
  }) : posts;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Telegram-style Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold text-[#0088cc] whitespace-nowrap">Authentic</div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Menu Dropdown */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link href="/profile">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm">
                    Profile
                  </button>
                </Link>
                <Link href="/messages">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm">
                    Messages
                  </button>
                </Link>
                <Link href="/activity">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm">
                    Notifications
                  </button>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-9 pr-9 bg-gray-100 border-0 h-10 rounded-full focus-visible:ring-0 focus-visible:bg-gray-100 text-sm"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowSearchResults(true)}
              data-testid="input-search"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 top-20 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-80 overflow-y-auto">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setLocation(`/user/${user.id}`);
                    clearSearch();
                    setShowMenu(false);
                  }}
                  data-testid={`search-result-${user.id}`}
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={user.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 py-4 flex flex-col items-center">
        {/* Feed */}
        <div className="w-full max-w-2xl">
          {allPosts && allPosts.length > 0 ? (
            <div className="space-y-3">
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg">
              <p className="text-center text-gray-500">No posts available</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
