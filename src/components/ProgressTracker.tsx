import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trophy, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { CareerRecommendation } from "@/lib/quizData";

interface ProgressTrackerProps {
  recommendations: CareerRecommendation[];
  email: string;
}

const ProgressTracker = ({ recommendations, email }: ProgressTrackerProps) => {
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});
  const [loading, setLoading] = useState(true);

  const career = recommendations[selectedCareer];
  const careerKey = career.career_title;
  const steps = career.next_steps;
  const checked = completedSteps[careerKey] || new Array(steps.length).fill(false);
  const completedCount = checked.filter(Boolean).length;
  const progress = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("career_progress")
        .select("career_title, step_index, completed")
        .eq("email", email);

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
  }, [email, recommendations]);

  const toggleStep = async (stepIndex: number) => {
    const newChecked = [...checked];
    newChecked[stepIndex] = !newChecked[stepIndex];
    setCompletedSteps((prev) => ({ ...prev, [careerKey]: newChecked }));

    const { data: existing } = await supabase
      .from("career_progress")
      .select("id")
      .eq("email", email)
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
        email,
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
      className="bg-card rounded-2xl border border-border shadow-card p-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground font-display">Progress Tracker</h3>
        {progress === 100 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-success/10 text-success px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> Complete!
          </span>
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
                  <CheckCircle2 className="w-5 h-5 text-success" />
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
