import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { ArrowLeft, MapPin, Image as ImageIcon, X, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";

export default function Create() {
  const [, setLocation] = useLocation();
  const addPost = useStore((state) => state.addPost);
  const currentUser = useStore((state) => state.currentUser);
  const [caption, setCaption] = useState("");
  const [locationTag, setLocationTag] = useState("");
  const [step, setStep] = useState<'picker' | 'details'>('picker');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePost = () => {
    if (!currentUser || !selectedImage) return;
    
    addPost({
      userId: currentUser.id,
      imageUrl: selectedImage,
      caption,
      location: locationTag || undefined,
    });
    setLocation("/");
  };

  // Mock image picker flow
  if (step === 'picker') {
     return (
        <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col">
           <header className="h-12 flex items-center justify-between px-4 border-b border-border">
              <X className="w-7 h-7 cursor-pointer" onClick={() => setLocation("/")} />
              <h1 className="font-bold text-lg">New Post</h1>
              <Button 
                variant="ghost" 
                className="text-blue-500 font-bold hover:text-blue-600" 
                disabled={!selectedImage}
                onClick={() => setStep('details')}
              >
                Next
              </Button>
           </header>
           
           {/* Preview Area */}
           <div className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden">
              {selectedImage ? (
                 <img src={selectedImage} className="w-full h-full object-cover" />
              ) : (
                 <div className="text-muted-foreground flex flex-col items-center">
                    <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                    <span>Select a photo</span>
                 </div>
              )}
           </div>

           {/* Gallery Grid */}
           <div className="flex-1 overflow-y-auto bg-background">
              <div className="flex items-center justify-between p-3 border-b border-border">
                 <span className="font-bold flex items-center gap-1">Gallery <ChevronRight className="w-4 h-4" /></span>
                 <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                 </div>
              </div>
              <div className="grid grid-cols-4 gap-0.5">
                 {[...Array(20)].map((_, i) => {
                    const imgUrl = `https://images.unsplash.com/photo-${1500000000000 + (i * 10)}?w=800&auto=format&fit=crop&q=60`;
                    return (
                       <div 
                         key={i} 
                         className={`aspect-square bg-muted cursor-pointer relative ${selectedImage === imgUrl ? 'opacity-50' : ''}`}
                         onClick={() => setSelectedImage(imgUrl)}
                       >
                          <img src={imgUrl} className="w-full h-full object-cover" loading="lazy" />
                       </div>
                    )
                 })}
              </div>
           </div>
           <BottomNav />
        </div>
     )
  }

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep('picker')}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-bold text-lg">New Post</h1>
        </div>
        <Button variant="ghost" className="text-blue-500 font-bold hover:text-blue-600" onClick={handlePost}>
          Share
        </Button>
      </header>

      <main className="p-4 space-y-6">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 bg-muted rounded-sm flex-shrink-0 overflow-hidden">
             <img src={selectedImage!} className="w-full h-full object-cover" />
          </div>
          <Textarea 
            placeholder="Write a caption..." 
            className="flex-1 border-0 resize-none focus-visible:ring-0 p-0 h-20 text-base"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            autoFocus
          />
        </div>

        <div className="divide-y divide-border border-t border-b border-border -mx-4 px-4">
          <div className="flex items-center justify-between py-3.5 cursor-pointer">
            <span className="text-base">Tag People</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="py-3.5">
            <div className="flex items-center justify-between mb-2 cursor-pointer">
               <span className="text-base">Add Location</span>
               <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
               {["San Francisco", "Union Square", "Golden Gate Bridge", "Sausalito"].map(loc => (
                 <button 
                   key={loc} 
                   className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap transition-colors ${locationTag === loc ? 'bg-blue-500 text-white border-transparent' : 'border-border text-foreground bg-muted/30'}`}
                   onClick={() => setLocationTag(loc)}
                 >
                   {loc}
                 </button>
               ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-3.5 cursor-pointer">
            <span className="text-base">Add Music</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </main>
    </div>
  );
}
