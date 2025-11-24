import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, MessageCircle, Share2, User, Moon, Sun, Bookmark, Zap } from "lucide-react";

// Sample posts data
const SAMPLE_POSTS = [
  {
    id: "1",
    username: "sarah_art",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
    caption: "Beautiful sunset at the beach 🌅",
    likes: 1240,
    comments: 45,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    username: "john_photos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=500&fit=crop",
    caption: "Weekend vibes ✨",
    likes: 892,
    comments: 32,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "3",
    username: "emma_travel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    image: "https://images.unsplash.com/photo-1488381394794-29353f5fab23?w=500&h=500&fit=crop",
    caption: "Exploring new places 🗺️",
    likes: 2150,
    comments: 78,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Sample stories data
const SAMPLE_STORIES = [
  {
    id: "1",
    username: "sarah_art",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    image: "https://images.unsplash.com/photo-1495805871991-aa4dc10de980?w=200&h=300&fit=crop",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "2",
    username: "john_photos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "3",
    username: "emma_travel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=300&fit=crop",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLiked = new Set(liked);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLiked(newLiked);
  };

  const toggleBookmark = (postId: string) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(postId)) {
      newBookmarked.delete(postId);
    } else {
      newBookmarked.add(postId);
    }
    setBookmarked(newBookmarked);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} border-b`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className={`text-3xl font-bold italic ${darkMode ? "text-white" : "text-black"}`} style={{fontFamily: "Grand Hotel"}}>
            InstaClone
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              data-testid="button-dark-mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className={`${darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} transition-colors`}
              data-testid="button-profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto">
        {/* Stories Section */}
        <div className={`${darkMode ? "bg-gray-800" : "bg-white"} px-4 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} sticky top-[60px] z-40`}>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {SAMPLE_STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => setLocation("/stories")}
                className="flex-shrink-0 relative group focus:outline-none"
                data-testid={`story-${story.id}`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-purple-500 to-pink-500 p-[2px] group-hover:shadow-lg transition-all">
                  <div className={`w-full h-full rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"} border-2 ${darkMode ? "border-gray-800" : "border-white"}`}>
                    <img src={story.avatar} alt={story.username} className="w-full h-full object-cover" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
          {SAMPLE_POSTS.map((post) => (
            <article key={post.id} className={darkMode ? "bg-gray-800" : "bg-white"} data-testid={`post-${post.id}`}>
              {/* Post Header */}
              <div className={`px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full" />
                  <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-black"}`}>{post.username}</span>
                </div>
                <button className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} data-testid={`button-more-${post.id}`}>
                  •••
                </button>
              </div>

              {/* Media */}
              <div className="bg-black w-full aspect-square overflow-hidden">
                <img src={post.image} alt={post.caption} className="w-full h-full object-cover" data-testid={`image-${post.id}`} />
              </div>

              {/* Actions */}
              <div className="px-4 py-3 flex gap-4">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`transition-colors ${liked.has(post.id) ? "text-red-500" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
                  data-testid={`button-like-${post.id}`}
                >
                  <Heart className="w-6 h-6" fill={liked.has(post.id) ? "currentColor" : "none"} />
                </button>
                <button className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} data-testid={`button-comment-${post.id}`}>
                  <MessageCircle className="w-6 h-6" />
                </button>
                <button className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"} data-testid={`button-share-${post.id}`}>
                  <Share2 className="w-6 h-6" />
                </button>
                <button
                  onClick={() => toggleBookmark(post.id)}
                  className={`ml-auto transition-colors ${bookmarked.has(post.id) ? "text-blue-500" : darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"}`}
                  data-testid={`button-bookmark-${post.id}`}
                >
                  <Bookmark className="w-6 h-6" fill={bookmarked.has(post.id) ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Likes */}
              <div className={`px-4 py-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-black"}`} data-testid={`likes-${post.id}`}>
                  {post.likes + (liked.has(post.id) ? 1 : 0)} likes
                </p>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 py-2">
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                    <span className={`font-semibold ${darkMode ? "text-white" : "text-black"}`}>{post.username}</span> {post.caption}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div className="px-4 py-2">
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} cursor-pointer hover:${darkMode ? "text-white" : "text-black"}`} data-testid={`comments-${post.id}`}>
                  View all {post.comments} comments
                </p>
              </div>

              {/* Timestamp */}
              <div className="px-4 pb-3">
                <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {post.timestamp.toLocaleDateString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}