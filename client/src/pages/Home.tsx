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
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-background via-background to-purple-900/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 backdrop-blur-sm px-4 h-[70px] flex items-center justify-between shadow-lg">
        <h1 className="font-logo text-4xl mt-1 select-none cursor-pointer text-white drop-shadow-lg">Xylo</h1>
        <div className="flex items-center gap-6">
          <Link href="/activity">
             <Heart className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform text-white" data-testid="button-notifications" />
          </Link>
          <Link href="/messages">
            <div className="relative cursor-pointer hover:scale-105 transition-transform" data-testid="button-messages">
              <Send className="w-6 h-6 -rotate-[15deg] mb-1 text-white" />
              <span className="absolute -top-2 -right-2 bg-cyan-400 text-purple-900 text-[10px] font-bold px-1.5 h-4 flex items-center justify-center rounded-full border-[2px] border-white">
                2
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Stories Rail */}
      <div className="pt-4 pb-4 px-4 flex gap-4 overflow-x-auto no-scrollbar bg-gradient-to-b from-violet-500/5 to-transparent border-b border-purple-500/20">
        {/* My Story */}
        <div 
          className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
          onClick={() => setLocation("/stories/create")}
          data-testid="button-create-story"
        >
          <div className="relative w-[72px] h-[72px]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 overflow-hidden p-[3px] group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"} 
                className="w-full h-full object-cover rounded-full bg-muted" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-background text-white group-hover:scale-110 transition-transform shadow-lg">
              <PlusSquare size={14} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-cyan-400 transition-colors">Your story</span>
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
                  "w-[72px] h-[72px] rounded-full p-[2px]",
                  story.isViewed ? "bg-border" : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
                )}>
                  <div className="w-full h-full rounded-full border-[2px] border-background overflow-hidden bg-muted group-hover:scale-110 transition-transform">
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
      <main className="min-h-[calc(100vh-150px)] px-2 py-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <p className="text-lg font-semibold">No posts yet</p>
             <p className="text-sm">Start exploring to see content!</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
