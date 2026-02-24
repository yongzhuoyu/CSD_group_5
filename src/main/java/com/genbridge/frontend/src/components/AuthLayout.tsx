import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-accent animate-float" />
          <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-lime animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-lavender animate-float" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-9 h-9 text-primary-foreground" />
          </div>
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Decode the culture.
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-sm mx-auto">
            Learn the language, trends, and references that define Gen Alpha — one lesson at a time.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">GenFluent</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
