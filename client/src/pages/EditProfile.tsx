import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";

export default function EditProfile() {
  const { currentUser, updateProfile } = useStore();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    username: currentUser?.username || "",
    bio: currentUser?.bio || "",
    website: currentUser?.website || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden">
              <img src={currentUser?.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-background border border-border rounded-full p-2 hover:bg-muted transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <button className="text-blue-600 font-semibold text-sm">Change Profile Photo</button>
        </div>

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
          <button className="w-full text-left py-2 text-blue-600 font-semibold text-sm">
            Change Password
          </button>
          <button className="w-full text-left py-2 text-destructive font-semibold text-sm">
            Deactivate Account
          </button>
        </div>
      </main>
    </div>
  );
}
