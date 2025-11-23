import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CreateStory() {
  const { currentUser } = useStore();
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
      // Add story to database
      const newStory = {
        id: `story_${Date.now()}`,
        userId: currentUser.id,
        imageUrl: imageUrl,
        isViewed: false,
        timestamp: new Date().toISOString()
      };

      // In a real app, this would be saved to Firebase
      // For now, we'll show a success message
      toast.success("Story posted! 📸");
      setTimeout(() => {
        setLocation("/");
      }, 500);
    } catch (error) {
      toast.error("Failed to post story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">Create Story</h1>
        <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4 space-y-4">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-border">
          {imageUrl ? (
            <img src={imageUrl} alt="Story preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Upload className="w-12 h-12 opacity-50" />
              <p className="text-sm">Click to add image</p>
            </div>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          data-testid="button-select-image"
        >
          Select Image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold">Story Info</label>
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Username:</span> {currentUser.username}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Visibility:</span> Visible to followers
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Duration:</span> Expires in 24 hours
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handlePostStory}
            disabled={!imageUrl || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="button-post-story"
          >
            {loading ? "Posting..." : "Post Story"}
          </Button>
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="w-full"
            data-testid="button-cancel-story"
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
