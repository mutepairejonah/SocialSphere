import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut, Loader2, Edit2, Grid3X3, Bookmark } from "lucide-react";
import { getUserProfile, getUserMedia } from "@/lib/instagram";

export default function Profile() {
  const { currentUser, logout } = useStore();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const instagramProfile = await getUserProfile();
        setProfile(instagramProfile);
        
        const instagramMedia = await getUserMedia();
        setMedia(instagramMedia);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
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
          <button
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">{currentUser?.username}</h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-black transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex gap-8 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                {profile.profile_picture_url && (
                  <img
                    src={profile.profile_picture_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    data-testid="img-avatar"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold" data-testid="text-username">
                    {profile.name || currentUser?.username}
                  </h2>
                  <button
                    onClick={() => setLocation("/profile/edit")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    data-testid="button-edit-profile"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 text-sm">
                  <div data-testid="stat-posts">
                    <span className="font-semibold">{profile.media_count || 0}</span>
                    <p className="text-gray-600">posts</p>
                  </div>
                  <div data-testid="stat-followers">
                    <span className="font-semibold">{profile.followers_count || 0}</span>
                    <p className="text-gray-600">followers</p>
                  </div>
                  <div data-testid="stat-following">
                    <span className="font-semibold">{profile.follows_count || 0}</span>
                    <p className="text-gray-600">following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              {profile.biography && (
                <div data-testid="text-bio">
                  <p className="text-sm font-medium text-gray-700 mb-1">Bio</p>
                  <p className="text-sm whitespace-pre-wrap text-gray-600">{profile.biography}</p>
                </div>
              )}

              {currentUser?.bio && (
                <div data-testid="text-user-bio">
                  <p className="text-sm font-medium text-gray-700 mb-1">Personal Bio</p>
                  <p className="text-sm whitespace-pre-wrap text-gray-600">{currentUser.bio}</p>
                </div>
              )}
            </div>

            {/* Website Section */}
            <div className="space-y-3">
              {profile.website && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Website</p>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm break-all"
                    data-testid="link-instagram-website"
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              {currentUser?.website && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Personal Website</p>
                  <a
                    href={currentUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm break-all"
                    data-testid="link-personal-website"
                  >
                    {currentUser.website}
                  </a>
                </div>
              )}
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200 mt-8">
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`py-4 px-4 flex items-center gap-2 transition-colors border-t-2 ${
                    activeTab === "posts"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                  data-testid="tab-posts"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Posts</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`py-4 px-4 flex items-center gap-2 transition-colors border-t-2 ${
                    activeTab === "saved"
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                  data-testid="tab-saved"
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm font-medium">Saved</span>
                </button>
              </div>
            </div>

            {/* Posts Grid Tab */}
            {activeTab === "posts" && (
              <div className="mt-6">
                {media.length === 0 ? (
                  <div className="flex justify-center items-center h-96 text-gray-400">
                    <p>No posts yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square bg-gray-100 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer group relative"
                        data-testid={`media-grid-${item.id}`}
                      >
                        {item.media_type === "VIDEO" ? (
                          <video
                            src={item.media_url}
                            className="w-full h-full object-cover"
                            data-testid={`grid-video-${item.id}`}
                          />
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.caption || "Instagram post"}
                            className="w-full h-full object-cover"
                            data-testid={`grid-image-${item.id}`}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">{item.like_count || 0}</span>
                              <span className="text-xs">❤️</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold">{item.comments_count || 0}</span>
                              <span className="text-xs">💬</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Tab */}
            {activeTab === "saved" && (
              <div className="mt-6">
                <div className="flex justify-center items-center h-96 text-gray-400">
                  <p>No saved posts yet</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-96 text-gray-400">
            <p>Failed to load profile</p>
          </div>
        )}
      </main>
    </div>
  );
}
