import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Star, LogOut, Trophy, Menu, X } from "lucide-react";
import BridgeIcon from "@/assets/icons/bridge.svg?react";
import ForumIcon from "@/assets/icons/forum.svg?react";
import HomeIcon from "@/assets/icons/home.svg?react";
import DictionaryIcon from "@/assets/icons/dictionary.svg?react";
import AccountIcon from "@/assets/icons/account.svg?react";
import KeepIcon from "@/assets/icons/keep.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import api from "@/services/api";

interface AppSidebarProps {
  activePage: "home" | "learn" | "forum" | "quests" | "profile" | "settings";
}

const AppSidebar = ({ activePage }: AppSidebarProps) => {
  const [expanded, setExpanded] = useState(true);
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

  const sidebarW = expanded ? "w-72" : "w-16";

  const navItems = [
    { icon: HomeIcon,       label: "Home",     href: "/lessons",  page: "home"     },
    { icon: DictionaryIcon, label: "Learn",    href: "/lessons",  page: "learn"    },
    { icon: ForumIcon,      label: "Forum",    href: "/forum",    page: "forum"    },
    { icon: Trophy,         label: "Quests",   href: "/quests",   page: "quests"   },
    { icon: AccountIcon,    label: "Profile",  href: "/profile",  page: "profile"  },
    { icon: SettingsIcon,   label: "Settings", href: "/settings", page: "settings" },
  ] as const;

  return (
  <>
    {/* Mobile top bar */}
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <BridgeIcon className="w-5 h-5 text-primary" />
        <span className="font-bold text-sm">GenBridge</span>
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>

    {/* Sidebar */}
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 bg-card border-r border-border flex flex-col transition-all duration-300
        ${expanded ? "w-72" : "w-16"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
      `}
    >

      {/* Header */}
      {expanded ? (
        <div className="flex items-center h-16 px-4 border-b border-border gap-3">
          <BridgeIcon className="w-5 h-5 text-primary" />
          <span className="font-bold flex-1">GenBridge</span>
          <button onClick={() => setExpanded(false)}>
            <KeepIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button onClick={() => setExpanded(true)} className="h-16">
          <KeepIcon className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ icon: Icon, label, href, page }) => {
          const isActive = activePage === page;
          return (
            <Link
              key={label}
              to={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
              } ${!expanded ? "justify-center" : ""}`}
            >
              <Icon className="w-5 h-5" />
              {expanded && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-3"
        >
          <LogOut className="w-5 h-5" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  </>
);
};

export default AppSidebar;
