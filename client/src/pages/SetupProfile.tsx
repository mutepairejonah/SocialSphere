import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SetupProfile() {
  const { pendingGoogleUser, completeGoogleSignup, checkUsernameAvailable } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Redirect if no pending user
  useEffect(() => {
    if (!pendingGoogleUser) {
      setLocation("/login");
    }
  }, [pendingGoogleUser, setLocation]);

  const handleCheckUsername = async (value: string) => {
    setUsername(value);
    
    if (value.length < 3) {
      setIsAvailable(null);
      return;
    }

    setChecking(true);
    try {
      const available = await checkUsernameAvailable(value);
      setIsAvailable(available);
    } catch (error) {
      setIsAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || username.length < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username must be at least 3 characters"
      });
      return;
    }

    if (!isAvailable) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username is not available"
      });
      return;
    }

    setLoading(true);
    try {
      await completeGoogleSignup(username);
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to complete signup"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pendingGoogleUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto bg-background">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center">
          <h1 className="font-logo text-5xl mb-2">InstaClone</h1>
          <h2 className="font-bold text-xl mb-2">Complete Your Profile</h2>
          <p className="text-muted-foreground text-sm">
            Choose a unique username so others can find and follow you
          </p>
        </div>

        {/* Profile Preview */}
        <div className="flex flex-col items-center gap-3 p-4 bg-muted/30 rounded-lg">
          {pendingGoogleUser.photoURL && (
            <img 
              src={pendingGoogleUser.photoURL} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          )}
          <div className="text-center">
            <p className="font-semibold">{pendingGoogleUser.displayName}</p>
            <p className="text-xs text-muted-foreground">{pendingGoogleUser.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="setup-username" className="text-sm font-semibold">Username</label>
            <div className="relative">
              <Input 
                id="setup-username"
                name="username"
                placeholder="username" 
                className="bg-muted/50 border-0 focus-visible:ring-0 h-11 px-3"
                value={username}
                onChange={(e) => handleCheckUsername(e.target.value)}
                disabled={loading}
                autoFocus
                minLength={3}
                required
              />
              {username && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checking ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : isAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              3-30 characters, letters, numbers, and underscores only
            </p>
            {username && isAvailable === false && (
              <p className="text-xs text-red-500">
                This username is already taken
              </p>
            )}
            {username && isAvailable === true && (
              <p className="text-xs text-green-500">
                This username is available
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full font-semibold mt-4" 
            disabled={loading || !isAvailable || !username}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          <p>You can change your username anytime in settings</p>
        </div>
      </div>
    </div>
  );
}
