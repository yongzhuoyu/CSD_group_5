import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  TrendingUp,
  Gamepad2,
  Music,
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  ArrowLeft,
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  completed: boolean;
  content: {
    sections: { heading: string; body: string }[];
    keyTerms: { term: string; definition: string }[];
    examples: string[];
  };
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: "primary" | "coral" | "lavender" | "lime";
  lessons: Lesson[];
}

const iconColorMap = {
  primary: "bg-primary/10 text-primary",
  coral: "bg-coral/10 text-coral",
  lavender: "bg-lavender/10 text-lavender",
  lime: "bg-lime/10 text-lime",
};

const badgeColorMap = {
  Beginner: "bg-lime/15 text-lime border-lime/30",
  Intermediate: "bg-primary/15 text-primary border-primary/30",
  Advanced: "bg-coral/15 text-coral border-coral/30",
};

const iconMap: Record<string, React.ElementType> = {
  "slang-vocab": MessageCircle,
  "meme-culture": TrendingUp,
  "gaming-digital": Gamepad2,
  "music-audio": Music,
};

const colorMap: Record<string, "primary" | "coral" | "lavender" | "lime"> = {
  "slang-vocab": "primary",
  "meme-culture": "coral",
  "gaming-digital": "lavender",
  "music-audio": "lime",
};

const Learn = () => {
  const { id } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    fetch("/api/content/approved")
      .then((res) => res.json())
      .then((data) => {
        const grouped: Record<string, Module> = {};

        data.forEach((item: any) => {
          const body =
            typeof item.body === "string" ? JSON.parse(item.body) : item.body;

          if (!grouped[item.categorySlug]) {
            grouped[item.categorySlug] = {
              id: item.categorySlug,
              title: item.categoryName,
              description: item.categoryDescription || "",
              icon: iconMap[item.categorySlug] || MessageCircle,
              color: colorMap[item.categorySlug] || "primary",
              lessons: [],
            };
          }

          grouped[item.categorySlug].lessons.push({
            id: item.id,
            title: item.title,
            description: body?.description || "",
            duration: body?.duration,
            difficulty: body?.difficulty,
            completed: false,
            content: {
              sections: body?.sections || [],
              keyTerms: body?.keyTerms || [],
              examples: body?.examples || [],
            },
          });
        });

        const modulesArray = Object.values(grouped);
        setModules(modulesArray);

        // 🔥 NEW PART: Auto open lesson if ID exists
        if (id) {
          for (const module of modulesArray) {
            const found = module.lessons.find((l) => l.id === id);
            if (found) {
              setSelectedModule(module);
              setSelectedLesson(found);
              break;
            }
          }
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [id]);

  const markComplete = (lessonId: string) => {
    setCompletedLessons((prev) => new Set(prev).add(lessonId));
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallProgress =
    totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  // =====================================================
  // LESSON VIEW
  // =====================================================
  if (selectedLesson) {
    const isComplete = completedLessons.has(selectedLesson.id);

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <button
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to module
            </button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                {selectedLesson.difficulty && (
                  <Badge
                    variant="outline"
                    className={badgeColorMap[selectedLesson.difficulty]}
                  >
                    {selectedLesson.difficulty}
                  </Badge>
                )}

                {selectedLesson.duration && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedLesson.duration}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {selectedLesson.title}
              </h1>

              <p className="text-muted-foreground mb-10">
                {selectedLesson.description}
              </p>

              <div className="space-y-8 mb-12">
                {selectedLesson.content.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-3">
                      {section.heading}
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">
                      {section.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              {selectedLesson.content.keyTerms.length > 0 && (
                <div className="rounded-2xl border bg-card p-6 mb-8">
                  <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Key Terms
                  </h3>
                  <div className="space-y-3">
                    {selectedLesson.content.keyTerms.map((kt) => (
                      <div key={kt.term} className="flex gap-3">
                        <span className="font-semibold text-primary">
                          {kt.term}
                        </span>
                        <span className="text-muted-foreground">
                          — {kt.definition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLesson.content.examples.length > 0 && (
                <div className="rounded-2xl border bg-card p-6 mb-10">
                  <h3 className="font-display text-lg font-semibold mb-4">
                    Usage Examples
                  </h3>
                  <ul className="space-y-3">
                    {selectedLesson.content.examples.map((ex, i) => (
                      <li key={i} className="pl-4 border-l-2 border-primary/30">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isComplete ?
                <Button
                  size="lg"
                  onClick={() => markComplete(selectedLesson.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              : <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Lesson completed!
                </div>
              }
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MODULE VIEW
  // =====================================================
  if (selectedModule) {
    const moduleCompleted = selectedModule.lessons.filter((l) =>
      completedLessons.has(l.id),
    ).length;

    const moduleProgress =
      (moduleCompleted / selectedModule.lessons.length) * 100;

    const Icon = selectedModule.icon;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All modules
            </button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`w-12 h-12 rounded-xl ${iconColorMap[selectedModule.color]} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h1 className="font-display text-3xl font-bold">
                    {selectedModule.title}
                  </h1>
                  <p className="text-muted-foreground">
                    {selectedModule.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 mb-8">
                <Progress value={moduleProgress} className="h-2 flex-1" />
                <span className="text-sm text-muted-foreground font-medium">
                  {moduleCompleted}/{selectedModule.lessons.length}
                </span>
              </div>

              <div className="space-y-4">
                {selectedModule.lessons.map((lesson, i) => {
                  const done = completedLessons.has(lesson.id);

                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedLesson(lesson)}
                      className="w-full text-left rounded-xl border bg-card p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          done ?
                            "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ?
                          <CheckCircle2 className="w-5 h-5" />
                        : <span className="font-display font-bold">
                            {i + 1}
                          </span>
                        }
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {lesson.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {lesson.difficulty && (
                          <Badge
                            variant="outline"
                            className={badgeColorMap[lesson.difficulty]}
                          >
                            {lesson.difficulty}
                          </Badge>
                        )}

                        {lesson.duration && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                        )}

                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // OVERVIEW
  // =====================================================
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-2">Learn</h1>

            <p className="text-muted-foreground mb-6">
              Explore curated modules powered by live content.
            </p>

            <div className="rounded-2xl border bg-card p-5 mb-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">Overall Progress</p>
                <Progress value={overallProgress} className="h-2 mt-1.5" />
              </div>

              <span className="text-sm text-muted-foreground font-medium">
                {completedLessons.size}/{totalLessons} lessons
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const modCompleted = mod.lessons.filter((l) =>
                  completedLessons.has(l.id),
                ).length;

                return (
                  <motion.button
                    key={mod.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedModule(mod)}
                    className="text-left rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${iconColorMap[mod.color]} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h2 className="font-display text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {mod.title}
                    </h2>

                    <p className="text-sm text-muted-foreground mb-4">
                      {mod.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {mod.lessons.length} lesson
                        {mod.lessons.length !== 1 ? "s" : ""} · {modCompleted}{" "}
                        done
                      </span>

                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
