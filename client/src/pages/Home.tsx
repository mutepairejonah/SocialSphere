import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { Heart, Send, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Home() {
  const { posts, stories, markStoryViewed, currentUser } = useStore();

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-[60px] flex items-center justify-between">
        <h1 className="font-logo text-3xl mt-1 select-none cursor-pointer">InstaClone</h1>
        <div className="flex items-center gap-6">
          <Link href="/activity">
             <Heart className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform" data-testid="button-notifications" />
          </Link>
          <Link href="/messages">
            <div className="relative cursor-pointer hover:scale-105 transition-transform" data-testid="button-messages">
              <Send className="w-6 h-6 -rotate-[15deg] mb-1" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 h-4 flex items-center justify-center rounded-full border-[2px] border-background">
                2
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Stories Rail */}
      <div className="pt-3 pb-2 px-4 flex gap-4 overflow-x-auto no-scrollbar border-b border-border">
        {/* My Story */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
          <div className="relative w-[72px] h-[72px]">
            <div className="w-full h-full rounded-full border-[2px] border-border overflow-hidden p-[2px]">
              <img 
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400"} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-background text-white">
              <PlusSquare size={14} strokeWidth={3} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground">Your story</span>
        </div>

        {/* Other Stories */}
        {stories.map((story) => (
          <div 
            key={story.id} 
            className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
            onClick={() => markStoryViewed(story.id)}
          >
            <div className={cn(
              "w-[72px] h-[72px] rounded-full p-[2px]",
              story.isViewed ? "bg-border" : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600"
            )}>
              <div className="w-full h-full rounded-full border-[2px] border-background overflow-hidden bg-muted">
                <img 
                  src={story.imageUrl} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                />
              </div>
            </div>
            <span className="text-xs truncate w-16 text-center">{story.userId}</span>
          </div>
        ))}
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
