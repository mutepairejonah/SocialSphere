import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { ArrowLeft, LogOut, Loader2, Edit2, Grid3X3, Bookmark, Link2, Plus, Trash2, Check, Zap } from "lucide-react";
import { getUserProfile, getUserMedia } from "@/lib/instagram";

export default function Profile() {
  const { currentUser, logout, darkMode, getActiveInstagramToken, switchInstagramAccount, removeInstagramAccount } = useStore();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const activeToken = getActiveInstagramToken();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const instagramProfile = await getUserProfile('me', activeToken);
        setProfile(instagramProfile);
        
        const instagramMedia = await getUserMedia(undefined, activeToken);
        setMedia(instagramMedia);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [activeToken]);

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`} data-testid="text-profile-title">{currentUser?.username}</h1>
          <button
            onClick={handleLogout}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
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
        ) : !activeToken ? (
          <div className="flex flex-col justify-center items-center h-96 text-center px-4">
            <p className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Instagram Account Not Connected</p>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connect your Instagram account to view your profile and manage accounts.</p>
            <button
              onClick={() => setLocation("/profile/connect-instagram")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              data-testid="button-connect-instagram-profile"
            >
              Connect Instagram
            </button>
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`} data-testid="text-username">
                      {profile.name || currentUser?.username}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLocation("/stories")}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        data-testid="button-view-stories"
                        title="View your stories"
                      >
                        <Zap className="w-4 h-4" />
                        Stories
                      </button>
                      <button
                        onClick={() => setLocation("/profile/edit")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        data-testid="button-edit-profile"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowAccountMenu(!showAccountMenu)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-fit text-sm"
                      data-testid="button-accounts-menu"
                    >
                      <Plus className="w-4 h-4" />
                      {currentUser?.instagramAccounts?.length ? 'Manage Accounts' : 'Connect Instagram'}
                    </button>
                    
                    {showAccountMenu && currentUser?.instagramAccounts && currentUser.instagramAccounts.length > 0 && (
                      <div className={`border rounded-lg p-3 space-y-2 ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                        {currentUser.instagramAccounts.map((acc, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-2 rounded ${idx === (currentUser.activeInstagramAccountId || 0) ? (darkMode ? 'bg-gray-700' : 'bg-blue-100') : ''}`}>
                            <button
                              onClick={() => switchInstagramAccount(idx)}
                              className={`flex-1 text-left flex items-center gap-2 text-sm ${idx === (currentUser.activeInstagramAccountId || 0) ? 'font-semibold' : ''}`}
                              data-testid={`button-account-${idx}`}
                            >
                              {idx === (currentUser.activeInstagramAccountId || 0) && <Check className="w-4 h-4 text-blue-500" />}
                              {acc.accountName}
                            </button>
                            <button
                              onClick={() => removeInstagramAccount(idx)}
                              className={`text-red-500 hover:text-red-700 p-1 ${currentUser.instagramAccounts.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={currentUser.instagramAccounts.length === 1}
                              data-testid={`button-delete-account-${idx}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setLocation("/profile/connect-instagram")}
                          className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 py-1"
                          data-testid="button-add-another-account"
                        >
                          + Add Another Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 text-sm">
                  <div data-testid="stat-posts">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{profile.media_count || 0}</span>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>posts</p>
                  </div>
                  <div data-testid="stat-followers">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{profile.followers_count || 0}</span>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>followers</p>
                  </div>
                  <div data-testid="stat-following">
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{profile.follows_count || 0}</span>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>following</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6 space-y-3`}>
              {profile.biography && (
                <div data-testid="text-bio">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Bio</p>
                  <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{profile.biography}</p>
                </div>
              )}

              {currentUser?.bio && (
                <div data-testid="text-user-bio">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Personal Bio</p>
                  <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser.bio}</p>
                </div>
              )}
            </div>

            {/* Website Section */}
            <div className="space-y-3">
              {profile.website && (
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Website</p>
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
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Personal Website</p>
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
            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-8`}>
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`py-4 px-4 flex items-center gap-2 transition-colors border-t-2 ${
                    activeTab === "posts"
                      ? darkMode ? "border-white text-white" : "border-gray-900 text-gray-900"
                      : darkMode ? "border-transparent text-gray-400 hover:text-white" : "border-transparent text-gray-600 hover:text-gray-800"
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
                      ? darkMode ? "border-white text-white" : "border-gray-900 text-gray-900"
                      : darkMode ? "border-transparent text-gray-400 hover:text-white" : "border-transparent text-gray-600 hover:text-gray-800"
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
                  <div className={`flex justify-center items-center h-96 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p>No posts yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className={`aspect-square ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden hover:opacity-80 transition-opacity cursor-pointer group relative`}
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
                <div className={`flex justify-center items-center h-96 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <p>No saved posts yet</p>
                </div>
              </div>
            )}
          </div>
        ) : profile ? null : (
          <div className={`flex justify-center items-center h-96 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p>Failed to load profile</p>
          </div>
        )}
      </main>
    </div>
  );
}
