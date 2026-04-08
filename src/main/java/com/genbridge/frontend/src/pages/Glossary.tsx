import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { Search, BookOpen, MessageCircle, ShieldCheck, ExternalLink, Loader2, ArrowLeft } from "lucide-react";

interface GlossaryTerm {
  id: number;
  lessonId: number;
  term: string;
  description: string;
  example: string;
  source: string;
}

const Glossary = () => {
  const { toast } = useToast();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  useEffect(() => {
    api
      .get("/content/glossary")
      .then((res) => setTerms(res.data))
      .catch(() => toast({ title: "Error loading glossary" }))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [terms, search]);

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const term of filtered) {
      const letter = term.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(term);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="flex min-h-screen bg-background">
      {!isAdmin && <AppSidebar activePage="glossary" />}
      <div className={`flex-1 ${!isAdmin ? "ml-72" : ""} pt-12 pb-16 px-8`}>
        <div className="max-w-3xl mx-auto">

          {/* Admin back link */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">Glossary</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Every Gen Alpha term on the platform — your personal Gen Alpha dictionary.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center pt-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center pt-20">
              {search ? `No terms matching "${search}"` : "No terms in the glossary yet."}
            </p>
          ) : (
            <div className="space-y-10">
              {grouped.map(([letter, letterTerms]) => (
                <div key={letter}>
                  {/* Letter divider */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-display text-2xl font-bold text-primary">{letter}</span>
                    <div className="flex-1 h-px bg-border" />
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {letterTerms.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {letterTerms.map((term, i) => (
                      <motion.div
                        key={term.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-2xl border border-border bg-card p-5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-display text-base font-bold text-primary">
                            {term.term}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        </div>
                        <p className="text-foreground/80 text-sm leading-relaxed mb-2">
                          {term.description}
                        </p>
                        {term.example && (
                          <div className="pl-4 border-l-2 border-primary/30 mb-2">
                            <p className="text-xs text-muted-foreground flex items-start gap-2">
                              <MessageCircle className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                              {term.example}
                            </p>
                          </div>
                        )}
                        {term.source && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            Source:{" "}
                            {term.source.startsWith("http") ? (
                              <a
                                href={term.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-foreground transition-colors"
                              >
                                {term.source}
                              </a>
                            ) : (
                              <a
                                href={`https://www.urbandictionary.com/define.php?term=${encodeURIComponent(term.term)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-foreground transition-colors"
                              >
                                {term.source}
                              </a>
                            )}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Glossary;
