import { ArrowLeft, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop",
  "https://images.unsplash.com/photo-1507514773390-0361f747e5ba?w=400&fit=crop",
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=400&fit=crop",
  "https://images.unsplash.com/photo-1519085360771-9852ef158dba?w=400&fit=crop",
];

export default function EditProfile() {
  const { currentUser, updateProfile } = useStore();
  const [, setLocation] = useLocation();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    website: currentUser?.website || "",
    avatar: currentUser?.avatar || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData({ ...formData, avatar });
    setShowAvatarPicker(false);
  };

  const handleSave = () => {
    updateProfile(formData);
    setLocation("/profile");
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="font-bold text-lg">Edit Profile</h1>
        </div>
        <Button variant="ghost" className="text-blue-500 font-bold hover:text-blue-600" onClick={handleSave}>
          Done
        </Button>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-border overflow-hidden shadow-md">
              <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setShowAvatarPicker(true)}
              className="absolute bottom-0 right-0 bg-blue-500 border-4 border-background rounded-full p-2.5 hover:bg-blue-600 transition-colors text-white shadow-lg"
            >
              <Camera className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
          <button 
            onClick={() => setShowAvatarPicker(true)}
            className="text-blue-600 font-semibold text-sm hover:underline"
          >
            Change Profile Photo
          </button>
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end animate-in fade-in">
            <div className="w-full bg-background rounded-t-2xl p-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Select Photo</h3>
                <button onClick={() => setShowAvatarPicker(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((avatar, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      formData.avatar === avatar ? "border-blue-500 scale-95" : "border-border"
                    }`}
                  >
                    <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Name</label>
            <Input 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-muted/50 border-0 focus-visible:ring-0 h-10 px-3"
              placeholder="Full Name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Username</label>
            <Input 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="bg-muted/50 border-0 focus-visible:ring-0 h-10 px-3"
              placeholder="username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Bio</label>
            <Textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="bg-muted/50 border-0 focus-visible:ring-0 p-3 resize-none"
              placeholder="Bio"
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Website</label>
            <Input 
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="bg-muted/50 border-0 focus-visible:ring-0 h-10 px-3"
              placeholder="Website"
            />
          </div>
        </div>

        {/* Account Section */}
        <div className="border-t border-border pt-4 space-y-3">
          <h3 className="font-bold">Account</h3>
          <button className="w-full text-left py-2 text-blue-600 font-semibold text-sm hover:underline">
            Change Password
          </button>
          <button className="w-full text-left py-2 text-destructive font-semibold text-sm hover:underline">
            Deactivate Account
          </button>
        </div>
      </main>
    </div>
  );
}
