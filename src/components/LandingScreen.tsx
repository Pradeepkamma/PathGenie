import { motion } from "framer-motion";
import { Sparkles, Clock, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";

interface LandingScreenProps {
  onStart: (email: string) => void;
}

const LandingScreen = ({ onStart }: LandingScreenProps) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    onStart(email);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/10"
            style={{
              width: 300 + i * 200,
              height: 300 + i * 200,
              top: `${20 + i * 15}%`,
              left: `${50 + i * 10}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground/80 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Career Guidance
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 font-display leading-tight">
          Discover Your Perfect
          <br />
          <span className="text-gradient-primary bg-gradient-to-r from-accent to-highlight bg-clip-text text-transparent">
            Tech Career Path
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-primary-foreground/50 italic mb-8 font-display">
          🧞‍♂️ A Genie That Finds Your Path
        </p>

        <p className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-lg mx-auto leading-relaxed">
          Answer a few questions about your skills, interests, and goals. Get personalized career recommendations with actionable roadmaps.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-primary-foreground/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            15-20 minutes
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-highlight" />
            AI-analyzed results
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            Data deleted in 7 days
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email for the report"
                className="w-full px-4 py-3.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
              {error && (
                <p className="text-destructive text-sm mt-1 text-left">{error}</p>
              )}
            </div>
            <motion.button
              type="submit"
              className="px-6 py-3.5 bg-gradient-primary rounded-xl text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-elevated whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's Go
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LandingScreen;
