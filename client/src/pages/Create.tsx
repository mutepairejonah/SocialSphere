import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { ArrowLeft, MapPin, Image as ImageIcon } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Create() {
  const [, setLocation] = useLocation();
  const addPost = useStore((state) => state.addPost);
  const currentUser = useStore((state) => state.currentUser);
  const [caption, setCaption] = useState("");
  const [locationTag, setLocationTag] = useState("");

  const handlePost = () => {
    if (!currentUser) return;
    
    addPost({
      userId: currentUser.id,
      imageUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100)}?w=800&auto=format&fit=crop&q=60`,
      caption,
      location: locationTag || undefined,
    });
    setLocation("/");
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-bold text-lg">New Post</h1>
        </div>
        <Button variant="ghost" className="text-blue-500 font-bold" onClick={handlePost}>
          Share
        </Button>
      </header>

      <main className="p-4 space-y-6">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center border border-border">
             <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <Textarea 
            placeholder="Write a caption..." 
            className="flex-1 border-0 resize-none focus-visible:ring-0 p-0 h-20"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="space-y-0 border-t border-border">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-base">Add Location</span>
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
             {["San Francisco", "New York", "Paris", "Tokyo"].map(loc => (
               <button 
                 key={loc} 
                 className={`px-3 py-1 rounded-full text-xs border ${locationTag === loc ? 'bg-foreground text-background border-transparent' : 'border-border text-muted-foreground'}`}
                 onClick={() => setLocationTag(loc)}
               >
                 {loc}
               </button>
             ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
