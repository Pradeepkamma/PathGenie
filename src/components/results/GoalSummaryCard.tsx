import { motion } from "framer-motion";
import { Target, TrendingUp, Award } from "lucide-react";
import type { AnalysisResult } from "@/lib/quizData";

interface GoalSummaryCardProps {
  summary: AnalysisResult["summary"];
}

const GoalSummaryCard = ({ summary }: GoalSummaryCardProps) => {
  const confidenceColor =
    summary.confidence_level === "High"
      ? "text-success"
      : summary.confidence_level === "Medium"
      ? "text-highlight"
      : "text-muted-foreground";

  const confidenceBg =
    summary.confidence_level === "High"
      ? "bg-success/10"
      : summary.confidence_level === "Medium"
      ? "bg-highlight/10"
      : "bg-muted";

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Goal Summary</h2>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Top Recommendation</p>
              <h3 className="text-lg sm:text-xl font-bold text-foreground font-display">
                {summary.top_recommendation}
              </h3>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${confidenceBg}`}>
            <TrendingUp className={`w-3.5 h-3.5 ${confidenceColor}`} />
            <span className={`text-sm font-semibold ${confidenceColor}`}>
              {summary.confidence_level} Confidence
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {summary.confidence_explanation}
        </p>
      </div>
    </motion.div>
  );
};

export default GoalSummaryCard;
