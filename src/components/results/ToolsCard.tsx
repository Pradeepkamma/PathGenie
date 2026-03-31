import { motion } from "framer-motion";
import { Wrench, TrendingUp } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface ToolsCardProps {
  recommendations: CareerRecommendation[];
}

const ToolsCard = ({ recommendations }: ToolsCardProps) => {
  const topRec = recommendations[0];
  if (!topRec) return null;

  const outlook = topRec.career_outlook;
  const outlookItems = [
    { label: "Entry Salary", value: outlook.salary_entry },
    { label: "Experienced Salary", value: outlook.salary_experienced },
    { label: "Growth Potential", value: outlook.growth_potential },
    { label: "Work-Life Balance", value: outlook.work_life_balance },
    { label: "Job Availability", value: outlook.job_availability },
  ];

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-highlight/10 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-highlight" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Tools & Career Outlook</h2>
            <p className="text-xs text-muted-foreground">For {topRec.career_title}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {outlookItems.map((item) => (
            <div key={item.label} className="bg-muted/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{item.label}</p>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ToolsCard;
