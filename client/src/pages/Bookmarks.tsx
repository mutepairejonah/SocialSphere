import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { getUserMedia } from "@/lib/instagram";

export default function Bookmarks() {
  const { currentUser, bookmarkedPosts, removeBookmark } = useStore();
  const [, setLocation] = useLocation();
  const [allMedia, setAllMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      if (!currentUser?.instagramToken) return;
      setLoading(true);
      try {
        const media = await getUserMedia(undefined, currentUser.instagramToken);
        const bookmarked = media.filter((m: any) => bookmarkedPosts.includes(m.id));
        setAllMedia(bookmarked);
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [currentUser?.instagramToken, bookmarkedPosts]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Saved Posts</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : allMedia.length === 0 ? (
          <div className="flex justify-center items-center h-96 text-gray-400">
            <p>No saved posts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 p-1">
            {allMedia.map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 overflow-hidden cursor-pointer group relative"
                onClick={() => setLocation(`/post/${post.id}`)}
                data-testid={`bookmark-${post.id}`}
              >
                {post.media_type === "VIDEO" ? (
                  <video
                    src={post.media_url}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <img
                    src={post.media_url}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1 text-white">
                    <Heart className="w-5 h-5" />
                    <span>{post.like_count || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
