import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X, Volume2, VolumeX, MessageSquare, Share } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSave } = useStore();
  const [, setLocation] = useLocation();
  const [isLikedAnim, setIsLikedAnim] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const inFeedVideoRef = useRef<HTMLVideoElement>(null);

  const handleLike = () => {
    toggleLike(post.id);
    if (!post.isLiked) {
      setIsLikedAnim(true);
      setTimeout(() => setIsLikedAnim(false), 1000);
    }
  };

  const handleVideoClick = () => {
    if (post.mediaType === 'VIDEO' && post.videoUrl) {
      setIsFullscreen(true);
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      toast.success("Comment added!");
      setCommentText("");
    }
  };

  const handleShare = () => {
    // Navigate to messages with this user
    if (post.userId) {
      setLocation(`/messages?user=${post.userId}`);
      toast.success(`Opening messages with ${post.username}`);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
            <AvatarImage src={post.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`} />
            <AvatarFallback>{post.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-semibold leading-none cursor-pointer hover:text-primary transition-colors truncate">{post.username || post.userId}</span>
            {post.location && (
              <span className="text-[10px] sm:text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors truncate">{post.location}</span>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground flex-shrink-0">
          <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Media - Image or Video */}
      <div className="relative aspect-square bg-muted overflow-hidden group cursor-pointer" onDoubleClick={handleLike} onClick={handleVideoClick} style={{borderRadius: '0'}}>
        {post.mediaType === 'VIDEO' && post.videoUrl ? (
          <>
            <video 
              ref={inFeedVideoRef}
              src={post.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover bg-black"
              style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            />
            {/* Video overlay hint */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-4">
                <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
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

      {/* Fullscreen Video Modal */}
      {isFullscreen && post.mediaType === 'VIDEO' && post.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
          <div className="w-full h-full flex flex-col items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <video 
              ref={fullscreenVideoRef}
              src={post.videoUrl}
              autoPlay
              controls={false}
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain bg-black"
              style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', maxHeight: '100vh' }}
            />
            
            {/* Fullscreen Controls */}
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMute();
                }}
                className="bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-3 transition-all"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>

            {/* Close button */}
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Tap to close hint */}
            <div className="absolute top-4 left-4 text-white/60 text-sm">
              Click to close
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-border flex gap-1 justify-end items-center">
        <button 
          onClick={handleComment}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Comments"
          data-testid="button-comment"
        >
          <MessageCircle size={18} />
        </button>
        <button 
          onClick={handleShare}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          title="Share"
          data-testid="button-share"
        >
          <Send size={18} className="-rotate-[15deg]" />
        </button>
        <button 
          onClick={() => toggleSave(post.id)}
          className={cn("p-1.5 rounded-lg hover:bg-muted transition-colors", post.isSaved && "text-primary")}
          title="Save"
          data-testid="button-save"
        >
          <Bookmark size={18} fill={post.isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Likes & Caption */}
      <div className="px-4 py-3 space-y-1.5 border-t border-border">
        <div className="text-sm font-semibold">{post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}</div>
        <div className="text-sm leading-snug">
          <span className="font-semibold mr-2">{post.username || post.userId}</span>
          {post.caption}
        </div>
        {post.comments > 0 && (
          <button 
            onClick={handleComment}
            data-testid="button-view-comments"
            className="text-muted-foreground text-sm cursor-pointer mt-1 hover:text-foreground transition-colors"
          >
            View all {post.comments} comments
          </button>
        )}
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{post.timestamp}</div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-border space-y-3">
          <div className="max-h-40 overflow-y-auto space-y-2">
            <div className="text-sm">
              <span className="font-semibold text-xs text-muted-foreground">2 comments</span>
              <div className="mt-2 space-y-2">
                <div className="text-xs">
                  <span className="font-semibold">user_123:</span> Amazing post! 🔥
                </div>
                <div className="text-xs">
                  <span className="font-semibold">user_456:</span> Love this content
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
              className="h-8 text-sm"
              data-testid="input-comment"
            />
            <Button
              size="sm"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className="h-8"
              data-testid="button-post-comment"
            >
              Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
