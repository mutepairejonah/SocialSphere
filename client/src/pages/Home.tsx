import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { Heart, Send, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { posts, stories, markStoryViewed, currentUser, allUsers } = useStore();
  const [, setLocation] = useLocation();

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
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

      {/* Feed - Grid Layout */}
      <main className="min-h-[calc(100vh-150px)] p-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <p className="text-center">No posts yet. Follow someone to see their content!</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
