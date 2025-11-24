import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getUserStories } from "@/lib/instagram";

export default function Stories() {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();
  const [stories, setStories] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      if (!currentUser?.instagramAccounts?.length) {
        setLoading(false);
        return;
      }

      try {
        const activeAccount = currentUser.instagramAccounts[
          currentUser.activeInstagramAccountId ?? 0
        ];
        if (activeAccount?.token) {
          const fetchedStories = await getUserStories('me');
          setStories(fetchedStories);
        }
      } catch (error) {
        console.error("Error loading stories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [currentUser]);

  if (!currentUser?.instagramAccounts?.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Connect your Instagram account to view stories.</p>
          <button
            onClick={() => setLocation("/profile/connect-instagram")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Connect Instagram
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-black"
              data-testid="button-back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Stories</h1>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)]">
          <div className="text-center">
            <p className="text-gray-600">No stories yet</p>
            <p className="text-sm text-gray-500 mt-2">Post a story on Instagram to see it here</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];
  const hasNext = currentIndex < stories.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Story Container */}
      <div className="relative w-full h-full max-w-md mx-auto flex flex-col bg-black">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / stories.length) * 100}%` }}
          />
        </div>

        {/* Story Content */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {currentStory?.media_url ? (
            currentStory.media_type === "VIDEO" ? (
              <video
                src={currentStory.media_url}
                className="w-full h-full object-cover"
                autoPlay
                data-testid="story-video"
              />
            ) : (
              <img
                src={currentStory.media_url}
                alt="Story"
                className="w-full h-full object-cover"
                data-testid="story-image"
              />
            )
          ) : null}
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
          <span>{currentIndex + 1} of {stories.length}</span>
          {currentStory?.timestamp && (
            <span className="text-xs text-gray-300">
              {new Date(currentStory.timestamp).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
