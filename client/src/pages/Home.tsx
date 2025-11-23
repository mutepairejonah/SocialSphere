import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { Heart, Send, PlusSquare, Menu, Home as HomeIcon, Compass, Plus, MessageCircle, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Home() {
  const { posts, stories, markStoryViewed, currentUser, allUsers, logout } = useStore();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    setLocation(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(true)}
          className="hover:opacity-70 transition-opacity p-2 -ml-2"
          data-testid="button-menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-2xl select-none cursor-pointer text-primary">Authentic</h1>
        <div className="flex items-center gap-4">
          <Link href="/activity">
             <Heart className="w-6 h-6 cursor-pointer hover:text-secondary transition-colors" data-testid="button-notifications" />
          </Link>
          <Link href="/messages">
            <div className="relative cursor-pointer" data-testid="button-messages">
              <Send className="w-6 h-6 -rotate-[15deg]" />
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold px-1.5 h-4 flex items-center justify-center rounded-full border border-background">
                2
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Stories Rail */}
      <div className="pt-3 pb-2 px-4 flex gap-4 overflow-x-auto no-scrollbar border-b border-border">
        {/* My Story */}
        <div 
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
          onClick={() => setLocation("/stories/create")}
          data-testid="button-create-story"
        >
          <div className="relative w-[64px] h-[64px]">
            <div className="w-full h-full rounded-full border-2 border-border overflow-hidden p-[2px] group-hover:border-foreground transition-colors">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-foreground rounded-full w-5 h-5 flex items-center justify-center border-2 border-background text-background group-hover:scale-110 transition-transform">
              <PlusSquare size={12} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground text-center">Your story</span>
        </div>

        {/* Other Stories */}
        {stories
          .filter(story => {
            // Show user's own story + stories from followed users
            if (story.userId === (currentUser?.username || currentUser?.id)) {
              return true;
            }
            const storyUser = allUsers.find(u => u.username === story.userId || u.id === story.userId);
            return storyUser && storyUser.isFollowing;
          })
          .map((story) => {
            const storyUser = allUsers.find(u => u.username === story.userId || u.id === story.userId);
            return (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
                onClick={() => {
                  markStoryViewed(story.id);
                  setLocation("/stories");
                }}
                data-testid={`story-${story.id}`}
              >
                <div className={cn(
                  "w-[64px] h-[64px] rounded-full p-[2px]",
                  story.isViewed ? "bg-border" : "bg-foreground"
                )}>
                  <div className="w-full h-full rounded-full border-2 border-background overflow-hidden bg-muted group-hover:scale-105 transition-transform">
                    <img 
                      src={story.imageUrl} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <span className="text-xs truncate w-16 text-center">{storyUser?.username || story.userId}</span>
              </div>
            );
          })}
      </div>

      {/* Feed - Grid Layout (Videos Only) */}
      <main className="min-h-[calc(100vh-150px)] p-4">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <p className="text-center">No videos available</p>
          </div>
        )}
      </main>

      <BottomNav />

      {/* Background Overlay - Light Blur */}
      {menuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Navigation Drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 flex flex-col bg-background backdrop-blur-md border-r border-border">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="text-2xl font-bold text-primary">Authentic</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 py-6 space-y-2">
            <button
              onClick={() => handleNavigation("/")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-home"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => handleNavigation("/explore")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-explore"
            >
              <Compass className="w-5 h-5" />
              <span className="font-medium">Explore</span>
            </button>
            <button
              onClick={() => handleNavigation("/create")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-create"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </button>
            <button
              onClick={() => handleNavigation("/messages")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-messages"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Messages</span>
            </button>
            <button
              onClick={() => handleNavigation("/profile")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-profile"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Profile</span>
            </button>
          </nav>

          <div className="border-t border-border pt-4 space-y-2">
            <button
              onClick={() => handleNavigation("/profile/edit")}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
              data-testid="nav-settings"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
              data-testid="nav-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
