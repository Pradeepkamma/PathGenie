import { motion } from "framer-motion";
import { Rocket, ArrowRight } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface NextStepsCardProps {
  recommendations: CareerRecommendation[];
}

const NextStepsCard = ({ recommendations }: NextStepsCardProps) => {
  // Aggregate unique next steps from all recommendations (top 3)
  const allSteps = recommendations.slice(0, 3).flatMap((rec) =>
    rec.next_steps.slice(0, 2).map((step) => ({
      career: rec.career_title,
      step,
    }))
  );

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Quick-Start Next Steps</h2>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {allSteps.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-primary text-primary-foreground font-bold text-xs flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">{item.step}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> {item.career}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default NextStepsCard;
