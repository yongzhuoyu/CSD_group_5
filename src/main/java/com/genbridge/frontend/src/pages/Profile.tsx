import { motion } from "framer-motion";
import { Flame, Star, BookOpen, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUserProgress } from "@/hooks/useUserProgress";

// ─── Temporary lesson lookup (replace with API data once api.ts is ready) ─────

const LESSON_LOOKUP: Record<string, { title: string; module: string; difficulty: "Beginner" | "Intermediate" | "Advanced" }> = {
  "slang-1":  { title: "Rizz, Sigma & Skibidi",     module: "Slang & Vocabulary", difficulty: "Beginner"     },
  "slang-2":  { title: "GYAT, Bussin & No Cap",      module: "Slang & Vocabulary", difficulty: "Beginner"     },
  "slang-3":  { title: "Slay, Era & Main Character", module: "Slang & Vocabulary", difficulty: "Intermediate" },
  "memes-1":  { title: "Brainrot & Internet Absurdism", module: "Meme Culture",    difficulty: "Intermediate" },
  "gaming-1": { title: "Roblox, Fortnite & Digital Identity", module: "Gaming & Digital Life", difficulty: "Beginner" },
  "music-1":  { title: "TikTok Sounds & Virality",   module: "Music & Audio Trends", difficulty: "Beginner"  },
};

const DIFFICULTY_COLORS = {
  Beginner:     "bg-lime/15 text-lime border-lime/30",
  Intermediate: "bg-primary/15 text-primary border-primary/30",
  Advanced:     "bg-coral/15 text-coral border-coral/30",
};

const LEVELS = [
  { label: "Beginner",     min: 0,  max: 30  },
  { label: "Intermediate", min: 30, max: 80  },
  { label: "Advanced",     min: 80, max: 999 },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Component ────────────────────────────────────────────────────────────────

const Profile = () => {
  const { xp, streak, completedLessons } = useUserProgress();

  // TODO: replace with real user data from GET /api/profile once api.ts is ready
  const name  = "Your Name";
  const email = "your@email.com";

  const completedList = [...completedLessons]
    .map((id) => ({ id, ...LESSON_LOOKUP[id] }))
    .filter((l) => l.title);

  const current   = [...LEVELS].reverse().find((l) => xp >= l.min) ?? LEVELS[0];
  const isMax     = current.label === "Advanced";
  const progressPct = isMax
    ? 100
    : Math.min(((xp - current.min) / (current.max - current.min)) * 100, 100);
  const xpToNext  = isMax ? null : current.max - xp;
  const nextLevel = isMax ? null : LEVELS[LEVELS.findIndex((l) => l.label === current.label) + 1];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">

          {/* Page title */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold text-foreground mb-6"
          >
            Profile
          </motion.h1>

          {/* Main info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-2xl border border-border mb-6 overflow-hidden"
          >
            {/* Avatar + name row */}
            <div className="flex items-center gap-5 p-6 border-b border-border">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0 shadow">
                <span className="font-display text-xl font-bold text-primary-foreground">
                  {getInitials(name)}
                </span>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-card-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="flex flex-col items-center gap-1 py-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-display text-2xl font-bold text-card-foreground">{streak}</span>
                </div>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>
              <div className="flex flex-col items-center gap-1 py-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-display text-2xl font-bold text-card-foreground">{xp}</span>
                </div>
                <span className="text-xs text-muted-foreground">Total XP</span>
              </div>
              <div className="flex flex-col items-center gap-1 py-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4 text-lime" />
                  <span className="font-display text-2xl font-bold text-card-foreground">{completedList.length}</span>
                </div>
                <span className="text-xs text-muted-foreground">Lessons Done</span>
              </div>
            </div>

            {/* Level progress */}
            <div className="p-6 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-card-foreground">Current Level</span>
                <span className="text-xs font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                  {current.label}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                {LEVELS.map((l) => (
                  <span key={l.label} className={l.label === current.label ? "text-primary font-medium" : ""}>
                    {l.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-1 mb-2">
                {LEVELS.map((l) => {
                  const isPast    = xp >= l.max;
                  const isCurrent = l.label === current.label;
                  return (
                    <div key={l.label} className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: isPast ? "100%" : isCurrent ? `${progressPct}%` : "0%" }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {isMax ? "You've reached the top level!" : `${xpToNext} XP to ${nextLevel?.label}`}
              </p>
            </div>
          </motion.div>

          {/* Completed lessons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-4">
              Completed Lessons
            </h2>

            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {completedList.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No lessons completed yet.</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">Head to Learn to get started!</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {completedList.map((lesson, i) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.12 + i * 0.04 }}
                      className="flex items-center gap-4 px-6 py-4"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground text-sm">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground">{lesson.module}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${DIFFICULTY_COLORS[lesson.difficulty]}`}>
                        {lesson.difficulty}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
