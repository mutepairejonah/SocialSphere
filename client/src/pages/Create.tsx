import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { Menu, Home as HomeIcon, Compass, Plus, MessageCircle, User, LogOut, Settings, X, MapPin, Image as ImageIcon, ChevronRight, Film, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Create() {
  const [location, setLocation] = useLocation();
  const addPost = useStore((state) => state.addPost);
  const currentUser = useStore((state) => state.currentUser);
  const { logout } = useStore();
  const { toast } = useToast();
  const [caption, setCaption] = useState("");
  const [locationTag, setLocationTag] = useState("");
  const [step, setStep] = useState<'picker' | 'details'>('picker');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentMedia, setRecentMedia] = useState<{url: string, type: 'image' | 'video'}[]>([]);

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an image or video file"
      });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 100MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const mediaData = event.target?.result as string;
      setSelectedMedia(mediaData);
      setMediaType(isImage ? 'image' : 'video');
      setRecentMedia([{url: mediaData, type: isImage ? 'image' : 'video'}, ...recentMedia.slice(0, 19)]);
      setStep('details');
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!currentUser || !selectedMedia) return;

    setUploading(true);
    try {
      await addPost({
        userId: currentUser.id,
        imageUrl: selectedMedia,
        caption,
        location: locationTag || undefined,
      });
      
      toast({
        title: "Success",
        description: "Post uploaded successfully"
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to upload post"
      });
    } finally {
      setUploading(false);
    }
  };

  // Media picker flow
  if (step === 'picker') {
    return (
      <div className="flex min-h-screen bg-background">
        {/* White Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-64" : "w-0"
        )}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="font-bold text-2xl text-primary">Authentic</h1>
            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <nav className="flex-1 py-6 px-4 space-y-2">
            <button onClick={() => handleNavigation("/")} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors", location === "/" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100")}><HomeIcon className="w-5 h-5" /><span className="font-medium">Home</span></button>
            <button onClick={() => handleNavigation("/explore")} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors", location === "/explore" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100")}><Compass className="w-5 h-5" /><span className="font-medium">Explore</span></button>
            <button onClick={() => handleNavigation("/create")} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors", location === "/create" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100")}><Plus className="w-5 h-5" /><span className="font-medium">Create</span></button>
            <button onClick={() => handleNavigation("/messages")} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors", location === "/messages" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100")}><MessageCircle className="w-5 h-5" /><span className="font-medium">Messages</span></button>
            <button onClick={() => handleNavigation("/profile")} className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors", location === "/profile" ? "bg-primary/10 text-foreground" : "text-gray-700 hover:bg-gray-100")}><User className="w-5 h-5" /><span className="font-medium">Profile</span></button>
          </nav>
          <div className="border-t border-gray-200 p-4 space-y-2">
            <button onClick={() => handleNavigation("/profile/edit")} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"><Settings className="w-5 h-5" /><span className="font-medium">Settings</span></button>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><LogOut className="w-5 h-5" /><span className="font-medium">Logout</span></button>
          </div>
        </aside>
        <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "ml-64" : "ml-0")}>
          <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg transition-colors -ml-2"><Menu className="w-6 h-6" /></button>
            <h1 className="font-bold text-2xl select-none cursor-pointer text-primary">New Post</h1>
            <Button 
              className="text-primary font-bold hover:text-primary/80" 
              variant="ghost"
              disabled={!selectedMedia}
              onClick={() => setStep('details')}
            >
              Next
            </Button>
          </header>
          <div className="pb-20 flex-1 overflow-y-auto">
        
        {/* Preview Area */}
        <motion.div 
          className="aspect-square bg-muted relative flex items-center justify-center overflow-hidden"
          layoutId="mediaPreview"
        >
          {selectedMedia ? (
            mediaType === 'image' ? (
              <img src={selectedMedia} className="w-full h-full object-cover" alt="Selected" />
            ) : (
              <video src={selectedMedia} className="w-full h-full object-cover" controls />
            )
          ) : (
            <div className="text-muted-foreground flex flex-col items-center">
              <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
              <span>Select a photo or video</span>
            </div>
          )}
        </motion.div>

        {/* Gallery and Upload */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="p-3 border-b border-border space-y-3">
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,video/*" 
              onChange={handleMediaSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              Upload from Device
            </button>
          </div>

          {/* Recent/Suggested */}
          {recentMedia.length > 0 && (
            <div className="p-3 border-b border-border">
              <h4 className="text-sm font-semibold mb-2">Recent</h4>
              <div className="grid grid-cols-4 gap-1">
                {recentMedia.map((media, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-sm overflow-hidden border-2 transition-all relative ${
                      selectedMedia === media.url ? 'border-blue-500' : 'border-border'
                    }`}
                    onClick={() => {
                      setSelectedMedia(media.url);
                      setMediaType(media.type);
                    }}
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} className="w-full h-full object-cover" loading="lazy" alt="Recent" />
                    ) : (
                      <>
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Film className="w-4 h-4 text-white" />
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Gallery */}
          <div className="p-3">
            <h4 className="text-sm font-semibold mb-2">Suggestions</h4>
            <div className="grid grid-cols-4 gap-1">
              {[...Array(20)].map((_, i) => {
                const imgUrl = `https://images.unsplash.com/photo-${1500000000000 + (i * 10)}?w=800&auto=format&fit=crop&q=60`;
                return (
                  <button 
                    key={i} 
                    className={`aspect-square bg-muted rounded-sm overflow-hidden border-2 transition-all ${
                      selectedMedia === imgUrl ? 'border-blue-500' : 'border-border'
                    }`}
                    onClick={() => {
                      setSelectedMedia(imgUrl);
                      setMediaType('image');
                      setStep('details');
                    }}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" loading="lazy" alt="Suggestion" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
          </div>
        </div>
        <BottomNav onMenuClick={() => setSidebarOpen(true)} />
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setStep('picker')} disabled={uploading}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-bold text-lg">New Post</h1>
        </div>
        <Button 
          variant="ghost" 
          className="text-blue-500 font-bold hover:text-blue-600 disabled:opacity-50" 
          onClick={handlePost}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Share"}
        </Button>
      </header>

      <main className="p-4 space-y-6">
        <div className="flex gap-4 items-start">
          <motion.div 
            className="w-16 h-16 bg-muted rounded-sm flex-shrink-0 overflow-hidden"
            layoutId="mediaPreview"
          >
            {selectedMedia && mediaType === 'image' ? (
              <img src={selectedMedia} className="w-full h-full object-cover" alt="Preview" />
            ) : selectedMedia ? (
              <>
                <video src={selectedMedia} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Film className="w-4 h-4 text-white" />
                </div>
              </>
            ) : null}
          </motion.div>
          <Textarea 
            placeholder="Write a caption..." 
            className="flex-1 border-0 resize-none focus-visible:ring-0 p-0 h-20 text-base disabled:opacity-50"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={uploading}
            autoFocus
          />
        </div>

        <div className="divide-y divide-border border-t border-b border-border -mx-4 px-4">
          <div className="flex items-center justify-between py-3.5 cursor-pointer opacity-50">
            <span className="text-base">Tag People</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="py-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">Add Location</span>
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {["San Francisco", "Union Square", "Golden Gate Bridge", "Sausalito"].map(loc => (
                <button 
                  key={loc} 
                  className={`px-3 py-1.5 rounded-full text-sm border whitespace-nowrap transition-colors disabled:opacity-50 ${locationTag === loc ? 'bg-blue-500 text-white border-transparent' : 'border-border text-foreground bg-muted/30'}`}
                  onClick={() => setLocationTag(loc)}
                  disabled={uploading}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-3.5 cursor-pointer opacity-50">
            <span className="text-base">Add Music</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </main>
    </div>
  );
}
