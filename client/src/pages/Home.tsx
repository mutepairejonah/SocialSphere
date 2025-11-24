import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { LogOut, Heart, MessageCircle, Share2, Loader2, User, Users, Search as SearchIcon, Moon, Sun, RefreshCw, Bookmark } from "lucide-react";
import { getUserMedia } from "@/lib/instagram";

export default function Home() {
  const { currentUser, logout, darkMode, toggleDarkMode, bookmarkedPosts, bookmarkPost, removeBookmark, getActiveInstagramToken } = useStore();
  const [, setLocation] = useLocation();
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const activeToken = getActiveInstagramToken();

  useEffect(() => {
    const loadMedia = async () => {
      setLoading(true);
      try {
        const instagramMedia = await getUserMedia(undefined, activeToken);
        setMedia(instagramMedia);
      } catch (error) {
        console.error("Failed to load media:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [activeToken]);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const refreshMedia = async () => {
    setLoading(true);
    try {
      const instagramMedia = await getUserMedia(undefined, activeToken);
      setMedia(instagramMedia);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>instagram</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/search")}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              data-testid="button-search"
              title="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLocation("/bookmarks")}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              data-testid="button-bookmarks"
              title="Saved posts"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              data-testid="button-dark-mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setLocation("/following")}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              data-testid="button-following"
              title="View people you follow"
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
              data-testid="button-profile"
              title="Go to profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
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
        ) : !activeToken ? (
          <div className="flex flex-col justify-center items-center h-96 text-center px-4">
            <p className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Instagram Account Not Connected</p>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connect your Instagram account to see your feed and posts.</p>
            <button
              onClick={() => setLocation("/profile/connect-instagram")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              data-testid="button-connect-instagram-home"
            >
              Connect Instagram
            </button>
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
