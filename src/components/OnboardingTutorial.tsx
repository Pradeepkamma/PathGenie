import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles, ClipboardList, BarChart3, Trophy, MessageCircle } from "lucide-react";

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}

const steps: TutorialStep[] = [
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "Welcome to PathGenie!",
    description:
      "We'll guide you through a quick career discovery quiz powered by AI. In just 15–20 minutes, you'll get personalized tech career recommendations tailored to your skills and interests.",
    accent: "from-primary to-accent",
  },
  {
    icon: <ClipboardList className="w-7 h-7" />,
    title: "The Career Quiz",
    description:
      "Answer 19 questions about your technical skills, work preferences, interests, and goals. There are no right or wrong answers — just be honest! Your responses shape the AI analysis.",
    accent: "from-accent to-highlight",
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Your Results Dashboard",
    description:
      "Get ranked career matches with fit scores, salary insights, interactive charts, and a side-by-side comparison table. Each career card expands to show skills, outlook, and next steps.",
    accent: "from-highlight to-success",
  },
  {
    icon: <Trophy className="w-7 h-7" />,
    title: "Track Your Progress",
    description:
      "Use the Progress Tracker to check off actionable next steps for each career path. Hit milestones to earn confetti celebrations! Compare your scores with other users too.",
    accent: "from-success to-primary",
  },
  {
    icon: <MessageCircle className="w-7 h-7" />,
    title: "AI Career Chatbot",
    description:
      "Have follow-up questions? Use the floating AI chatbot on your results page to ask anything about your recommended careers, skills to develop, or industry trends.",
    accent: "from-primary to-highlight",
  },
];

const STORAGE_KEY = "pathgenie_onboarding_seen";

const OnboardingTutorial = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset_tour") === "1") {
      localStorage.removeItem(STORAGE_KEY);
      // Clean the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("reset_tour");
      window.history.replaceState({}, "", url.toString());
    }
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  const next = () => {
    if (current < steps.length - 1) setCurrent((c) => c + 1);
    else dismiss();
  };

  const prev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  if (!visible) return null;

  const step = steps[current];
  const isLast = current === steps.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={dismiss} />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-card rounded-2xl border border-border shadow-elevated overflow-hidden"
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon header */}
            <div className={`bg-gradient-to-r ${step.accent} p-6 flex items-center justify-center`}>
              <motion.div
                key={current}
                className="w-16 h-16 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.icon}
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-foreground font-display mb-2">
                    {step.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mt-6 mb-5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={dismiss}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tour
                </button>
                <div className="flex items-center gap-2">
                  {current > 0 && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {isLast ? "Get Started" : "Next"}
                    {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTutorial;
