import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  Sparkles,
  HelpCircle,
  Zap,
} from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
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

interface QuizData {
  question: string;
  correct: string;
  options: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const XP_MAP: Record<string, number> = { Beginner: 10, Intermediate: 15, Advanced: 20 };

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const modules: Module[] = [
  {
    id: "slang",
    title: "Slang & Vocabulary",
    description: "Master the words and phrases that define Gen Alpha's digital lexicon.",
    icon: MessageCircle,
    color: "primary",
    lessons: [
      {
        id: "slang-1",
        title: "Rizz, Sigma & Skibidi",
        description: "The holy trinity of Gen Alpha vocabulary — what they mean and how they're used.",
        duration: "5 min",
        difficulty: "Beginner",
        completed: false,
        content: {
          sections: [
            {
              heading: "What is Rizz?",
              body: "\"Rizz\" refers to someone's ability to charm or attract others, particularly in romantic contexts. It originated from internet personality Kai Cenat and has since become one of the most widely used Gen Alpha terms. You can have \"W rizz\" (good charm) or \"L rizz\" (bad charm). The word can also be used as a verb: \"He rizzed her up.\""
            },
            {
              heading: "The Sigma Male",
              body: "\"Sigma\" describes someone who operates outside traditional social hierarchies — a lone wolf who is self-reliant and quietly confident. The term comes from the concept of a \"sigma male\" as an alternative to \"alpha\" or \"beta\" archetypes. Gen Alpha uses it both seriously and ironically, often paired with edgy memes featuring dramatic music."
            },
            {
              heading: "Skibidi — From Toilet to Everywhere",
              body: "\"Skibidi\" originated from the YouTube series \"Skibidi Toilet\" by DaFuq!?Boom!, which features singing heads emerging from toilets battling humanoid figures with cameras and speakers for heads. The term has evolved into a general-purpose adjective meaning cool, weird, or just used for fun. It's a perfect example of how Gen Alpha creates meaning from absurdist content."
            },
          ],
          keyTerms: [
            { term: "Rizz", definition: "Charm or charisma, especially in attracting romantic interest" },
            { term: "W Rizz", definition: "Having great charm — a 'win' in the rizz department" },
            { term: "Sigma", definition: "A self-reliant, independent person who doesn't follow the crowd" },
            { term: "Skibidi", definition: "Originally from Skibidi Toilet; now a playful, all-purpose word" },
          ],
          examples: [
            "\"Bro's got unspoken rizz\" — He's effortlessly charming without even trying.",
            "\"That's such a sigma move\" — Acting independently and not caring what others think.",
            "\"This song is skibidi\" — This song is catchy/weird/fun (context-dependent).",
          ],
        },
      },
      {
        id: "slang-2",
        title: "GYAT, Bussin & No Cap",
        description: "Explore expressions of excitement, authenticity, and approval in Gen Alpha speak.",
        duration: "4 min",
        difficulty: "Beginner",
        completed: false,
        content: {
          sections: [
            {
              heading: "GYAT — The Exclamation",
              body: "\"GYAT\" (sometimes \"gyatt\") is an exclamation used to express surprise or admiration, often in reaction to someone's physical appearance. It's derived from \"god damn\" and was popularized by streamers like YourRAGE. While it started in specific contexts, Gen Alpha now uses it broadly as a general exclamation of amazement."
            },
            {
              heading: "Bussin — The Ultimate Compliment",
              body: "When something is \"bussin,\" it means it's exceptionally good. Originally used to describe delicious food, it's now applied to anything impressive — music, outfits, experiences. \"This pizza is bussin\" or \"Your fit is bussin\" are both common usage. The word gained mainstream traction through TikTok food reviews."
            },
            {
              heading: "No Cap / Capping",
              body: "\"No cap\" means \"no lie\" or \"for real\" — it's used to emphasize that you're being completely honest. \"Capping\" means lying. These terms have roots in African American Vernacular English (AAVE) and were popularized through hip-hop culture before being widely adopted by Gen Alpha online."
            },
          ],
          keyTerms: [
            { term: "GYAT", definition: "An exclamation of surprise or admiration" },
            { term: "Bussin", definition: "Extremely good, impressive, or delicious" },
            { term: "No Cap", definition: "For real, no lie — used to emphasize truthfulness" },
            { term: "Capping", definition: "Lying or being dishonest" },
          ],
          examples: [
            "\"GYAT! Did you see that play?\" — Expressing amazement at something impressive.",
            "\"This beat is bussin no cap\" — This music is genuinely great, I'm not lying.",
            "\"He's capping fr\" — He's definitely lying, for real.",
          ],
        },
      },
      {
        id: "slang-3",
        title: "Slay, Era & Main Character",
        description: "Identity-driven language and how Gen Alpha expresses self and status.",
        duration: "6 min",
        difficulty: "Intermediate",
        completed: false,
        content: {
          sections: [
            {
              heading: "Slay — More Than a Compliment",
              body: "\"Slay\" means to do something exceptionally well or to look amazing. Rooted in LGBTQ+ ballroom culture, it crossed into mainstream Gen Alpha usage through social media. \"She slayed that presentation\" or simply \"slay\" as a standalone reaction are both common. It represents a culture of hyping up peers and celebrating confidence."
            },
            {
              heading: "The Era Framework",
              body: "\"I'm in my _____ era\" is a framing device Gen Alpha uses to describe their current phase of life or mindset. Popularized by Taylor Swift's Eras Tour, it's become a way to narrativize personal growth. \"I'm in my villain era\" (embracing selfishness), \"I'm in my healing era\" (prioritizing mental health), or \"I'm in my gym era\" (fitness focus) are common examples."
            },
            {
              heading: "Main Character Syndrome",
              body: "\"Main character energy\" or being the \"main character\" means living life as though you're the protagonist of a movie — confident, intentional, and unapologetically yourself. It can be used positively (self-empowerment) or negatively (being self-centered). The concept reflects Gen Alpha's deep connection to narrative and storytelling through content creation."
            },
          ],
          keyTerms: [
            { term: "Slay", definition: "To do something brilliantly or look stunning" },
            { term: "Era", definition: "A personal phase or chapter of life you're currently in" },
            { term: "Main Character", definition: "Living confidently as the protagonist of your own story" },
            { term: "NPC", definition: "Someone who seems to lack original thought (opposite of main character)" },
          ],
          examples: [
            "\"You absolutely slayed that outfit\" — You look incredible.",
            "\"I'm in my productive era\" — I'm currently focused on being productive.",
            "\"She's giving main character energy\" — She's radiating confidence and presence.",
          ],
        },
      },
    ],
  },
  {
    id: "memes",
    title: "Meme Culture",
    description: "Understand the viral content formats that shape Gen Alpha humor.",
    icon: TrendingUp,
    color: "coral",
    lessons: [
      {
        id: "memes-1",
        title: "Brainrot & Internet Absurdism",
        description: "Why Gen Alpha humor is weird, layered, and intentionally chaotic.",
        duration: "7 min",
        difficulty: "Intermediate",
        completed: false,
        content: {
          sections: [
            {
              heading: "What is Brainrot?",
              body: "\"Brainrot\" refers to the effect of consuming so much niche internet content that your humor and references become incomprehensible to outsiders. It's both a self-aware critique and a badge of honor. Gen Alpha embraces brainrot as a shared identity — if you understand the reference, you're part of the in-group."
            },
            {
              heading: "Layers of Irony",
              body: "Gen Alpha memes often operate on multiple layers of irony simultaneously. A meme might be funny on the surface, ironic in its delivery, and meta-ironic in its context. This layered approach makes Gen Alpha humor inaccessible to outsiders but deeply bonding for those who get it. It's humor as a social filter."
            },
            {
              heading: "The Absurdist Tradition",
              body: "From Skibidi Toilet to random object worship, Gen Alpha's humor draws from internet absurdism — content that is deliberately nonsensical. This isn't random for the sake of random; it's a creative rebellion against the polished, brand-friendly content that dominates their media landscape. The weirder it is, the more authentic it feels."
            },
          ],
          keyTerms: [
            { term: "Brainrot", definition: "When excessive internet consumption makes your humor incomprehensible to outsiders" },
            { term: "Irony poisoning", definition: "Being so ironic that sincerity becomes difficult" },
            { term: "Shitposting", definition: "Deliberately posting low-quality or absurd content for humor" },
          ],
          examples: [
            "\"My brainrot is terminal\" — I've consumed so much internet content, there's no going back.",
            "\"This video gave me brainrot\" — This content is so absurd it's rewiring my brain.",
          ],
        },
      },
    ],
  },
  {
    id: "gaming",
    title: "Gaming & Digital Life",
    description: "Explore the platforms, games, and digital behaviors that define daily life.",
    icon: Gamepad2,
    color: "lavender",
    lessons: [
      {
        id: "gaming-1",
        title: "Roblox, Fortnite & Digital Identity",
        description: "How virtual worlds shape real-world identity for Gen Alpha.",
        duration: "6 min",
        difficulty: "Beginner",
        completed: false,
        content: {
          sections: [
            {
              heading: "Roblox as a Social Platform",
              body: "For Gen Alpha, Roblox isn't just a game — it's a social platform where they hang out, express creativity, and form communities. With millions of user-created experiences, it functions like a metaverse where social skills, economic thinking (through Robux), and creativity are constantly developed. Understanding Roblox is key to understanding Gen Alpha's digital socialization."
            },
            {
              heading: "Fortnite Beyond Battle Royale",
              body: "Fortnite has evolved far beyond a shooting game. Its in-game concerts (Travis Scott, Ariana Grande), movie screenings, and collaborative brand events have made it a cultural venue. Gen Alpha uses Fortnite dances and references as shared cultural touchpoints — the \"default dance\" and \"floss\" transcended gaming into schoolyard culture."
            },
            {
              heading: "Digital-First Identity",
              body: "Gen Alpha is the first generation where digital identity often precedes physical identity. Avatar customization, skin collections, and online personas are treated as genuine forms of self-expression. A child's Roblox avatar outfit can carry the same social weight as their real-world clothing choices."
            },
          ],
          keyTerms: [
            { term: "Robux", definition: "Roblox's virtual currency, often treated as real money by young users" },
            { term: "Skin", definition: "A cosmetic character appearance in games, often a status symbol" },
            { term: "Default", definition: "Using the basic/free character skin — can imply being a beginner or uncool" },
          ],
          examples: [
            "\"He's such a default\" — He's basic or hasn't invested effort into customization.",
            "\"Meet me in Roblox\" — Let's hang out in this virtual space (genuinely social).",
          ],
        },
      },
    ],
  },
  {
    id: "music",
    title: "Music & Audio Trends",
    description: "From TikTok sounds to genre-blending — the audio landscape of Gen Alpha.",
    icon: Music,
    color: "lime",
    lessons: [
      {
        id: "music-1",
        title: "TikTok Sounds & Virality",
        description: "How 15-second clips reshape the music industry.",
        duration: "5 min",
        difficulty: "Beginner",
        completed: false,
        content: {
          sections: [
            {
              heading: "The TikTok Sound Economy",
              body: "Music discovery for Gen Alpha happens primarily through TikTok sounds. A 15-second clip can turn an unknown artist into a global star overnight. Songs are valued for their \"TikTokability\" — how well they work as background audio for trends, dances, or storytelling formats. This has fundamentally shifted how music is created and marketed."
            },
            {
              heading: "Sound as Meme",
              body: "On TikTok, sounds aren't just music — they're meme templates. A dramatic voice clip, a movie quote, or a funny audio snippet becomes a format that thousands of creators reinterpret. Understanding popular sounds is essential to understanding Gen Alpha communication, because the audio carries context and meaning beyond the words."
            },
          ],
          keyTerms: [
            { term: "Sound", definition: "An audio clip on TikTok that can be reused by any creator" },
            { term: "Trending sound", definition: "An audio clip currently being widely used in new TikTok content" },
            { term: "Original sound", definition: "Audio created by the poster rather than reused from another video" },
          ],
          examples: [
            "\"Use this sound\" — Participate in a trend by creating content with this specific audio.",
            "\"This sound lives in my head rent free\" — I can't stop thinking about this audio clip.",
          ],
        },
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getDailyTerm = (): { term: string; definition: string; moduleName: string } => {
  const all = modules.flatMap((m) =>
    m.lessons.flatMap((l) =>
      l.content.keyTerms.map((kt) => ({ ...kt, moduleName: m.title }))
    )
  );
  const idx = Math.floor(Date.now() / 86_400_000) % all.length;
  return all[idx];
};

const generateQuiz = (lesson: Lesson): QuizData | null => {
  const { keyTerms } = lesson.content;
  if (keyTerms.length === 0) return null;
  const correct = keyTerms[Math.floor(Math.random() * keyTerms.length)];
  const pool = modules
    .flatMap((m) => m.lessons.flatMap((l) => l.content.keyTerms))
    .filter((t) => t.definition !== correct.definition);
  const distractors = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((t) => t.definition);
  const options = [correct.definition, ...distractors].sort(() => Math.random() - 0.5);
  return { question: `What does "${correct.term}" mean?`, correct: correct.definition, options };
};

// ─── XP Celebration Overlay ───────────────────────────────────────────────────

function XPCelebration({ xp, onClose }: { xp: number; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.45 }}
        className="bg-card rounded-3xl p-12 text-center shadow-2xl border border-primary/20 max-w-xs w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 0.7 }}
          className="text-6xl mb-4 select-none"
        >
          🏆
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Lesson Complete!</h2>
        <p className="text-muted-foreground text-sm mb-4">Keep the streak alive!</p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: "spring", bounce: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Zap className="w-8 h-8 text-primary" />
          <span className="font-display text-5xl font-bold text-primary">+{xp} XP</span>
        </motion.div>
        <Button onClick={onClose} className="w-full">
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Learn = () => {
  const { xp, completedLessons, completeLesson } = useUserProgress();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showLesson, setShowLesson] = useState(false);
  const [xpPop, setXpPop] = useState<number | null>(null);

  const dailyTerm = useMemo(() => getDailyTerm(), []);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  const handleLessonClick = (lesson: Lesson) => {
    const q = generateQuiz(lesson);
    setSelectedLesson(lesson);
    setQuiz(q);
    setQuizAnswer(null);
    setShowLesson(!q);
  };

  const handleComplete = () => {
    if (!selectedLesson) return;
    const earned = completeLesson(selectedLesson.id, XP_MAP[selectedLesson.difficulty] ?? 10);
    if (earned > 0) setXpPop(earned);
  };

  // ── Quiz view ──────────────────────────────────────────────────────────────
  if (selectedLesson && !showLesson && quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AnimatePresence>
          {xpPop !== null && <XPCelebration xp={xpPop} onClose={() => setXpPop(null)} />}
        </AnimatePresence>
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <button
              onClick={() => { setSelectedLesson(null); setQuiz(null); }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to module
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-2 text-primary mb-1">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-widest">Quick Check</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Test yourself before diving in — no pressure!
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                {quiz.question}
              </h2>

              <div className="space-y-3 mb-8">
                {quiz.options.map((opt) => {
                  const isAnswered = !!quizAnswer;
                  const isCorrect = opt === quiz.correct;
                  const isChosen = opt === quizAnswer;
                  let cls =
                    "w-full text-left rounded-xl border px-5 py-3.5 text-sm transition-all ";
                  if (!isAnswered) {
                    cls += "border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
                  } else if (isCorrect) {
                    cls += "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400 cursor-not-allowed";
                  } else if (isChosen) {
                    cls += "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400 cursor-not-allowed";
                  } else {
                    cls += "border-border opacity-40 cursor-not-allowed";
                  }
                  return (
                    <button
                      key={opt}
                      disabled={isAnswered}
                      onClick={() => setQuizAnswer(opt)}
                      className={cls}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {quizAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p
                      className={`text-sm font-medium ${
                        quizAnswer === quiz.correct
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {quizAnswer === quiz.correct
                        ? "🎉 Correct! You're already ahead."
                        : `Not quite — the answer is: "${quiz.correct}"`}
                    </p>
                    <Button onClick={() => setShowLesson(true)} className="w-full">
                      Continue to Lesson <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── Lesson detail view ─────────────────────────────────────────────────────
  if (selectedLesson && showLesson) {
    const isComplete = completedLessons.has(selectedLesson.id);
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <AnimatePresence>
          {xpPop !== null && <XPCelebration xp={xpPop} onClose={() => setXpPop(null)} />}
        </AnimatePresence>
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <button
              onClick={() => { setSelectedLesson(null); setShowLesson(false); }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to module
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className={badgeColorMap[selectedLesson.difficulty]}>
                  {selectedLesson.difficulty}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {selectedLesson.duration}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  {XP_MAP[selectedLesson.difficulty]} XP
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {selectedLesson.title}
              </h1>
              <p className="text-muted-foreground mb-10">{selectedLesson.description}</p>

              <div className="space-y-8 mb-12">
                {selectedLesson.content.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                      {section.heading}
                    </h2>
                    <p className="text-foreground/80 leading-relaxed">{section.body}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 mb-8">
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Key Terms
                </h3>
                <div className="space-y-3">
                  {selectedLesson.content.keyTerms.map((kt) => (
                    <div key={kt.term} className="flex gap-3">
                      <span className="font-semibold text-primary whitespace-nowrap">{kt.term}</span>
                      <span className="text-muted-foreground">— {kt.definition}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 mb-10">
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-coral" /> Usage Examples
                </h3>
                <ul className="space-y-3">
                  {selectedLesson.content.examples.map((ex, i) => (
                    <li
                      key={i}
                      className="text-foreground/80 leading-relaxed pl-4 border-l-2 border-coral/30"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>

              {isComplete ? (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Lesson completed!
                </div>
              ) : (
                <Button size="lg" onClick={handleComplete}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Complete
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── Module detail view ─────────────────────────────────────────────────────
  if (selectedModule) {
    const moduleCompleted = selectedModule.lessons.filter((l) => completedLessons.has(l.id)).length;
    const moduleProgress = (moduleCompleted / selectedModule.lessons.length) * 100;
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
              <ArrowLeft className="w-4 h-4" /> All modules
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-2">
                <div
                  className={`w-12 h-12 rounded-xl ${iconColorMap[selectedModule.color]} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {selectedModule.title}
                  </h1>
                  <p className="text-muted-foreground">{selectedModule.description}</p>
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
                      onClick={() => handleLessonClick(lesson)}
                      className="w-full text-left rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="font-display font-bold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-card-foreground">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={badgeColorMap[lesson.difficulty]}>
                          {lesson.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.duration}
                        </span>
                        <span className="text-xs text-primary flex items-center gap-0.5 font-medium">
                          <Zap className="w-3 h-3" /> {XP_MAP[lesson.difficulty]}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
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

  // ── Overview (path + slang of day) ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

            {/* Header */}
            <div className="mb-6">
              <h1 className="font-display text-4xl font-bold text-foreground mb-1">Learn</h1>
              <p className="text-muted-foreground">Your Gen Alpha crash course awaits.</p>
            </div>

            {/* XP + Progress bar */}
            <div className="rounded-2xl border border-border bg-card p-5 mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-card-foreground">Overall Progress</p>
                  <span className="text-sm font-bold text-primary">{xp} XP</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <span className="text-sm font-medium text-muted-foreground shrink-0">
                {completedLessons.size}/{totalLessons}
              </span>
            </div>

            {/* Slang of the Day */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-10"
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Slang of the Day</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground mb-2">
                {dailyTerm.term}
              </p>
              <p className="text-muted-foreground leading-relaxed">{dailyTerm.definition}</p>
              <p className="text-xs text-muted-foreground/60 mt-3">
                From: {dailyTerm.moduleName}
              </p>
            </motion.div>

            {/* Learning Path */}
            <h2 className="font-display text-lg font-bold text-foreground mb-8 text-center">
              Your Learning Path
            </h2>

            <div className="relative flex flex-col items-center gap-10 py-4">
              {/* Central dashed guide line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0 -translate-x-1/2 border-l-2 border-dashed border-border/50 z-0 pointer-events-none" />

              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const done = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
                const total = mod.lessons.length;
                const isComplete = done === total;
                const offset = i % 2 === 0 ? "-translate-x-14" : "translate-x-14";

                return (
                  <motion.button
                    key={mod.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", bounce: 0.4 }}
                    onClick={() => setSelectedModule(mod)}
                    className={`relative z-10 flex flex-col items-center gap-2.5 group transform ${offset}`}
                  >
                    <div
                      className={`relative w-20 h-20 rounded-2xl ${iconColorMap[mod.color]} flex items-center justify-center shadow-lg border-2 group-hover:scale-110 transition-transform ${
                        isComplete ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <Icon className="w-9 h-9" />
                      {isComplete && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="font-display font-bold text-sm text-center max-w-[110px] leading-tight text-foreground group-hover:text-primary transition-colors">
                      {mod.title}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {done}/{total} done
                    </span>
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
