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
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useState<HTMLVideoElement | null>(null)[1];

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) {
      setIsLikedAnim(true);
      setTimeout(() => setIsLikedAnim(false), 1000);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
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
      <div className="relative aspect-square bg-muted overflow-hidden group" onDoubleClick={handleLike}>
        {post.mediaType === 'VIDEO' && post.videoUrl ? (
          <>
            <video 
              ref={videoRef as any}
              src={post.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover bg-black"
            />
            {/* Video overlay with play/pause and mute buttons */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <button 
                  className="bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all"
                  aria-label="Mute"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef) (videoRef as any).muted = !(videoRef as any).muted;
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.31-2.5-4.06v8.12c1.48-.75 2.5-2.28 2.5-4.06zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                </button>
              </div>
              <button 
                className="bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-4 transition-all self-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                aria-label="Play/Pause"
              >
                <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
            </div>
            {/* Video badge */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded pointer-events-none">
              VIDEO
            </div>
          </>
        ) : (
          <img 
            src={post.imageUrl} 
            alt="Post" 
            className="w-full h-full object-cover"
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
