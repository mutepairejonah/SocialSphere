import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, pendingGoogleUser } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setLocation("/");
    } catch (error: any) {
      if (error.message === 'USERNAME_SETUP_REQUIRED') {
        // Redirect to setup page for new users
        setLocation("/setup");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Login failed"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !fullName) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await signupWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
      setLocation("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto bg-background">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-6xl mb-4 text-primary" style={{ fontFamily: "'Grand Hotel', cursive" }}>InstaClone</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Share your moments with the world." : "Log in to your account."}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isSignUp && (
            <Input 
              placeholder="Full Name" 
              className="bg-muted/50" 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <Input 
            placeholder="Email" 
            className="bg-muted/50" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            className="bg-muted/50" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full font-semibold mt-2 bg-primary hover:bg-primary/90 text-white" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? "Sign Up" : "Log In")}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button 
          className="w-full bg-white hover:bg-gray-50 text-black border border-border font-semibold flex items-center gap-2" 
          onClick={handleGoogleLogin}
          disabled={loading}
        >
           <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" />
           Log in with Google
        </Button>

        {!isSignUp && (
          <div className="text-center mt-4">
            <a href="#" className="text-xs text-blue-900 dark:text-blue-400">Forgot password?</a>
          </div>
        )}
      </div>

      <div className="mt-auto py-6 w-full border-t border-border text-center">
        <p className="text-sm">
          {isSignUp ? "Have an account?" : "Don't have an account?"} 
          <span className="font-semibold text-blue-600 cursor-pointer ml-1" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}
