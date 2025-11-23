import { PostCard } from "@/components/PostCard";
import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Search, Heart, Send, Plus, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { posts, stories, markStoryViewed, currentUser, logout } = useStore();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] pb-20">
      {/* Facebook-style Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-[#1877F2]">Authentic</div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-3 max-w-xs">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-8 h-8 text-sm bg-gray-100 border-0 rounded-full focus-visible:ring-0 focus-visible:bg-gray-200"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-700" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setLocation("/profile")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-settings"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>

            {/* Notifications */}
            <Link href="/activity">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" data-testid="button-notifications">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
            </Link>

            {/* Messages */}
            <Link href="/messages">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" data-testid="button-messages">
                <Send className="w-5 h-5 text-gray-700 -rotate-[15deg]" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  2
                </span>
              </button>
            </Link>

            {/* Profile Avatar */}
            <Link href="/profile">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1877F2] cursor-pointer hover:opacity-80 transition-opacity">
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 py-3">
        {/* Stories Section - Facebook Style */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-2 overflow-x-auto">
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
        <div className="max-w-md mx-auto">
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm">
              <p className="text-center text-gray-500">No videos available</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
