import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, Flag, MessageCircle, BookOpen, Users, BarChart2, Menu, X } from "lucide-react";
import BridgeIcon from "@/assets/icons/bridge.svg?react";
import DictionaryIcon from "@/assets/icons/dictionary.svg?react";
import NoteStackIcon from "@/assets/icons/note_stack.svg?react";
import AbcIcon from "@/assets/icons/abc.svg?react";
import KeepIcon from "@/assets/icons/keep.svg?react";

interface AdminSidebarProps {
  activeTab: "lessons" | "content" | "quiz" | "reports" | "forum" | "quests" | "users" | "analytics";
  onTabChange: (tab: "lessons" | "content" | "quiz" | "reports" | "forum" | "quests" | "users" | "analytics") => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navItems = [
    { icon: DictionaryIcon,  label: "Lessons",          tab: "lessons" as const },
    { icon: NoteStackIcon,   label: "Content",          tab: "content" as const },
    { icon: AbcIcon,         label: "Quiz",             tab: "quiz"    as const },
    { icon: Flag,            label: "Reports",          tab: "reports" as const },
    { icon: MessageCircle,   label: "Forum Moderation", tab: "forum"   as const },
    { icon: KeepIcon,        label: "Quests",           tab: "quests"  as const },
    { icon: Users,           label: "Users",            tab: "users"     as const },
    { icon: BarChart2,       label: "Analytics",        tab: "analytics" as const },
  ];

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
          "w-72 md:w-16 lg:w-72",
          "z-50 md:z-40",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-4 border-b border-border shrink-0 gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <BridgeIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col flex-1 min-w-0 md:hidden lg:flex">
            <span className="font-sidebar text-base font-bold text-foreground whitespace-nowrap leading-tight">GenBridge</span>
            <span className="text-xs text-muted-foreground font-medium">Admin</span>
          </div>
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
          {navItems.map(({ icon: Icon, label, tab }) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => { onTabChange(tab); setMobileOpen(false); }}
                className={[
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sidebar text-xl font-semibold transition-colors",
                  "justify-start md:justify-center lg:justify-start",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="whitespace-nowrap md:hidden lg:block">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border shrink-0 space-y-1">
          <Link
            to="/glossary"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sidebar text-xl font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors justify-start md:justify-center lg:justify-start"
          >
            <BookOpen className="w-6 h-6 shrink-0" />
            <span className="md:hidden lg:block">Glossary</span>
          </Link>
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

export default AdminSidebar;
