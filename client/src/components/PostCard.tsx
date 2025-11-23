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
  const { toggleLike, toggleSave } = useStore();
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) {
      setIsLikedAnim(true);
      setTimeout(() => setIsLikedAnim(false), 1000);
    }
  };

  return (
    <div className="pb-2 border-b border-border last:border-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
            <Avatar className="h-8 w-8 border border-border relative z-10">
              <AvatarImage src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} />
              <AvatarFallback>{post.username?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none cursor-pointer hover:underline">{post.username || post.userId}</span>
            {post.location && (
              <span className="text-xs text-muted-foreground cursor-pointer">{post.location}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Media - Image or Video */}
      <div className="relative aspect-[4/5] bg-muted overflow-hidden group" onDoubleClick={handleLike}>
        {post.mediaType === 'VIDEO' && post.videoUrl ? (
          <>
            <video 
              src={post.videoUrl}
              controls
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/20 rounded-full p-4">
                <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
          </>
        ) : (
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="object-cover w-full h-full"
            loading="lazy"
          />
        )}
        {isLikedAnim && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
             >
               <Heart className="w-28 h-28 text-white fill-white drop-shadow-2xl" strokeWidth={0} />
             </motion.div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-transform active:scale-90 focus:outline-none">
              <Heart 
                className={cn("w-[26px] h-[26px] transition-colors", post.isLiked ? "fill-red-500 text-red-500" : "text-foreground hover:text-muted-foreground")} 
                strokeWidth={post.isLiked ? 0 : 2}
              />
            </button>
            <button className="transition-transform active:scale-90 focus:outline-none">
              <MessageCircle className="w-[26px] h-[26px] -rotate-90 text-foreground hover:text-muted-foreground" />
            </button>
            <button className="transition-transform active:scale-90 focus:outline-none">
              <Send className="w-[26px] h-[26px] text-foreground hover:text-muted-foreground" />
            </button>
          </div>
          <button onClick={() => toggleSave(post.id)} className="transition-transform active:scale-90 focus:outline-none">
             <Bookmark 
               className={cn("w-[26px] h-[26px] transition-colors", post.isSaved ? "fill-foreground text-foreground" : "text-foreground hover:text-muted-foreground")} 
             />
          </button>
        </div>

        {/* Likes & Caption */}
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">{post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}</div>
          <div className="text-sm leading-snug">
            <span className="font-semibold mr-2">{post.username || post.userId}</span>
            {post.caption}
          </div>
          {post.comments > 0 && (
            <div className="text-muted-foreground text-sm cursor-pointer mt-1">
              View all {post.comments} comments
            </div>
          )}
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{post.timestamp}</div>
        </div>
      </div>
    </div>
  );
}
