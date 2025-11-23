import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function CreateStory() {
  const { currentUser, addStory } = useStore();
  const [, setLocation] = useLocation();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    setLocation("/login");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostStory = async () => {
    if (!imageUrl) {
      toast.error("Please select an image for your story");
      return;
    }

    setLoading(true);
    try {
      await addStory(imageUrl);
      toast.success("Story shared! 📸");
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
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">Your Story</h1>
        <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 space-y-3">
        {/* Story Preview - Instagram style */}
        <div className="aspect-[9/16] bg-gradient-to-b from-muted to-muted/50 rounded-2xl overflow-hidden flex items-center justify-center border border-border shadow-lg">
          {imageUrl ? (
            <img src={imageUrl} alt="Story preview" className="w-full h-full object-cover" />
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
          className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all active:scale-95"
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
        {imageUrl && (
          <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.id}`} alt={currentUser.username} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-sm">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">Expires in 24h</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handlePostStory}
            disabled={!imageUrl || loading}
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
