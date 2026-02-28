import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  const navigate = useNavigate();
  const { toast } = useToast();

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
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            GenBridge
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {isLoggedIn ?
            <>
              {/* LEARNER UI */}
              {role === "LEARNER" && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/learn">Learn</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/create">Create</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/my-content">My Content</Link>
                  </Button>
                </>
              )}

              {/* ADMIN UI */}
              {role === "ADMIN" && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/learn">Learn</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/admin/">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/admin/pending">Pending</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/admin/approved">Approved</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/admin/rejected">Rejected</Link>
                  </Button>
                </>
              )}

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </Button>
            </>
          : <>
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
