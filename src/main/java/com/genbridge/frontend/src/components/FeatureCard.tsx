import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "coral" | "lavender" | "lime";
  delay?: number;
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  coral: "bg-coral/10 text-coral",
  lavender: "bg-lavender/10 text-lavender",
  lime: "bg-lime/10 text-lime",
};

const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow"
    >
      <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
