import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Flame, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("gb_streak") ?? "0"));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("gb_xp") ?? "0"));

  useEffect(() => {
    const sync = () => {
      setStreak(parseInt(localStorage.getItem("gb_streak") ?? "0"));
      setXp(parseInt(localStorage.getItem("gb_xp") ?? "0"));
    };
    window.addEventListener("gb_progress", sync);
    return () => window.removeEventListener("gb_progress", sync);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast({ title: "Logged out", description: "See you next time!" });
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-foreground">
            GenBridge
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold text-orange-500">{streak}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">{xp} XP</span>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/learn">Learn</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              {role === "ADMIN" && (
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
