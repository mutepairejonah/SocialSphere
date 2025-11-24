import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation, useRoute } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";

interface FollowerUser {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isFollowing?: boolean;
}

export default function Followers() {
  const [, params] = useRoute("/followers/:userId");
  const { currentUser, toggleFollow } = useStore();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState<FollowerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<any>(null);

  const userId = params?.userId || currentUser?.id;

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!userId) return;
      try {
        // Fetch followers for the user
        const res = await fetch(`/api/followers/${userId}`);
        const data = await res.json();
        setFollowers(data);

        // Fetch user info to display who we're viewing followers for
        const userRes = await fetch(`/api/users/${userId}`);
        const userData = await userRes.json();
        setProfileUser(userData);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowers();
  }, [userId]);

  const filtered = followers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 max-w-2xl mx-auto min-h-screen bg-white">
      {/* Header - Telegram Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation(params?.userId ? `/user/${params.userId}` : "/profile")}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-semibold text-gray-900">Followers</h1>
          {profileUser && profileUser.id !== currentUser?.id && (
            <p className="text-xs text-gray-500">{profileUser.username}'s followers</p>
          )}
        </div>
      </header>

      <main>
        {/* Search */}
        <div className="p-4 border-b border-gray-200 sticky top-14 z-40 bg-white">
          <div className="relative">
            <Input
              placeholder="Search followers..."
              className="bg-gray-100 border-0 h-10 rounded-full focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-followers"
            />
          </div>
        </div>

        {/* Followers List - Telegram Style */}
        <div className="divide-y divide-gray-200">
          {!loading && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-sm">No followers yet</p>
            </div>
          ) : (
            filtered.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors"
                data-testid={`follower-${user.id}`}
              >
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => setLocation(`/user/${user.id}`)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 px-4 font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-full text-xs"
                    onClick={() => currentUser && toggleFollow(user.id)}
                    data-testid={`button-follow-${user.id}`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
                    onClick={() => setLocation("/messages")}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
