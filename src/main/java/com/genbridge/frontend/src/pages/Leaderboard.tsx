import { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import api from "@/services/api";
import { Trophy, Flame, Star } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  completedLessons: number;
  currentStreak: number;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard")
      .then(res => setEntries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activePage="leaderboard" />
      <main className="flex-1 overflow-y-auto transition-all duration-300 ml-0 md:ml-16 lg:ml-72 pt-16 md:pt-10 pb-10 px-4 md:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="font-display text-4xl font-bold text-foreground">Leaderboard</h1>
            <span className="ml-auto text-sm text-muted-foreground">Top 10 learners</span>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-20">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">No data yet.</div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border bg-card shadow-sm ${
                    entry.rank === 1 ? "border-yellow-400/60 bg-yellow-50/40" :
                    entry.rank === 2 ? "border-gray-400/60 bg-gray-50/40" :
                    entry.rank === 3 ? "border-amber-600/60 bg-amber-50/40" :
                    "border-border"
                  }`}
                >
                  <div className="w-10 text-center text-2xl font-bold shrink-0">
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.completedLessons} lessons completed</p>
                  </div>
                  {entry.currentStreak > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-bold text-orange-500">{entry.currentStreak}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-primary">{entry.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
