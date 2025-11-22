import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { useStore } from "@/lib/store";
import { Heart, Send } from "lucide-react";

export default function Home() {
  const posts = useStore((state) => state.posts);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-logo text-2xl mt-1">InstaClone</h1>
        <div className="flex items-center gap-5">
          <Heart className="w-6 h-6" />
          <div className="relative">
            <Send className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full">
              2
            </span>
          </div>
        </div>
      </header>

      {/* Stories Rail (Mock) */}
      <div className="pt-3 pb-2 px-4 flex gap-4 overflow-x-auto no-scrollbar border-b border-border">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full border-2 border-background overflow-hidden bg-muted">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <span className="text-xs">User {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <main>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
