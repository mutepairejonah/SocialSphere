import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { getUserProfile } from "@/lib/instagram";

export default function Profile() {
  const { currentUser, logout } = useStore();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const instagramProfile = await getUserProfile();
        setProfile(instagramProfile);
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
            <div className="flex gap-8 items-center">
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
                <div>
                  <h2 className="text-2xl font-semibold" data-testid="text-username">
                    {profile.name || currentUser?.username}
                  </h2>
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

            {/* Bio */}
            {profile.biography && (
              <div data-testid="text-bio">
                <p className="text-sm whitespace-pre-wrap">{profile.biography}</p>
              </div>
            )}

            {/* Website */}
            {profile.website && (
              <div>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                  data-testid="link-website"
                >
                  {profile.website}
                </a>
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
