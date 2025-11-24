import { Router, Route } from "wouter";
import { Toaster } from "sonner";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Stories from "./pages/Stories";

function App() {
  return (
    <>
      <Router base="/">
        <Route path="/" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/stories" component={Stories} />
      </Router>
      <Toaster />
    </>
  );
}

export default App;