import { motion } from "framer-motion";
import { Puzzle, CheckCircle2, BookOpen } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface SkillsCardProps {
  recommendations: CareerRecommendation[];
}

const SkillsCard = ({ recommendations }: SkillsCardProps) => {
  const topRec = recommendations[0];
  if (!topRec) return null;

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <Puzzle className="w-4 h-4 text-success" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Skills Overview</h2>
            <p className="text-xs text-muted-foreground">For {topRec.career_title}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-success" /> Skills You Have
            </h4>
            <ul className="space-y-2.5">
              {topRec.skills_you_have.map((skill) => (
                <li key={skill} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                  </div>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-highlight" /> Skills to Develop
            </h4>
            <ul className="space-y-2.5">
              {topRec.skills_to_develop.map((skill) => (
                <li key={skill} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-highlight/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-3 h-3 text-highlight" />
                  </div>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsCard;
