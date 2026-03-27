import { motion } from "framer-motion";
import AppSidebar from "@/components/AppSidebar";
import { useTheme, ThemeMode } from "@/context/ThemeContext";

const MODES: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark",  label: "Dark"  },
  { value: "auto",  label: "Auto"  },
];

const Settings = () => {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="settings" />

      <div className="flex-1 ml-72 pt-12 pb-16 px-8">
        <div className="max-w-3xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold text-foreground mb-6"
          >
            Settings
          </motion.h1>

          {/* Appearance card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="font-display text-xl font-bold text-card-foreground mb-6">
              Appearance
            </h2>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-card-foreground">
                Choose your preferred color mode
              </span>

              {/* Toggle pill */}
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                {MODES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      mode === value
                        ? "bg-foreground text-background shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
