import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";

interface FollowingUser {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

export default function Following() {
  const { currentUser, toggleFollow } = useStore();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!currentUser) return;
      try {
        const res = await fetch(`/api/following/${currentUser.id}`);
        const data = await res.json();
        setFollowing(data);
      } catch (error) {
        console.error("Error fetching following:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowing();
  }, [currentUser]);
  
  const filtered = following.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnfollow = (userId: string) => {
    currentUser && toggleFollow(userId);
    setFollowing(following.filter(u => u.id !== userId));
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-bold text-lg">Following</h1>
      </header>

      <main>
        {/* Search */}
        <div className="p-4 border-b border-border sticky top-14 z-40 bg-background">
          <Input 
            placeholder="Search..." 
            className="bg-muted/50 border-0 h-9 rounded-xl focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Following List */}
        <div className="divide-y divide-border">
          {!loading && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p>You haven't followed anyone yet</p>
            </div>
          ) : (
            filtered.map((user) => (
              <motion.div 
                key={user.id}
                className="flex items-center justify-between py-3 px-4 hover:bg-muted/30 transition-colors"
                initial={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setLocation(`/user/${user.id}`)}
                >
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-muted-foreground text-xs">{user.fullName}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="h-8 px-3 font-semibold"
                    variant="secondary"
                    onClick={() => setLocation(`/messages?user=${user.id}`)}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 px-4 font-semibold bg-primary hover:bg-primary/90 text-white"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
