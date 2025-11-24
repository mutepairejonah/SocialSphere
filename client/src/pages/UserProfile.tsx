import { ArrowLeft, MessageCircle, Grid, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useLocation, useRoute } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "@/lib/store";

export default function UserProfile() {
  const [, params] = useRoute("/user/:id");
  const { allUsers, currentUser, logout } = useStore();
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // API key owner's user ID
  const API_KEY_OWNER_ID = 'dbcMML2G74Rl4YKhT8VupNOSlDo1';

  useEffect(() => {
    const loadUser = async () => {
      if (params?.id && allUsers.length > 0) {
        const foundUser = allUsers.find(u => u.id === params.id);
        if (foundUser) {
          const followStatus = await loadFollowStatus(foundUser.id);
          setUser({ ...foundUser, isFollowing: followStatus });
        }
      }
    };
    loadUser();
  }, [params?.id, allUsers, loadFollowStatus]);

  // Block access to API key owner's profile
  if (params?.id === API_KEY_OWNER_ID) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-bold">Profile Restricted</h2>
          <p className="text-muted-foreground">This profile is not available for viewing.</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

  const handleFollowToggle = () => {
    setIsFollowing(!user.isFollowing);
    setTimeout(() => {
      toggleFollow(user.id);
      setIsFollowing(null);
    }, 200);
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-white">
      {/* Telegram-style Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/")}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
        <h1 className="font-semibold text-gray-900">{user.username}</h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="button-user-menu"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 text-sm">
                Report User
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm" onClick={() => setShowMenu(false)}>
                Block User
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Profile Info */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-border">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              {currentFollowState && (
                <motion.div 
                  className="absolute bottom-0 right-0 bg-primary rounded-full w-6 h-6 flex items-center justify-center border-4 border-background text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <span className="text-xs font-bold">✓</span>
                </motion.div>
              )}
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div>
                <div className="font-bold text-lg leading-tight">0</div>
                <div className="text-sm text-foreground">Posts</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="font-bold text-sm">{user.fullName}</h2>
            <p className="text-sm whitespace-pre-line leading-snug">{user.bio}</p>
            {user.website && (
              <a href="#" className="text-xs text-primary hover:underline">{user.website}</a>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 font-semibold h-10 text-sm bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setLocation("/messages")}
              data-testid="button-message"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-t border-border mt-2" />
        <div className="grid grid-cols-3 gap-0.5 pb-4">
          <div className="col-span-3 py-20 flex flex-col items-center text-muted-foreground">
            <Grid className="w-16 h-16 stroke-1 mb-4" />
            <h3 className="text-xl font-bold text-foreground">No Posts</h3>
            <p className="text-sm">This user hasn't posted yet</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
