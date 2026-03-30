import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { label: "Enter Goal", short: "Goal" },
  { label: "Customize", short: "Quiz" },
  { label: "Generate", short: "Analyze" },
  { label: "View Result", short: "Results" },
];

interface StepIndicatorProps {
  currentStep: number; // 0-indexed: 0=landing, 1=questionnaire, 2=analysis, 3=results
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="bg-background border-b border-border py-4 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={i} className="flex items-center gap-0 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-accent/40 ring-offset-2 ring-offset-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                  initial={false}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                </motion.div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    isActive ? "text-foreground" : isCompleted ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`text-xs font-medium sm:hidden ${
                    isActive ? "text-foreground" : isCompleted ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {step.short}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 sm:mx-3 h-0.5 rounded-full overflow-hidden bg-muted self-start mt-4">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
