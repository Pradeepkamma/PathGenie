import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  inline?: boolean;
}

const ThemeToggle = ({ inline }: ThemeToggleProps) => {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return true; // default to dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  if (inline) {
    return (
      <motion.button
        onClick={() => setDark(!dark)}
        className="p-2 rounded-lg bg-muted border border-border text-foreground hover:bg-secondary transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => setDark(!dark)}
      className="fixed top-5 right-5 z-50 p-2.5 rounded-full bg-card border border-border shadow-card text-foreground hover:bg-muted transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </motion.button>
  );
};

export default ThemeToggle;
