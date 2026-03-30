import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  currentStep?: number;
}

const Navbar = ({ currentStep }: NavbarProps) => {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Compass className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display text-foreground tracking-tight">
            PathGenie
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle inline />
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
