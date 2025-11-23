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
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-background/98 to-background/98 backdrop-blur-xl border-b-2 border-gradient-to-r from-blue-400/30 to-pink-400/30 px-4 h-16 flex items-center">
        <div>
          <h1 className="font-black text-2xl bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Activity</h1>
          <p className="text-xs text-muted-foreground">Your notification hub</p>
        </div>
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
                      className="h-8 px-5 font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white"
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
  
  const getNotifGradient = (type: string) => {
    switch(type) {
      case 'like': return 'from-red-400/20 to-pink-400/20 border-red-400/30';
      case 'follow': return 'from-blue-400/20 to-cyan-400/20 border-blue-400/30';
      case 'message': return 'from-purple-400/20 to-pink-400/20 border-purple-400/30';
      default: return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
    }
  };
  
  return (
    <div className={`flex items-center justify-between py-3 px-4 mx-2 my-2 rounded-2xl bg-gradient-to-br ${getNotifGradient(notification.type)} border hover:border-opacity-100 border-opacity-50 transition-all cursor-pointer hover:shadow-md group`}>
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-blue-400/30 group-hover:ring-blue-400/60 transition-all">
          <AvatarImage src={fromUser?.avatar || notification.userAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-sm leading-snug pr-2 flex-1">
          <span className="font-bold mr-1 text-foreground">{fromUser?.username || notification.fromUserId || 'User'}</span>
          {notification.type === 'like' && <span className="text-foreground">❤️ liked your photo</span>}
          {notification.type === 'comment' && <span className="text-foreground">💬 commented on your post</span>}
          {notification.type === 'follow' && <span className="text-foreground">👤 started following you</span>}
          {notification.type === 'message' && <span className="text-foreground">💌 sent you a message</span>}
          <span className="text-muted-foreground ml-2 text-xs">{notification.timestamp}</span>
        </div>
      </div>
      
      {notification.type === 'follow' ? (
         <Button size="sm" className="h-8 px-4 font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full text-xs">Follow</Button>
      ) : notification.type === 'message' ? (
         <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-xl overflow-hidden border border-background flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
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
