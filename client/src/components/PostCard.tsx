import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const toggleLike = useStore((state) => state.toggleLike);
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) {
      setIsLikedAnim(true);
      setTimeout(() => setIsLikedAnim(false), 1000);
    }
  };

  return (
    <div className="pb-4 border-b border-border last:border-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">user_{post.userId.slice(0,5)}</span>
            {post.location && (
              <span className="text-xs text-muted-foreground">{post.location}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-muted overflow-hidden" onDoubleClick={handleLike}>
        <img 
          src={post.imageUrl} 
          alt="Post" 
          className="object-cover w-full h-full"
          loading="lazy"
        />
        {isLikedAnim && (
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
             >
               <Heart className="w-24 h-24 text-white fill-white drop-shadow-lg" />
             </motion.div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 pb-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-transform active:scale-90">
              <Heart 
                className={cn("w-7 h-7 transition-colors", post.isLiked ? "fill-red-500 text-red-500" : "text-foreground")} 
              />
            </button>
            <MessageCircle className="w-7 h-7 -rotate-90" />
            <Send className="w-7 h-7" />
          </div>
          <Bookmark className="w-7 h-7" />
        </div>

        {/* Likes & Caption */}
        <div className="space-y-1">
          <div className="text-sm font-semibold">{post.likes.toLocaleString()} likes</div>
          <div className="text-sm">
            <span className="font-semibold mr-2">user_{post.userId.slice(0,5)}</span>
            {post.caption}
          </div>
          <div className="text-xs text-muted-foreground uppercase mt-1">{post.timestamp}</div>
        </div>
      </div>
    </div>
  );
}
