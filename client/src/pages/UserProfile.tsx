import { ArrowLeft, MoreHorizontal, MessageCircle } from "lucide-react";
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
  const { allUsers, toggleFollow, loadFollowStatus } = useStore();
  const [, setLocation] = useLocation();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

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

  const currentFollowState = isFollowing !== null ? isFollowing : user.isFollowing;

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-[50px] flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-bold text-xl">{user.username}</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-6 h-6" />
        </Button>
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
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center border-4 border-background text-white"
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
                <div className="font-bold text-lg leading-tight">8</div>
                <div className="text-sm text-foreground">Posts</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => {}}
              >
                <div className="font-bold text-lg leading-tight">{user.followers}</div>
                <div className="text-sm text-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">{user.following}</div>
                <div className="text-sm text-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="font-bold text-sm">{user.fullName}</h2>
            <p className="text-sm whitespace-pre-line leading-snug">{user.bio}</p>
            {user.website && (
              <a href="#" className="text-xs text-blue-600 hover:underline">{user.website}</a>
            )}
          </div>

          <div className="flex gap-2">
            <motion.div 
              className="flex-1"
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="w-full font-semibold h-10 text-sm"
                onClick={handleFollowToggle}
                variant={currentFollowState ? "secondary" : "default"}
              >
                <motion.span
                  key={currentFollowState ? "following" : "follow"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentFollowState ? "Following" : "Follow"}
                </motion.span>
              </Button>
            </motion.div>
            <Button className="flex-1 font-semibold h-10 text-sm" variant="secondary">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="border-t border-border mt-2" />
        <div className="grid grid-cols-3 gap-0.5 pb-4">
          {[...Array(9)].map((_, i) => (
            <motion.div 
              key={i}
              className="aspect-square bg-muted relative group cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + (i * 5)}?w=300&auto=format&fit=crop&q=60`} 
                className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
