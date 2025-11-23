import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Grid, Bookmark, Menu, User as UserIcon, Bell, Lock, HelpCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

// API key owner ID - only they can see/fetch Instagram posts
const API_KEY_OWNER_ID = 'dbcMML2G74Rl4YKhT8VupNOSlDo1';

export default function Profile() {
  const { currentUser, isAuthenticated, logout, userPosts, loadUserPosts } = useStore();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (!currentUser) return null;

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-xl">{currentUser.username}</h1>
        <div className="relative" ref={menuRef}>
           <Menu className="w-6 h-6 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
           {showMenu && (
             <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
               <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted text-sm transition-colors text-foreground">
                 <Bell className="w-4 h-4" />
                 <span>Notifications</span>
               </button>
               <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted text-sm transition-colors text-foreground">
                 <Lock className="w-4 h-4" />
                 <span>Privacy & Security</span>
               </button>
               <button className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted text-sm transition-colors text-foreground">
                 <HelpCircle className="w-4 h-4" />
                 <span>Help & Support</span>
               </button>
               <div className="border-t border-border my-2"></div>
               <button onClick={handleLogout} className="w-full px-4 py-2 flex items-center gap-3 hover:bg-destructive/10 text-sm transition-colors text-destructive">
                 <LogOut className="w-4 h-4" />
                 <span>Logout</span>
               </button>
             </div>
           )}
        </div>
      </header>

      <main>
        {/* Profile Info */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-20 h-20 rounded-full border border-border cursor-pointer overflow-hidden">
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div>
                <div className="font-bold text-lg leading-tight">{userPosts.length}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-bold text-lg leading-tight">{currentUser.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => setLocation("/following")}
              >
                <div className="font-bold text-lg leading-tight">{currentUser.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="font-bold text-sm">{currentUser.fullName}</h2>
            <p className="text-sm whitespace-pre-line leading-snug">{currentUser.bio}</p>
            {currentUser.website && (
              <a href="#" className="text-xs text-primary hover:underline">{currentUser.website}</a>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              className="flex-1 font-semibold h-8 text-sm bg-primary text-primary-foreground hover:bg-primary/90" 
              onClick={() => setLocation("/profile/edit")}
            >
              Edit Profile
            </Button>
            <Button className="flex-1 font-semibold h-8 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Share Profile
            </Button>
            <Button size="icon" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90">
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
          {activeTab === 'posts' && userPosts.length > 0 && userPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-muted relative group cursor-pointer overflow-hidden">
              {post.mediaType === 'VIDEO' ? (
                <video src={post.videoUrl} className="w-full h-full object-cover" />
              ) : (
                <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white font-semibold text-sm">{post.likes} likes</div>
              </div>
            </div>
          ))}
          {activeTab === 'posts' && userPosts.length === 0 && (
            <div className="col-span-3 py-20 flex flex-col items-center text-muted-foreground">
              <Grid className="w-16 h-16 stroke-1 mb-4" />
              <h3 className="text-xl font-bold text-foreground">No Posts Yet</h3>
              <p className="text-sm">Your posts will appear here</p>
            </div>
          )}
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
