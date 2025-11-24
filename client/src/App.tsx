import { Router, Route } from "wouter";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Following from "./pages/Following";
import ConnectInstagram from "./pages/ConnectInstagram";

function App() {
  const { isAuthenticated, initializeAuth } = useStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <Router base="/">
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile/edit" component={EditProfile} />
        <Route path="/profile/connect-instagram" component={ConnectInstagram} />
        <Route path="/following" component={Following} />
      </Router>
      <Toaster />
    </>
  );
}

export default App;
