import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

const SAMPLE_STORIES = [
  {
    id: "1",
    media_url: "https://images.unsplash.com/photo-1495805871991-aa4dc10de980?w=400&h=600&fit=crop",
    media_type: "IMAGE",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    media_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop",
    media_type: "IMAGE",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    media_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=600&fit=crop",
    media_type: "IMAGE",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export default function Stories() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStory = SAMPLE_STORIES[currentIndex];
  const hasNext = currentIndex < SAMPLE_STORIES.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col bg-black">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${((currentIndex + 1) / SAMPLE_STORIES.length) * 100}%` }} />
        </div>

        {/* Story Content */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {currentStory?.media_url && (
            <img src={currentStory.media_url} alt="Story" className="w-full h-full object-cover" data-testid="story-image" />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
          {hasPrev && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center text-white hover:bg-black/30 rounded-full transition-colors"
              data-testid="button-prev-story"
            >
              ←
            </button>
          )}
          {!hasPrev && <div className="w-12" />}

          {hasNext && (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="pointer-events-auto w-12 h-12 flex items-center justify-center text-white hover:bg-black/30 rounded-full transition-colors"
              data-testid="button-next-story"
            >
              →
            </button>
          )}
          {!hasNext && <div className="w-12" />}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setLocation("/")}
          className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          data-testid="button-close-stories"
        >
          ✕
        </button>

        {/* Story Counter */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white text-sm">
          <span>{currentIndex + 1} of {SAMPLE_STORIES.length}</span>
          {currentStory?.timestamp && (
            <span className="text-xs text-gray-300">{new Date(currentStory.timestamp).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}