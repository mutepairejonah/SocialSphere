import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Grid, Settings, MapPin, Link as LinkIcon } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const { currentUser, isAuthenticated, logout } = useStore();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (!currentUser) return null;

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">{currentUser.username}</h1>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" onClick={() => { logout(); setLocation("/login"); }}>
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main>
        {/* Profile Info */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-20 h-20 rounded-full border border-border p-1">
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1 flex justify-around text-center ml-4">
              <div>
                <div className="font-bold text-lg">12</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-bold text-lg">{currentUser.followers}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-bold text-lg">{currentUser.following}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h2 className="font-bold">{currentUser.fullName}</h2>
            <p className="text-sm whitespace-pre-line">{currentUser.bio}</p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 font-semibold h-8 text-sm" variant="secondary">Edit Profile</Button>
            <Button className="flex-1 font-semibold h-8 text-sm" variant="secondary">Share Profile</Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border mt-2">
          <button className="flex-1 flex justify-center py-3 border-b-2 border-foreground">
            <Grid className="w-6 h-6" />
          </button>
          <button className="flex-1 flex justify-center py-3 text-muted-foreground">
            <MapPin className="w-6 h-6" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted relative">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=300&auto=format&fit=crop&q=60`} 
                className="w-full h-full object-cover"
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
