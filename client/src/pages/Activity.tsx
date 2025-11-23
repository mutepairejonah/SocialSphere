import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState } from "react";
import { Menu, Home as HomeIcon, Compass, Plus, MessageCircle, User, LogOut, Settings, X } from "lucide-react";

export default function Activity() {
  const { notifications, allUsers, toggleFollow, logout } = useStore();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Group by timeframe (mock logic)
  const newNotifs = notifications.filter(n => !n.read);
  const oldNotifs = notifications.filter(n => n.read);
  
  // Get suggested users (not yet followed)
  const suggestedUsers = allUsers.filter(u => !u.isFollowing).slice(0, 3);

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* White Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 overflow-hidden",
        sidebarOpen ? "w-64" : "w-0"
      )}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="font-bold text-2xl text-primary">Authentic</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <button
            onClick={() => handleNavigation("/")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => handleNavigation("/explore")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/explore" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Compass className="w-5 h-5" />
            <span className="font-medium">Explore</span>
          </button>
          <button
            onClick={() => handleNavigation("/create")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/create" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create</span>
          </button>
          <button
            onClick={() => handleNavigation("/messages")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/messages" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </button>
          <button
            onClick={() => handleNavigation("/profile")}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors",
              location === "/profile" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </button>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/profile/edit")}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors -ml-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-2xl select-none cursor-pointer text-primary">Activity</h1>
          <div className="w-6"></div>
        </header>

        {/* Main Content */}
        <main className="pb-20 flex-1 overflow-y-auto divide-y divide-border/0">
        {newNotifs.length > 0 && (
          <div className="pt-4 pb-2">
            <h2 className="font-bold px-4 mb-3 text-base">New</h2>
            {newNotifs.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
          </div>
        )}
        
        <div className="pt-4 pb-2">
           <h2 className="font-bold px-4 mb-3 text-base">This Week</h2>
           {oldNotifs.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))}
           {/* Suggestions from real users */}
           {suggestedUsers.length > 0 && (
             <div className="mt-6">
               <h2 className="font-bold px-4 mb-3 text-base">Suggested for you</h2>
               {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setLocation(`/user/${user.id}`)}>
                     <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-11 w-11 border border-border">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm flex flex-col">
                        <span className="font-semibold">{user.username}</span>
                        <span className="text-xs text-muted-foreground">{user.followers} followers</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-8 px-5 font-semibold bg-primary hover:bg-primary/90 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(user.id);
                      }}
                    >
                      Follow
                    </Button>
                  </div>
               ))}
             </div>
           )}
        </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav onMenuClick={() => setSidebarOpen(true)} />
    </div>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  const { allUsers } = useStore();
  const fromUser = allUsers.find(u => u.id === notification.fromUserId);
  
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors cursor-pointer border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-11 w-11 border border-border">
          <AvatarImage src={fromUser?.avatar || notification.userAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-sm leading-snug pr-2 flex-1">
          <span className="font-semibold mr-1">{fromUser?.username || notification.fromUserId || 'User'}</span>
          {notification.type === 'like' && <span className="text-foreground">liked your photo.</span>}
          {notification.type === 'comment' && <span className="text-foreground">commented on your post.</span>}
          {notification.type === 'follow' && <span className="text-foreground">started following you.</span>}
          {notification.type === 'message' && <span className="text-foreground">sent you a message.</span>}
          <span className="text-muted-foreground ml-1 text-xs">{notification.timestamp}</span>
        </div>
      </div>
      
      {notification.type === 'follow' ? (
         <Button size="sm" className="h-8 px-5 font-semibold bg-primary hover:bg-primary/90 text-white text-xs">Follow</Button>
      ) : notification.type === 'message' ? (
         <div className="w-11 h-11 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center text-foreground font-bold">
            💬
         </div>
      ) : (
         notification.postImage && <div className="w-11 h-11 bg-muted rounded-[4px] overflow-hidden border border-border">
            <img src={notification.postImage} className="w-full h-full object-cover" />
         </div>
      )}
    </div>
  )
}
