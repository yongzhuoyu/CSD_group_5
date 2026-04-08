import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Star, LogOut, Trophy, BookOpen, Menu, X } from "lucide-react";
import BridgeIcon from "@/assets/icons/bridge.svg?react";
import ForumIcon from "@/assets/icons/forum.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import DictionaryIcon from "@/assets/icons/dictionary.svg?react";
import AccountIcon from "@/assets/icons/account.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import api from "@/services/api";

interface AppSidebarProps {
  activePage: "home" | "learn" | "glossary" | "forum" | "quests" | "profile" | "settings" | "leaderboard";
}

const AppSidebar = ({ activePage }: AppSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    api.get("/profile").then((res) => {
      setStreak(res.data.currentStreak ?? 0);
      setXp(res.data.xp ?? 0);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { icon: HomeIcon,       label: "Home",     href: "/home",      page: "home"     },
    { icon: DictionaryIcon, label: "Learn",    href: "/lessons",   page: "learn"    },
    { icon: BookOpen,       label: "Glossary", href: "/glossary",  page: "glossary" },
    { icon: ForumIcon,      label: "Forum",    href: "/forum",     page: "forum"    },
    { icon: Trophy,         label: "Quests",   href: "/quests",    page: "quests"   },
    { icon: AccountIcon,    label: "Profile",  href: "/profile",   page: "profile"  },
    { icon: SettingsIcon,   label: "Settings", href: "/settings",  page: "settings" },
  ] as const;

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Backdrop — mobile only */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-0 left-0 h-full bg-card border-r border-border flex flex-col transition-all duration-300",
          // Width: full on mobile/desktop, icon-only on tablet
          "w-72 md:w-16 lg:w-72",
          // Z-index: above backdrop on mobile
          "z-50 md:z-40",
          // Visibility: slide in/out on mobile, always visible on md+
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0 gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BridgeIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          {/* Brand name: visible on mobile + desktop, hidden on tablet (w-16) */}
          <span className="font-sidebar text-xl font-bold text-foreground whitespace-nowrap flex-1 md:hidden lg:block">
            GenBridge
          </span>
          {/* Close button — mobile only */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ icon: Icon, label, href, page }) => {
            const isActive = activePage === page;
            return (
              <Link
                key={label}
                to={href}
                onClick={() => setMobileOpen(false)}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-sidebar text-xl font-semibold transition-colors",
                  // Center icon on tablet (no text), left-align on mobile/desktop
                  "justify-start md:justify-center lg:justify-start",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="w-6 h-6 shrink-0" />
                {/* Label: visible on mobile + desktop, hidden on tablet */}
                <span className="whitespace-nowrap md:hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom — streak / XP / logout */}
        <div className="p-3 border-t border-border space-y-1 shrink-0">
          {/* Stats row */}
          <div className="flex items-center gap-2 px-3 py-1.5 md:flex-col md:gap-1 lg:flex-row lg:gap-2">
            {streak > 0 && (
              <span className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                <Flame className="w-4 h-4 shrink-0" />
                <span className="md:hidden lg:block">{streak}</span>
              </span>
            )}
            <span className="flex items-center gap-1 text-primary text-xs font-bold md:ml-0 lg:ml-auto">
              <Star className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:block">{xp} XP</span>
            </span>
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sidebar text-xl font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors justify-start md:justify-center lg:justify-start"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span className="md:hidden lg:block">Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
