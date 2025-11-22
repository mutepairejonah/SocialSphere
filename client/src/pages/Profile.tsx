import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Grid, Settings, Bookmark, Menu, User as UserIcon } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Profile() {
  const { currentUser, isAuthenticated, logout } = useStore();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (!currentUser) return null;

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-[50px] flex items-center justify-between">
        <div className="flex items-center gap-1 cursor-pointer">
           <h1 className="font-bold text-xl">{currentUser.username}</h1>
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
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-bold text-lg leading-tight">12</div>
                <div className="text-sm text-foreground">Posts</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/followers")}
              >
                <div className="font-bold text-lg leading-tight">{currentUser.followers}</div>
                <div className="text-sm text-foreground">Followers</div>
              </div>
              <div 
                className="cursor-pointer hover:opacity-70"
                onClick={() => setLocation("/following")}
              >
                <div className="font-bold text-lg leading-tight">{currentUser.following}</div>
                <div className="text-sm text-foreground">Following</div>
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
              onClick={() => setLocation("/edit-profile")}
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

        {/* Highlights */}
        {currentUser.highlights && (
           <div className="flex gap-4 px-4 pb-4 overflow-x-auto no-scrollbar">
              {currentUser.highlights.map(highlight => (
                 <div key={highlight.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                    <div className="w-16 h-16 rounded-full border border-border p-[2px]">
                       <div className="w-full h-full rounded-full bg-muted overflow-hidden">
                          <img src={highlight.image} className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <span className="text-xs truncate max-w-[64px]">{highlight.title}</span>
                 </div>
              ))}
              <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                 <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                 </div>
                 <span className="text-xs">New</span>
              </div>
           </div>
        )}

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
          {activeTab === 'posts' && [...Array(12)].map((_, i) => (
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
