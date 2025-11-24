import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Heart, Send, Plus, LogOut, Settings, Search as SearchIcon, X, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#f0f2f5] pb-20">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-2 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-3 mb-2">
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
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  2
                </span>
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
        </div>

        {/* Instagram-style Search Bar */}
        <div className="px-2 sm:px-4 pb-2">
          <div className="relative w-full max-w-sm mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-9 pr-9 bg-gray-100 border-0 h-9 rounded-full focus-visible:ring-0 focus-visible:bg-gray-100 text-sm"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchTerm && setShowSearchResults(true)}
              data-testid="input-search"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-500" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-2 right-2 sm:left-4 sm:right-4 top-20 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto">
              {searchResults.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => {
                    setLocation(`/user/${user.id}`);
                    clearSearch();
                  }}
                  data-testid={`search-result-${user.id}`}
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.fullName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-2 sm:px-4 py-3 flex flex-col items-center">
        {/* Stories Section - Facebook Style */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-2 overflow-x-auto w-full max-w-2xl">
          <div className="flex gap-2 no-scrollbar pb-1">
            {/* Create Story Card */}
            <div
              onClick={() => setLocation("/create")}
              className="flex-shrink-0 w-24 h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all group relative"
              data-testid="button-create-story"
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                className="w-full h-16 object-cover"
                alt="Your Story"
              />
              <div className="p-2 h-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-center text-gray-800">Story</span>
              </div>
            </div>

            {/* Other Stories */}
            {stories.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  markStoryViewed(story.id);
                  setLocation("/stories");
                }}
                className={`flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all relative group ${
                  story.isViewed ? "opacity-60" : ""
                }`}
                data-testid={`story-${story.id}`}
              >
                <img
                  src={story.imageUrl}
                  className="w-full h-full object-cover"
                  alt="Story"
                />
                
                {/* Blue border for unviewed stories */}
                {!story.isViewed && (
                  <div className="absolute inset-0 border-3 border-[#1877F2] rounded-lg pointer-events-none" />
                )}

                {/* Story User Info - Overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <div className="flex items-center gap-1">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 border-2 ${
                      story.isViewed ? "border-gray-400" : "border-[#1877F2]"
                    } overflow-hidden`}>
                      <img
                        src={story.imageUrl}
                        className="w-full h-full object-cover"
                        alt="Story avatar"
                      />
                    </div>
                    <span className="text-[10px] text-white font-semibold truncate line-clamp-1">
                      {story.userId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="w-full max-w-2xl">
          {allPosts && allPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-max">
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
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
