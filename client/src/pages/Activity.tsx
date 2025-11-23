import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function Activity() {
  const { notifications, allUsers, toggleFollow } = useStore();
  const [, setLocation] = useLocation();

  // Group by timeframe (mock logic)
  const newNotifs = notifications.filter(n => !n.read);
  const oldNotifs = notifications.filter(n => n.read);
  
  // Get suggested users (not yet followed)
  const suggestedUsers = allUsers.filter(u => !u.isFollowing).slice(0, 3);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-xl">Activity</h1>
      </header>

      <main className="divide-y divide-border/0">
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
         <div className="w-11 h-11 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center text-foreground font-bold">
            ❤️
         </div>
      )}
    </div>
  );
}
