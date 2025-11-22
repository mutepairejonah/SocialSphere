import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";

export default function Followers() {
  const { allUsers } = useStore();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filtered = allUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="font-bold text-lg">Followers</h1>
      </header>

      <main>
        {/* Search */}
        <div className="p-4 border-b border-border sticky top-14 z-40 bg-background">
          <Input 
            placeholder="Search..." 
            className="bg-muted/50 border-0 h-9 rounded-xl focus-visible:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Followers List */}
        <div className="divide-y divide-border">
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-3 px-4 hover:bg-muted/30 transition-colors">
              <div 
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => setLocation(`/user/${user.id}`)}
              >
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-muted-foreground">{user.fullName}</div>
                </div>
              </div>
              <Button 
                size="sm" 
                className="h-8 px-5 font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white"
                onClick={() => {}}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Follow
              </Button>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
