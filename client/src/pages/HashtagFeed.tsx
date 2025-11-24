import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useRoute } from "wouter";
import { ArrowLeft, Loader2, Heart, MessageCircle } from "lucide-react";
import { getHashtagMedia } from "@/lib/instagram";

export default function HashtagFeed() {
  const { currentUser, bookmarkedPosts, bookmarkPost, removeBookmark } = useStore();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/hashtag/:id");
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hashtag = params?.id;
  const name = new URLSearchParams(window.location.search).get("name");

  useEffect(() => {
    const loadMedia = async () => {
      if (!hashtag || !currentUser?.instagramToken) return;
      setLoading(true);
      try {
        const instagramMedia = await getHashtagMedia(hashtag);
        setMedia(instagramMedia);
      } catch (error) {
        console.error("Failed to load hashtag media:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [hashtag, currentUser?.instagramToken]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation("/search")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">#{name}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : media.length === 0 ? (
          <div className="flex justify-center items-center h-96 text-gray-400">
            <p>No posts found</p>
          </div>
        ) : (
          <div className="space-y-6 p-4">
            {media.map((post) => {
              const isBookmarked = bookmarkedPosts.includes(post.id);
              return (
                <div
                  key={post.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  data-testid={`post-${post.id}`}
                >
                  {post.media_url && (
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      {post.media_type === "VIDEO" ? (
                        <video
                          src={post.media_url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={post.media_url}
                          alt={post.caption}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    {post.caption && (
                      <p className="text-sm text-gray-700 line-clamp-2">{post.caption}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments_count || 0}</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        isBookmarked ? removeBookmark(post.id) : bookmarkPost(post.id)
                      }
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        isBookmarked
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                      data-testid={`button-bookmark-${post.id}`}
                    >
                      {isBookmarked ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
