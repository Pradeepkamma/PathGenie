import { motion } from "framer-motion";
import { Map, ArrowRight } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface RoadmapCardProps {
  recommendations: CareerRecommendation[];
}

const RoadmapCard = ({ recommendations }: RoadmapCardProps) => {
  const topRec = recommendations[0];
  if (!topRec) return null;

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Step-by-Step Roadmap</h2>
            <p className="text-xs text-muted-foreground">For {topRec.career_title}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <ol className="relative space-y-0">
          {topRec.next_steps.map((step, i) => (
            <li key={i} className="relative flex gap-3 sm:gap-4 pb-4 last:pb-0">
              {/* Timeline line */}
              {i < topRec.next_steps.length - 1 && (
                <div className="absolute left-[13px] sm:left-[15px] top-8 bottom-0 w-px bg-border" />
              )}
              {/* Step number */}
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-primary text-primary-foreground font-bold text-xs sm:text-sm flex items-center justify-center z-10">
                {i + 1}
              </div>
              {/* Step content */}
              <div className="flex-1 pt-0.5 sm:pt-1">
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
};

export default RoadmapCard;
