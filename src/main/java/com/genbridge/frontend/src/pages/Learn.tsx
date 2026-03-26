import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import {
  BookOpen,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// ── API types ──────────────────────────────────────────────────────────────

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  objective: string;
  published: boolean;
}

interface ContentTerm {
  id: number;
  lessonId: number;
  title: string;
  term: string;
  description: string;
  example: string;
  orderIndex: number;
}

interface QuizQuestion {
  id: number;
  lessonId: number;
  questionText: string;
  options: string[];
  explanation: string;
}

interface ProgressEntry {
  lessonId: number;
  completed: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const badgeColorMap: Record<string, string> = {
  BEGINNER: "bg-lime/15 text-lime border-lime/30",
  Beginner: "bg-lime/15 text-lime border-lime/30",
  INTERMEDIATE: "bg-primary/15 text-primary border-primary/30",
  Intermediate: "bg-primary/15 text-primary border-primary/30",
  ADVANCED: "bg-coral/15 text-coral border-coral/30",
  Advanced: "bg-coral/15 text-coral border-coral/30",
};

// ── Main component ─────────────────────────────────────────────────────────

const Learn = () => {
  const { toast } = useToast();

  // list view
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});

  // lesson detail
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<ContentTerm[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // quiz
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizView, setQuizView] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    completed: boolean;
  } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // ── Load lessons + progress on mount ──────────────────────────────────

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingLessons(true);
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          api.get("/lessons"),
          api.get("/progress"),
        ]);
        setLessons(lessonsRes.data);

        const map: Record<number, boolean> = {};
        (progressRes.data.lessons as ProgressEntry[]).forEach((p) => {
          map[p.lessonId] = p.completed;
        });
        setProgressMap(map);
      } catch {
        toast({ title: "Error loading lessons" });
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchAll();
  }, []);

  // ── Open a lesson ──────────────────────────────────────────────────────

  const openLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setContent([]);
    setQuizQuestions([]);
    setQuizView(false);
    setQuizResult(null);
    setAnswers({});
    setLoadingContent(true);
    setLoadingQuiz(true);

    try {
      // Start tracking progress
      await api.post(`/lessons/${lesson.id}/start`);
    } catch {
      // non-blocking — ignore if already started
    }

    try {
      const [contentRes, quizRes] = await Promise.all([
        api.get(`/content/lesson/${lesson.id}`),
        api.get(`/lessons/${lesson.id}/quiz`),
      ]);
      setContent(contentRes.data);
      setQuizQuestions(quizRes.data);
    } catch {
      toast({ title: "Error loading lesson content" });
    } finally {
      setLoadingContent(false);
      setLoadingQuiz(false);
    }
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setQuizView(false);
    setQuizResult(null);
    setAnswers({});
  };

  // ── Submit quiz ────────────────────────────────────────────────────────

  const submitQuiz = async () => {
    if (!selectedLesson) return;
    setSubmittingQuiz(true);
    try {
      const res = await api.post(`/lessons/${selectedLesson.id}/quiz/submit`, {
        answers,
      });
      setQuizResult(res.data);

      // Refresh progress
      const progressRes = await api.get("/progress");
      const map: Record<number, boolean> = {};
      (progressRes.data.lessons as ProgressEntry[]).forEach((p) => {
        map[p.lessonId] = p.completed;
      });
      setProgressMap(map);
    } catch {
      toast({ title: "Error submitting quiz" });
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalCount = lessons.length;
  const overallProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // ── Quiz view ──────────────────────────────────────────────────────────

  if (selectedLesson && quizView) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <button
              onClick={() => { setQuizView(false); setQuizResult(null); setAnswers({}); }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to lesson
            </button>

            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Quiz: {selectedLesson.title}
            </h1>
            <p className="text-muted-foreground mb-8">
              Answer all questions and submit to complete this lesson.
            </p>

            {loadingQuiz ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : quizQuestions.length === 0 ? (
              <p className="text-muted-foreground">No quiz questions available for this lesson yet.</p>
            ) : quizResult ? (
              // Result screen
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-8 text-center"
              >
                <div className="text-5xl font-bold text-primary mb-2">{quizResult.score}%</div>
                <p className="text-muted-foreground mb-1">
                  {quizResult.correctAnswers} / {quizResult.totalQuestions} correct
                </p>
                {quizResult.completed ? (
                  <div className="flex items-center justify-center gap-2 text-primary font-medium mt-4">
                    <CheckCircle2 className="w-5 h-5" /> Lesson completed!
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4 text-sm">
                    Answer all questions correctly to complete the lesson.
                  </p>
                )}
                <Button className="mt-6" onClick={() => { setQuizView(false); setQuizResult(null); setAnswers({}); }}>
                  Back to lesson
                </Button>
              </motion.div>
            ) : (
              // Questions
              <div className="space-y-8">
                {quizQuestions.map((q, qi) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qi * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <p className="font-semibold text-card-foreground mb-4">
                      {qi + 1}. {q.questionText}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setAnswers({ ...answers, [q.id]: i })}
                          className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                            answers[q.id] === i
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/40 text-foreground"
                          }`}
                        >
                          {i + 1}. {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}

                <Button
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(answers).length < quizQuestions.length || submittingQuiz}
                  onClick={submitQuiz}
                >
                  {submittingQuiz ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Lesson detail view ─────────────────────────────────────────────────

  if (selectedLesson) {
    const isCompleted = progressMap[selectedLesson.id] === true;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <button
              onClick={closeLesson}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> All lessons
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={badgeColorMap[selectedLesson.difficulty] ?? ""}>
                  {selectedLesson.difficulty}
                </Badge>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-sm text-primary font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {selectedLesson.title}
              </h1>
              <p className="text-muted-foreground mb-2">{selectedLesson.description}</p>
              {selectedLesson.objective && (
                <p className="text-sm text-primary/80 font-medium mb-10">
                  Objective: {selectedLesson.objective}
                </p>
              )}

              {/* Content terms */}
              {loadingContent ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : content.length === 0 ? (
                <p className="text-muted-foreground mb-10">No content available for this lesson yet.</p>
              ) : (
                <div className="space-y-6 mb-12">
                  {content.map((term, i) => (
                    <motion.div
                      key={term.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border border-border bg-card p-6"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-display text-lg font-bold text-primary">{term.term}</span>
                        {term.title !== term.term && (
                          <span className="text-sm text-muted-foreground">({term.title})</span>
                        )}
                      </div>
                      <p className="text-foreground/80 leading-relaxed mb-3">{term.description}</p>
                      {term.example && (
                        <div className="pl-4 border-l-2 border-primary/30">
                          <p className="text-sm text-muted-foreground flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                            {term.example}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Key Terms summary */}
              {content.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 mb-8">
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Key Terms
                  </h3>
                  <div className="space-y-2">
                    {content.map((term) => (
                      <div key={term.id} className="flex gap-3">
                        <span className="font-semibold text-primary whitespace-nowrap">{term.term}</span>
                        <span className="text-muted-foreground">— {term.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz / complete CTA */}
              {!loadingQuiz && quizQuestions.length > 0 && (
                <Button size="lg" onClick={() => setQuizView(true)}>
                  {isCompleted ? "Retake Quiz" : "Take Quiz to Complete"}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {!loadingQuiz && quizQuestions.length === 0 && !loadingContent && (
                <p className="text-sm text-muted-foreground mt-4">
                  No quiz available yet — check back later.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── Lessons list view ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Learn</h1>
            <p className="text-muted-foreground mb-6">
              Explore lessons on Gen Alpha language, memes, gaming, and more.
            </p>

            {/* Overall progress */}
            <div className="rounded-2xl border border-border bg-card p-5 mb-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Overall Progress</p>
                <Progress value={overallProgress} className="h-2 mt-1.5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {completedCount}/{totalCount} lessons
              </span>
            </div>

            {/* Lessons */}
            {loadingLessons ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : lessons.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">No lessons available yet.</p>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, i) => {
                  const isCompleted = progressMap[lesson.id] === true;
                  return (
                    <motion.button
                      key={lesson.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => openLesson(lesson)}
                      className="w-full text-left rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow group"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="font-display text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h2>
                            <Badge variant="outline" className={badgeColorMap[lesson.difficulty] ?? ""}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
