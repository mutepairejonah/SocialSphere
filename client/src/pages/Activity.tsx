import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Activity() {
  const notifications = useStore((state) => state.notifications);

  // Group by timeframe (mock logic)
  const newNotifs = notifications.filter(n => !n.read);
  const oldNotifs = notifications.filter(n => n.read);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-xl">Notifications</h1>
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
           {/* Mock suggestions */}
           <div className="mt-6">
             <h2 className="font-bold px-4 mb-3 text-base">Suggested for you</h2>
             {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors cursor-pointer">
                   <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sug${i}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="text-sm flex flex-col">
                      <span className="font-semibold">suggested_user_{i}</span>
                      <span className="text-xs text-muted-foreground">Followed by alex_travels + 2 more</span>
                    </div>
                  </div>
                  <Button size="sm" className="h-8 px-5 font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white">Follow</Button>
                </div>
             ))}
           </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/40 transition-colors cursor-pointer">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-11 w-11 border-2 border-border">
          <AvatarImage src={notification.userAvatar} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-sm leading-snug pr-2 flex-1">
          <span className="font-semibold mr-1">{notification.fromUserId}</span>
          {notification.type === 'like' && <span className="text-foreground">liked your photo.</span>}
          {notification.type === 'comment' && <span className="text-foreground">commented: "Great shot! 🔥"</span>}
          {notification.type === 'follow' && <span className="text-foreground">started following you.</span>}
          {notification.type === 'message' && <span className="text-foreground">sent you a message: <span className="italic">"{notification.messageText}"</span></span>}
          <span className="text-muted-foreground ml-1 text-xs">{notification.timestamp}</span>
        </div>
      </div>
      
      {notification.type === 'follow' ? (
         <Button size="sm" className="h-8 px-5 font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white">Follow</Button>
      ) : notification.type === 'message' ? (
         <div className="w-11 h-11 bg-blue-100 rounded-[4px] overflow-hidden border border-border flex items-center justify-center text-blue-500 font-bold">
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
