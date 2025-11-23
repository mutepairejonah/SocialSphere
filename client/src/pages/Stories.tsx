import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export default function Stories() {
  const { stories, currentUser, allUsers } = useStore();
  const [, setLocation] = useLocation();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Filter stories to only show from followed users
  const followedStories = stories.filter(story => {
    const storyUser = allUsers.find(u => u.username === story.userId);
    return storyUser && storyUser.isFollowing;
  });

  useEffect(() => {
    if (followedStories.length === 0) {
      setLocation("/");
    }
  }, [followedStories.length]);

  if (followedStories.length === 0) return null;

  const story = followedStories[currentStoryIndex];
  const hasNext = currentStoryIndex < followedStories.length - 1;
  const hasPrev = currentStoryIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setLocation("/");
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Story Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={story.imageUrl} 
          alt="Story" 
          className="w-full h-full object-contain"
        />

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-white transition-all duration-5000"
            style={{ width: `${((currentStoryIndex + 1) / followedStories.length) * 100}%` }}
          />
        </div>

        {/* Story Info */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${story.userId}`}
              alt={story.userId}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <p className="text-sm font-semibold">{story.userId}</p>
            <p className="text-xs opacity-70">2 min ago</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setLocation("/")}
          className="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Tap zones */}
        <div 
          onClick={handlePrev}
          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
        />
        <div 
          onClick={handleNext}
          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
        />

        {/* Story Counter */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
          <p className="text-sm">{currentStoryIndex + 1} / {stories.length}</p>
          <button
            onClick={() => setLocation("/")}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
