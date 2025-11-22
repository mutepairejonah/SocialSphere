import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import UserProfile from "@/pages/UserProfile";
import Following from "@/pages/Following";
import Followers from "@/pages/Followers";
import Create from "@/pages/Create";
import Activity from "@/pages/Activity";
import Explore from "@/pages/Explore";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/user/:id" component={UserProfile} />
      <Route path="/following" component={Following} />
      <Route path="/followers" component={Followers} />
      <Route path="/create" component={Create} />
      <Route path="/activity" component={Activity} />
      <Route path="/explore" component={Explore} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
