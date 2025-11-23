import { Router, Route } from "wouter";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Toaster } from "sonner";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Create from "./pages/Create";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Following from "./pages/Following";
import Followers from "./pages/Followers";

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
        <Route path="/" component={Home} />
        <Route path="/explore" component={Explore} />
        <Route path="/create" component={Create} />
        <Route path="/activity" component={Activity} />
        <Route path="/profile" component={Profile} />
        <Route path="/profile/edit" component={EditProfile} />
        <Route path="/following" component={Following} />
        <Route path="/followers" component={Followers} />
      </Router>
      <Toaster />
    </>
  );
}

export default App;
