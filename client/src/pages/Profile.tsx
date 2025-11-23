import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Grid, Settings, Bookmark, Menu, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getUserProfile } from "@/lib/instagram";

interface InstagramProfile {
  id: string;
  name: string;
  biography: string;
  website: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export default function Profile() {
  const { currentUser, isAuthenticated, logout, posts } = useStore();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [igProfile, setIgProfile] = useState<InstagramProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      if (profile) {
        setIgProfile(profile);
      }
    };
    fetchProfile();
  }, []);

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (!currentUser) return null;

  // Use Instagram profile if available, otherwise use Firebase user
  const profile = igProfile || currentUser;

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-[50px] flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer">
           <h1 className="font-bold text-xl">{igProfile?.name || currentUser.username}</h1>
        </div>
        <div className="flex gap-5">
           <Menu className="w-6 h-6 cursor-pointer" onClick={() => { logout(); setLocation("/login"); }} />
        </div>
      </header>

      <main>
        {/* Profile Info */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-20 h-20 rounded-full p-[2px] border border-border cursor-pointer">
              <img src={igProfile?.profile_picture_url || currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-bold text-lg leading-tight">{igProfile?.media_count || posts.length}</div>
                <div className="text-sm text-foreground">Posts</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-bold text-lg leading-tight">{igProfile?.followers_count || currentUser.followers}</div>
                <div className="text-sm text-foreground">Followers</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/following")}
              >
                <div className="font-bold text-lg leading-tight">{igProfile?.follows_count || currentUser.following}</div>
                <div className="text-sm text-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="font-bold text-sm">{igProfile?.name || currentUser.fullName}</h2>
            <p className="text-sm whitespace-pre-line leading-snug">{igProfile?.biography || currentUser.bio}</p>
            {(igProfile?.website || currentUser.website) && (
              <a href="#" className="text-xs text-blue-600 hover:underline">{igProfile?.website || currentUser.website}</a>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 font-semibold h-8 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80" 
              variant="secondary"
              onClick={() => setLocation("/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button className="flex-1 font-semibold h-8 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="secondary">
              Share Profile
            </Button>
            <Button size="icon" className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="secondary">
               <UserIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Highlights - Coming soon */}

        {/* Tabs */}
        <div className="flex border-t border-border mt-2">
          <button 
            onClick={() => setActiveTab('posts')}
            className={cn(
              "flex-1 flex justify-center py-3 border-b-2 transition-colors",
              activeTab === 'posts' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            )}
          >
            <Grid className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={cn(
              "flex-1 flex justify-center py-3 border-b-2 transition-colors",
              activeTab === 'saved' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            )}
          >
            <Bookmark className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('tagged')}
            className={cn(
              "flex-1 flex justify-center py-3 border-b-2 transition-colors",
              activeTab === 'tagged' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            )}
          >
            <UserIcon className="w-6 h-6 border-2 border-current rounded-sm p-[1px]" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-0.5 pb-4">
          {activeTab === 'posts' && posts.length > 0 && posts.map((post) => (
            <div key={post.id} className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
              {post.mediaType === 'VIDEO' ? (
                <video src={post.videoUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white font-semibold">{post.likes} likes</div>
              </div>
            </div>
          ))}
          {activeTab === 'posts' && posts.length === 0 && [...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted relative group cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=300&auto=format&fit=crop&q=60`} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
          {activeTab === 'saved' && (
             <div className="col-span-3 py-20 flex flex-col items-center text-muted-foreground">
                <Bookmark className="w-16 h-16 stroke-1 mb-4" />
                <h3 className="text-xl font-bold text-foreground">Save</h3>
                <p className="text-sm">Save photos and videos that you want to see again.</p>
             </div>
          )}
           {activeTab === 'tagged' && (
             <div className="col-span-3 py-20 flex flex-col items-center text-muted-foreground">
                <UserIcon className="w-16 h-16 stroke-1 mb-4 border-2 border-current rounded-lg p-2" />
                <h3 className="text-xl font-bold text-foreground">Photos of you</h3>
                <p className="text-sm">When people tag you in photos, they'll appear here.</p>
             </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
