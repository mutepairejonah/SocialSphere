import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { useLocation, useRoute } from "wouter";
import { BottomNav } from "@/components/BottomNav";

export default function UserProfile() {
  const [, params] = useRoute("/user/:id");
  const { getUser, toggleFollow } = useStore();
  const [, setLocation] = useLocation();

  const user = getUser(params?.id || "");

  if (!user) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    );
  }

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
            <div className="w-20 h-20 rounded-full p-[2px] border border-border">
              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div>
                <div className="font-bold text-lg leading-tight">8</div>
                <div className="text-sm text-foreground">Posts</div>
              </div>
              <div>
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
            <Button 
              className="flex-1 font-semibold h-8 text-sm"
              onClick={() => toggleFollow(user.id)}
              variant={user.isFollowing ? "secondary" : "default"}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
            <Button className="flex-1 font-semibold h-8 text-sm" variant="secondary">
              Message
            </Button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="border-t border-border mt-2" />
        <div className="grid grid-cols-3 gap-0.5 pb-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted relative group cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + (i * 5)}?w=300&auto=format&fit=crop&q=60`} 
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
