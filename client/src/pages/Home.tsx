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
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Header - Combined Instagram/Facebook/Telegram design */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-xl border-b-2 border-gradient-to-r from-blue-400/30 via-pink-400/30 to-yellow-400/30 px-4 h-[65px] flex items-center justify-between">
        <div className="relative">
          <h1 className="font-logo text-4xl mt-1 select-none cursor-pointer bg-gradient-to-r from-blue-600 via-pink-500 to-yellow-400 bg-clip-text text-transparent font-black tracking-tight drop-shadow-lg">InstaClone</h1>
          <div className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 rounded-full" style={{width: '80%'}}></div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/activity">
             <div className="p-2 rounded-full hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-colors">
               <Heart className="w-6 h-6 cursor-pointer hover:scale-110 hover:text-red-500 transition-all" data-testid="button-notifications" />
             </div>
          </Link>
          <Link href="/messages">
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-pink-100/20 dark:hover:bg-pink-900/20 transition-colors" data-testid="button-messages">
              <Send className="w-6 h-6 -rotate-[15deg]" />
              <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-500 to-pink-500 text-white text-[10px] font-bold px-1.5 h-5 flex items-center justify-center rounded-full border-[2px] border-background shadow-lg">
                2
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Stories Rail - Unique Design */}
      <div className="relative pt-4 pb-3 px-4 flex gap-3 overflow-x-auto no-scrollbar bg-gradient-to-b from-blue-50/20 via-pink-50/20 to-transparent dark:from-blue-900/5 dark:via-pink-900/5 dark:to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
        
        {/* My Story */}
        <div 
          className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
          onClick={() => setLocation("/stories/create")}
          data-testid="button-create-story"
        >
          <div className="relative w-[76px] h-[76px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-pink-400/30 blur-lg group-hover:from-blue-400/50 group-hover:to-pink-400/50 transition-all duration-300"></div>
            <div className="relative w-full h-full rounded-full border-[3px] border-gradient-to-r from-blue-400 to-pink-400 overflow-hidden p-[1px] shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"} 
                className="w-full h-full object-cover rounded-full bg-muted" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full w-7 h-7 flex items-center justify-center border-3 border-background text-white group-hover:scale-125 transition-transform shadow-lg">
              <PlusSquare size={14} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xs font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Your story</span>
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
                  story.isViewed ? "bg-border" : "bg-gradient-to-tr from-blue-500 via-pink-500 to-yellow-400"
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

      {/* Feed */}
      <main className="min-h-[calc(100vh-150px)]">
        {posts.length > 0 ? (
           posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <p>No posts yet</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
