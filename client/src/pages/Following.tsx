import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getUserFollowing, getUserMediaById } from "@/lib/instagram";

export default function Following() {
  const { currentUser } = useStore();
  const [, setLocation] = useLocation();
  const [following, setFollowing] = useState<any[]>([]);
  const [followingMedia, setFollowingMedia] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFollowing = async () => {
      setLoading(true);
      try {
        const followingList = await getUserFollowing();
        setFollowing(followingList);

        // Load media for each person they follow (limit to first 5 for performance)
        const mediaMap: Record<string, any[]> = {};
        for (const user of followingList.slice(0, 5)) {
          const media = await getUserMediaById(user.id);
          mediaMap[user.id] = media.slice(0, 6); // Get first 6 posts per user
        }
        setFollowingMedia(mediaMap);
      } catch (error) {
        console.error("Failed to load following:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFollowing();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Following</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : following.length === 0 ? (
          <div className="flex justify-center items-center h-96 text-gray-400">
            <p>You're not following anyone yet</p>
          </div>
        ) : (
          <div className="space-y-12">
            {following.map((user) => (
              <div key={user.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                {/* User Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                    {user.profile_picture_url && (
                      <img
                        src={user.profile_picture_url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        data-testid={`avatar-${user.id}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg" data-testid={`name-${user.id}`}>
                      {user.name || user.username}
                    </h2>
                    <p className="text-sm text-gray-600" data-testid={`username-${user.id}`}>
                      @{user.username}
                    </p>
                    {user.biography && (
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{user.biography}</p>
                    )}
                  </div>
                </div>

                {/* User's Media Grid */}
                {followingMedia[user.id] && followingMedia[user.id].length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {followingMedia[user.id].map((media) => (
                      <div
                        key={media.id}
                        className="aspect-square bg-gray-100 overflow-hidden rounded-lg hover:opacity-80 transition-opacity cursor-pointer group relative"
                        data-testid={`media-${media.id}`}
                      >
                        {media.media_type === "VIDEO" ? (
                          <video
                            src={media.media_url}
                            className="w-full h-full object-cover"
                            data-testid={`video-${media.id}`}
                          />
                        ) : (
                          <img
                            src={media.media_url}
                            alt={media.caption || "Post"}
                            className="w-full h-full object-cover"
                            data-testid={`image-${media.id}`}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">{media.like_count || 0}</span>
                              <span className="text-xs">❤️</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">{media.comments_count || 0}</span>
                              <span className="text-xs">💬</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No posts yet</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
