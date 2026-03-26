import React from "react";
import { Link } from "react-router-dom";
import BridgeIcon from "@/assets/icons/bridge.svg?react";
import heroImg from "@/assets/hero.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  const lightVars = {
    "--background": "44 30% 91%",
    "--foreground": "220 40% 13%",
    "--card": "0 0% 100%",
    "--card-foreground": "220 40% 13%",
    "--muted": "220 20% 95%",
    "--muted-foreground": "220 10% 50%",
    "--border": "220 15% 90%",
    "--input": "220 15% 90%",
    "--primary": "130 28% 44%",
    "--primary-foreground": "0 0% 100%",
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex bg-background" style={lightVars}>

      {/* Left panel — form */}
      <div className="flex flex-col justify-between w-full lg:w-[45%] px-10 py-10 shrink-0">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <BridgeIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">GenBridge</span>
        </Link>

        {/* Form content — vertically centred */}
        <div className="w-full max-w-sm mx-auto">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-muted-foreground text-sm mb-8">{subtitle}</p>
          {children}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground/50 text-center">
          © {new Date().getFullYear()} GenBridge. All rights reserved.
        </p>
      </div>

      {/* Right panel — illustration */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-primary/5 border-l border-border">
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-40px] w-72 h-72 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center px-16">
          {/* Headline */}
          <h2 className="font-display text-4xl font-bold text-foreground mb-3 leading-tight">
            Bridge the gap with<br />
            <span className="text-primary">Gen Alpha.</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xs mb-10 leading-relaxed">
            Learn the slang, memes, and culture that define the next generation — one lesson at a time.
          </p>

          {/* Hero image / illustration placeholder */}
          <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-xl border border-border">
            <img
              src={heroImg}
              alt="GenBridge illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
