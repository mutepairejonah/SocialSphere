import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, Link } from "wouter";
import { LogOut, Settings, Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Activity() {
  const { notifications, currentUser, logout } = useStore();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  // Group by timeframe (mock logic)
  const newNotifs = notifications.filter(n => !n.read);
  const oldNotifs = notifications.filter(n => n.read);

  return (
    <div className="pb-20 min-h-screen bg-[#f0f2f5]">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-2 sm:px-4 py-1.5 flex items-center justify-between">
          {/* Logo */}
          <div className="text-lg font-bold text-[#1877F2] whitespace-nowrap">Authentic</div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-700" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setLocation("/profile")}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="button-settings"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-700" />
            </button>

            {/* Notifications */}
            <Link href="/activity">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" data-testid="button-notifications">
                <Heart className="w-4 h-4 text-gray-700" />
              </button>
            </Link>

            {/* Messages */}
            <Link href="/messages">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors relative" data-testid="button-messages">
                <Send className="w-4 h-4 text-gray-700 -rotate-[15deg]" />
              </button>
            </Link>

            {/* Profile Avatar */}
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#1877F2] cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Activity Title */}
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-3 border-b border-gray-200 bg-white">
        <h1 className="font-bold text-lg">Activity</h1>
      </div>

      <main className="max-w-2xl mx-auto divide-y divide-gray-200 bg-white">
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
           {oldNotifs.length > 0 ? (
            oldNotifs.map((notif) => (
              <NotificationItem key={notif.id} notification={notif} />
            ))
           ) : (
            <div className="py-6 px-4 text-center text-gray-500 text-sm">
              No activity yet
            </div>
           )}
        </div>
      </main>

      <BottomNav />
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
          {notification.type === 'message' && <span className="text-foreground">sent you a message.</span>}
          <span className="text-muted-foreground ml-1 text-xs">{notification.timestamp}</span>
        </div>
      </div>
      
      {notification.type === 'message' ? (
         <div className="w-11 h-11 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center text-foreground font-bold">
            💬
         </div>
      ) : (
         <div className="w-11 h-11 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center text-foreground font-bold">
            ❤️
         </div>
      )}
    </div>
  );
}
