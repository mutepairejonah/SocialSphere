import { BottomNav } from "@/components/BottomNav";
import { useStore } from "@/lib/store";
import { Heart, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Activity() {
  const notifications = useStore((state) => state.notifications);

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center">
        <h1 className="font-bold text-xl">Notifications</h1>
      </header>

      <main className="divide-y divide-border">
        <div className="p-4">
            <h2 className="font-semibold mb-4">New</h2>
            {notifications.map((notif) => (
              <div key={notif.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.userId}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-semibold">user_{notif.userId.slice(0,5)}</span>
                    {notif.type === 'like' && <span className="text-foreground"> liked your photo.</span>}
                    {notif.type === 'follow' && <span className="text-foreground"> started following you.</span>}
                    <span className="text-muted-foreground ml-1">{notif.timestamp}</span>
                  </div>
                </div>
                {notif.type === 'follow' ? (
                   <Button size="sm" className="h-8 px-4 font-semibold">Follow</Button>
                ) : (
                   <div className="w-10 h-10 bg-muted rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=100&auto=format&fit=crop&q=60" className="w-full h-full object-cover" />
                   </div>
                )}
              </div>
            ))}
        </div>
        
        <div className="p-4">
           <h2 className="font-semibold mb-4">Suggested for you</h2>
           {[1,2,3,4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3">
                 <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=sug${i}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="text-sm flex flex-col">
                    <span className="font-semibold">suggested_user_{i}</span>
                    <span className="text-xs text-muted-foreground">New to Instagram</span>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="h-8 px-4 font-semibold text-blue-500">Follow</Button>
              </div>
           ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
