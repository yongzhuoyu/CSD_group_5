import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import api from "@/services/api";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Learn from "./pages/Learn";
import LessonDetail from "./pages/LessonDetail";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import Quests from "./pages/Quests";
import QuestDetail from "./pages/QuestDetail";
import Forum from "./pages/Forum";
import ForumPostDetail from "./pages/ForumPostDetail";
import Glossary from "./pages/Glossary";
const queryClient = new QueryClient();

// Redirects to /login if no token
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return localStorage.getItem("token") ? element : (
      <Navigate to="/login" replace />
    );
};

// Suspension modal — shown every login while account is suspended
const SuspensionModal = () => {
  const [suspension, setSuspension] = useState<{ reason: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const checkSuspension = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role === "ADMIN") return;
    setDismissed(false);
    api.get("/profile")
      .then(res => {
        if (res.data.isSuspended) {
          setSuspension({ reason: res.data.suspensionReason || "Contact support for more information." });
        } else {
          setSuspension(null);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkSuspension();
    window.addEventListener("gb_login", checkSuspension);
    return () => window.removeEventListener("gb_login", checkSuspension);
  }, []);

  if (!suspension || dismissed) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Account Suspended
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground">
            Your account has been suspended by an admin. You can still browse lessons and quests, but you cannot post or comment in the forum.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-xs text-red-700 font-medium mb-1">Reason</p>
            <p className="text-sm text-red-900">{suspension.reason}</p>
          </div>
          <Button className="w-full" variant="outline" onClick={() => setDismissed(true)}>
            I understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Warning modal — shown once per unread warning
const WarningModal = () => {
  const [warnings, setWarnings] = useState<{ id: number; reason: string; createdAt: string }[]>([]);

  const checkWarnings = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role === "ADMIN") return;
    api.get("/me/warnings/unread")
      .then(res => { if (res.data.length > 0) setWarnings(res.data); })
      .catch(() => {});
  };

  useEffect(() => {
    checkWarnings();
    // Re-check whenever localStorage changes (e.g. after login)
    window.addEventListener("storage", checkWarnings);
    // Also listen for a custom event fired after login
    window.addEventListener("gb_login", checkWarnings);
    return () => {
      window.removeEventListener("storage", checkWarnings);
      window.removeEventListener("gb_login", checkWarnings);
    };
  }, []);

  const dismiss = async () => {
    try { await api.post("/me/warnings/read"); } catch {}
    setWarnings([]);
  };

  if (warnings.length === 0) return null;

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Account Warning
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <p className="text-sm text-muted-foreground">
            You have received {warnings.length === 1 ? "a warning" : `${warnings.length} warnings`} from an admin. Please review our community guidelines to avoid further action.
          </p>
          <div className="space-y-2">
            {warnings.map((w) => (
              <div key={w.id} className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-xs text-amber-700 font-medium mb-1">{new Date(w.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-amber-900">{w.reason}</p>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={dismiss}>I understand</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Admin-only route — redirects to /lessons if not admin
const AdminRoute = () => {
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace />;
  if (localStorage.getItem("role") !== "ADMIN") return <Navigate to="/lessons" replace />;
  return <Admin />;
};

// Redirects to /admin or /lessons if already logged in
const PublicOnlyRoute = ({ element }: { element: JSX.Element }) => {
  if (!localStorage.getItem("token")) return element;
  return localStorage.getItem("role") === "ADMIN"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/lessons" replace />;
};

// Home: dashboard for logged-in users, landing page otherwise
const HomeRoute = () => {
  if (!localStorage.getItem("token")) return <Index />;
  return localStorage.getItem("role") === "ADMIN"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/lessons" replace />;
};

// Intercepts 401 responses anywhere in the app and logs the user out
const TokenExpiryHandler = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate]);
  return null;
};

const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TokenExpiryHandler />
        <SuspensionModal />
        <WarningModal />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/login"
            element={<PublicOnlyRoute element={<Login />} />}
          />
          <Route
            path="/register"
            element={<PublicOnlyRoute element={<Register />} />}
          />
          <Route path="/lessons" element={<PrivateRoute element={<Learn />} />} />
          <Route path="/lessons/:id" element={<PrivateRoute element={<LessonDetail />} />} />

          <Route path="/admin" element={<AdminRoute />} />

          <Route path="/glossary" element={<PrivateRoute element={<Glossary />} />} />
          <Route path="/forum" element={<PrivateRoute element={<Forum />} />} />
          <Route path="/forum/:id" element={<PrivateRoute element={<ForumPostDetail />} />} />
          <Route path="/quests" element={<PrivateRoute element={<Quests />} />} />
<Route path="/quests/:id" element={<PrivateRoute element={<QuestDetail />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
