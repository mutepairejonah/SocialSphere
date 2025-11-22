import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Login() {
  const login = useStore((state) => state.login);
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
      setLocation("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-md mx-auto bg-background">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center mb-8">
          <h1 className="font-logo text-5xl mb-4">InstaClone</h1>
          <p className="text-muted-foreground">Sign up to see photos and videos from your friends.</p>
        </div>

        <Button 
          className="w-full bg-[#1877F2] hover:bg-[#1864D6] text-white font-semibold" 
          onClick={handleLogin}
          disabled={loading}
        >
           Log in with Facebook
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <Input placeholder="Phone number, username, or email" className="bg-muted/50" />
          <Input type="password" placeholder="Password" className="bg-muted/50" />
          <Button type="submit" className="w-full font-semibold mt-2" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-xs text-blue-900 dark:text-blue-400">Forgot password?</a>
        </div>
      </div>

      <div className="mt-auto py-6 w-full border-t border-border text-center">
        <p className="text-sm">
          Don't have an account? <span className="font-semibold text-blue-600 cursor-pointer" onClick={handleLogin}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
