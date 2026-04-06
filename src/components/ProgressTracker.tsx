import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trophy, Sparkles, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { CareerRecommendation } from "@/lib/quizData";
import confetti from "canvas-confetti";

interface ProgressTrackerProps {
  recommendations: CareerRecommendation[];
}

const milestoneMessages = [
  { at: 1, emoji: "🚀", text: "First step done! You're on your way." },
  { at: 3, emoji: "🔥", text: "Three steps in — great momentum!" },
  { at: 5, emoji: "⭐", text: "Halfway hero! Keep going." },
];

const fireConfetti = (intensity: "small" | "big") => {
  if (intensity === "small") {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["hsl(262,83%,58%)", "hsl(47,100%,62%)", "hsl(142,76%,36%)"],
    });
  } else {
    const end = Date.now() + 800;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }
};

const ProgressTracker = ({ recommendations }: ProgressTrackerProps) => {
  const { user } = useAuth();
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);

  const career = recommendations[selectedCareer];
  const careerKey = career.career_title;
  const steps = career.next_steps;
  const checked = completedSteps[careerKey] || new Array(steps.length).fill(false);
  const completedCount = checked.filter(Boolean).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("career_progress")
        .select("career_title, step_index, completed")
        .eq("user_id", user.id);

      if (data) {
        const map: Record<string, boolean[]> = {};
        data.forEach((row) => {
          if (!map[row.career_title]) {
            const rec = recommendations.find((r) => r.career_title === row.career_title);
            map[row.career_title] = new Array(rec?.next_steps.length || 0).fill(false);
          }
          map[row.career_title][row.step_index] = row.completed;
        });
        setCompletedSteps(map);
      }
      setLoading(false);
    };
    fetchProgress();
  }, [user, recommendations]);

  const celebrateStep = useCallback(
    (newCount: number, totalSteps: number) => {
      // All steps complete
      if (newCount === totalSteps) {
        setJustCompleted(true);
        fireConfetti("big");
        toast.success("🎉 All steps complete! You're crushing it!", { duration: 4000 });
        setTimeout(() => setJustCompleted(false), 3000);
        return;
      }

      // Milestone check
      const milestone = milestoneMessages.find((m) => m.at === newCount);
      if (milestone) {
        fireConfetti("small");
        toast.success(`${milestone.emoji} ${milestone.text}`, { duration: 3000 });
      }
    },
    []
  );

  const toggleStep = async (stepIndex: number) => {
    if (!user) {
      toast.error("Sign in to track your progress");
      return;
    }
    const newChecked = [...checked];
    const wasCompleted = newChecked[stepIndex];
    newChecked[stepIndex] = !wasCompleted;
    setCompletedSteps((prev) => ({ ...prev, [careerKey]: newChecked }));

    // Celebrate only when completing (not unchecking)
    if (!wasCompleted) {
      const newCount = newChecked.filter(Boolean).length;
      celebrateStep(newCount, steps.length);
    }

    const { data: existing } = await supabase
      .from("career_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("career_title", careerKey)
      .eq("step_index", stepIndex)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("career_progress")
        .update({
          completed: newChecked[stepIndex],
          completed_at: newChecked[stepIndex] ? new Date().toISOString() : null,
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("career_progress").insert({
        user_id: user.id,
        career_title: careerKey,
        step_index: stepIndex,
        step_text: steps[stepIndex],
        completed: newChecked[stepIndex],
        completed_at: newChecked[stepIndex] ? new Date().toISOString() : null,
      });
    }
  };

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card p-6 mb-10 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Completion celebration overlay */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            className="absolute inset-0 bg-success/5 z-10 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <PartyPopper className="w-16 h-16 text-success/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground font-display">Progress Tracker</h3>
        {progress === 100 && (
          <motion.span
            className="inline-flex items-center gap-1 text-xs font-semibold bg-success/10 text-success px-2.5 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="w-3 h-3" /> Complete!
          </motion.span>
        )}
      </div>

      {/* Career selector tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {recommendations.map((rec, i) => (
          <button
            key={rec.career_title}
            onClick={() => setSelectedCareer(i)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              i === selectedCareer
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            #{rec.rank} {rec.career_title}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">
            {completedCount} of {steps.length} steps
          </span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps checklist */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading progress...</p>
      ) : (
        <ul className="space-y-3">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => toggleStep(i)}
            >
              <motion.div
                className="mt-0.5 flex-shrink-0"
                whileTap={{ scale: 0.85 }}
              >
                {checked[i] ? (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </motion.div>
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </motion.div>
              <span
                className={`text-sm leading-relaxed transition-all ${
                  checked[i]
                    ? "line-through text-muted-foreground/60"
                    : "text-foreground"
                }`}
              >
                {step}
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default ProgressTracker;
