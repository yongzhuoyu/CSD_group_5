import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, Zap, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";


const features = [
  {
    icon: MessageCircle,
    title: "Decode the Slang",
    description: "From 'skibidi' to 'rizz' — master the ever-evolving vocabulary of Gen Alpha with bite-sized lessons.",
    color: "primary" as const,
  },
  {
    icon: BookOpen,
    title: "Cultural Deep Dives",
    description: "Explore the memes, creators, and digital trends shaping a generation's identity and worldview.",
    color: "coral" as const,
  },
  {
    icon: Zap,
    title: "Interactive Quizzes",
    description: "Test your knowledge with fun, gamified quizzes that keep you sharp and up to date.",
    color: "lavender" as const,
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Learn alongside others and see how different generations interpret the same cultural moments.",
    color: "lime" as const,
  },
];

const Index = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                Speak fluent{" "}
                <span className="text-primary">Gen&nbsp;Alpha</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                The self-learning platform that helps you understand the language, memes, and culture defining the next generation.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                {!isLoggedIn && (
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">I have an account</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learn the culture, not just the words
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our curated modules go beyond definitions — you'll understand the context, origins, and social dynamics behind every trend.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-primary p-12 text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to get fluent?
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
                Join thousands of curious learners bridging the generational gap. It's free to start.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/register">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 GenFluent. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
