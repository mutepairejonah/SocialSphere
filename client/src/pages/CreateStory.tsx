import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Upload, ChevronDown, Play } from "lucide-react";
import { toast } from "sonner";

export default function CreateStory() {
  const { currentUser, addStory } = useStore();
  const [, setLocation] = useLocation();
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setMediaType(isVideo ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostStory = async () => {
    if (!mediaUrl) {
      toast.error(`Please select a ${mediaType} for your story`);
      return;
    }

    setLoading(true);
    try {
      await addStory(mediaUrl);
      toast.success(`Story shared! ${mediaType === 'video' ? '🎬' : '📸'}`);
      setTimeout(() => {
        setLocation("/");
      }, 300);
    } catch (error) {
      toast.error("Failed to post story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">Your Story</h1>
        <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 space-y-3">
        {/* Story Preview */}
        <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border shadow-sm relative">
          {mediaUrl ? (
            <>
              {mediaType === 'video' ? (
                <video src={mediaUrl} className="w-full h-full object-cover" controls />
              ) : (
                <img src={mediaUrl} alt="Story preview" className="w-full h-full object-cover" />
              )}
              {mediaType === 'video' && (
                <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full flex items-center gap-1">
                  <Play className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-semibold">Video</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="bg-muted-foreground/10 p-6 rounded-full">
                <Upload className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-sm font-medium">Tap to add photo or video</p>
            </div>
          )}
        </div>

        {/* Select Image Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors active:scale-95"
          data-testid="button-select-image"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Choose from library
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Story Details */}
        {mediaUrl && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} alt={currentUser.username} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">Expires in 24h • {mediaType === 'video' ? '🎬 Video Story' : '📸 Photo Story'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handlePostStory}
            disabled={!mediaUrl || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12 rounded-lg"
            data-testid="button-post-story"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Sharing...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Share to Story
              </>
            )}
          </Button>
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="w-full h-10"
            data-testid="button-cancel-story"
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
