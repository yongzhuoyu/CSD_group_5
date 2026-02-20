import { useState } from "react";
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
} from "lucide-react";

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
            { term: "Brainrot", definition: "When excessive internet consumption makes your humor incomprehensible" },
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
            { term: "Default", definition: "Using the basic/free character skin — can imply being a beginner" },
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
            { term: "Trending sound", definition: "An audio clip currently being widely used in new content" },
            { term: "Original sound", definition: "Audio created by the poster rather than reused" },
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

const Learn = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const markComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  // Lesson detail view
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
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                {selectedLesson.title}
              </h1>
              <p className="text-muted-foreground mb-10">{selectedLesson.description}</p>

              {/* Lesson sections */}
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

              {/* Key Terms */}
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

              {/* Examples */}
              <div className="rounded-2xl border border-border bg-card p-6 mb-10">
                <h3 className="font-display text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-coral" /> Usage Examples
                </h3>
                <ul className="space-y-3">
                  {selectedLesson.content.examples.map((ex, i) => (
                    <li key={i} className="text-foreground/80 leading-relaxed pl-4 border-l-2 border-coral/30">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complete button */}
              {isComplete ? (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <CheckCircle2 className="w-5 h-5" /> Lesson completed!
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={() => markComplete(selectedLesson.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Complete
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Module detail view
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
                <div className={`w-12 h-12 rounded-xl ${iconColorMap[selectedModule.color]} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-foreground">{selectedModule.title}</h1>
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
                      onClick={() => setSelectedLesson(lesson)}
                      className="w-full text-left rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-display font-bold">{i + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-card-foreground">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{lesson.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={badgeColorMap[lesson.difficulty]}>
                          {lesson.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lesson.duration}
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

  // Module overview
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">Learn</h1>
            <p className="text-muted-foreground mb-6">
              Explore curated modules on Gen Alpha language, memes, gaming, and more.
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
                {completedLessons.size}/{totalLessons} lessons
              </span>
            </div>

            {/* Modules grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                const modCompleted = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
                return (
                  <motion.button
                    key={mod.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => setSelectedModule(mod)}
                    className="text-left rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${iconColorMap[mod.color]} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {mod.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""} · {modCompleted} done
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
