import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const SAMPLE_USER = {
  username: "instaclone_user",
  name: "InstaClone User",
  bio: "Welcome to InstaClone - A beautiful social media feed",
  website: "https://instaclone.example.com",
  followers: 1240,
  following: 567,
  posts: 48,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=instaclone",
};

export default function Profile() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => setLocation("/")} className="text-gray-600 hover:text-black transition-colors" data-testid="button-back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">{SAMPLE_USER.username}</h1>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex gap-8 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
              <img src={SAMPLE_USER.avatar} alt={SAMPLE_USER.name} className="w-full h-full object-cover" data-testid="img-avatar" />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-black" data-testid="text-username">
                  {SAMPLE_USER.name}
                </h2>
                <p className="text-gray-600">@{SAMPLE_USER.username}</p>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-sm">
                <div data-testid="stat-posts">
                  <span className="font-semibold text-black">{SAMPLE_USER.posts}</span>
                  <p className="text-gray-600">posts</p>
                </div>
                <div data-testid="stat-followers">
                  <span className="font-semibold text-black">{SAMPLE_USER.followers}</span>
                  <p className="text-gray-600">followers</p>
                </div>
                <div data-testid="stat-following">
                  <span className="font-semibold text-black">{SAMPLE_USER.following}</span>
                  <p className="text-gray-600">following</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <p className="text-sm text-black">{SAMPLE_USER.bio}</p>
            {SAMPLE_USER.website && (
              <a href={SAMPLE_USER.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">
                {SAMPLE_USER.website}
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" data-testid="button-message">
              Message
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-6 py-2 rounded-lg font-medium transition-colors" data-testid="button-follow">
              Follow
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}