import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Grid, Bookmark, Menu, User as UserIcon, Bell, Lock, HelpCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export default function Profile() {
  const { currentUser, isAuthenticated, logout, posts } = useStore();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-background/98 to-background/98 backdrop-blur-xl border-b-2 border-gradient-to-r from-pink-400/30 to-yellow-400/30 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer">
           <h1 className="font-black text-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{currentUser.username}</h1>
        </div>
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
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-yellow-400 blur-lg opacity-30 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full p-[3px] border-2 border-gradient-to-r from-pink-400 to-yellow-400 cursor-pointer shadow-lg overflow-hidden">
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <div className="flex-1 flex justify-around text-center ml-6 gap-2">
              <div 
                className="cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-blue-100/40 to-blue-50/40 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl px-4 py-3 border border-blue-400/30 hover:border-blue-400/60"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-black text-xl text-blue-600 dark:text-blue-400">{posts.length}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Posts</div>
              </div>
              <div 
                className="cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-pink-100/40 to-pink-50/40 dark:from-pink-900/40 dark:to-pink-800/40 rounded-2xl px-4 py-3 border border-pink-400/30 hover:border-pink-400/60"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-black text-xl text-pink-600 dark:text-pink-400">{currentUser.followers}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Followers</div>
              </div>
              <div 
                className="cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-yellow-100/40 to-orange-50/40 dark:from-yellow-900/40 dark:to-orange-800/40 rounded-2xl px-4 py-3 border border-yellow-400/30 hover:border-yellow-400/60"
                onClick={() => setLocation("/following")}
              >
                <div className="font-black text-xl text-yellow-600 dark:text-yellow-400">{currentUser.following}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-5">
            <h2 className="font-bold text-sm">{currentUser.fullName}</h2>
            <p className="text-sm whitespace-pre-line leading-snug">{currentUser.bio}</p>
            {currentUser.website && (
              <a href="#" className="text-xs text-blue-600 hover:underline">{currentUser.website}</a>
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
                <div className="text-white font-semibold text-sm">{post.likes} likes</div>
              </div>
            </div>
          ))}
          {activeTab === 'posts' && posts.length === 0 && (
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
