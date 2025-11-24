import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { LogOut, Heart, MessageCircle, Share2, Loader2 } from "lucide-react";
import { getUserMedia } from "@/lib/instagram";

export default function Home() {
  const { currentUser, logout } = useStore();
  const [, setLocation] = useLocation();
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      try {
        const instagramMedia = await getUserMedia();
        setMedia(instagramMedia);
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">instagram</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{currentUser?.username}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-black transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : media.length === 0 ? (
          <div className="flex justify-center items-center h-96 text-gray-400">
            <p>No media found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {media.map((item) => (
              <article key={item.id} className="bg-white" data-testid={`post-${item.id}`}>
                {/* Post Header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <span className="text-sm font-semibold">{currentUser?.username}</span>
                  </div>
                  <button className="text-gray-600 hover:text-black" data-testid={`button-more-${item.id}`}>
                    •••
                  </button>
                </div>

                {/* Media */}
                <div className="bg-black w-full aspect-square overflow-hidden">
                  {item.media_type === "VIDEO" ? (
                    <video
                      src={item.media_url}
                      className="w-full h-full object-cover"
                      controls
                      data-testid={`video-${item.id}`}
                    />
                  ) : (
                    <img
                      src={item.media_url}
                      alt={item.caption || "Instagram post"}
                      className="w-full h-full object-cover"
                      data-testid={`image-${item.id}`}
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 flex gap-4">
                  <button className="text-gray-600 hover:text-black transition-colors" data-testid={`button-like-${item.id}`}>
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="text-gray-600 hover:text-black transition-colors" data-testid={`button-comment-${item.id}`}>
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button className="text-gray-600 hover:text-black transition-colors" data-testid={`button-share-${item.id}`}>
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Engagement Stats */}
                <div className="px-4 py-2 border-t border-gray-200">
                  <p className="text-sm font-semibold" data-testid={`likes-${item.id}`}>
                    {item.like_count || 0} likes
                  </p>
                </div>

                {/* Caption */}
                {item.caption && (
                  <div className="px-4 py-2">
                    <p className="text-sm">
                      <span className="font-semibold">{currentUser?.username}</span>{" "}
                      <span data-testid={`caption-${item.id}`}>{item.caption}</span>
                    </p>
                  </div>
                )}

                {/* Comments */}
                {item.comments_count > 0 && (
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-600 cursor-pointer hover:text-black" data-testid={`comments-${item.id}`}>
                      View all {item.comments_count} comments
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                {item.timestamp && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
