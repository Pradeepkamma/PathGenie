import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  TrendingUp,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Star,
} from "lucide-react";
import { useState } from "react";
import type { CareerRecommendation } from "@/lib/quizData";

const fitColor = (score: number) => {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-highlight";
  return "text-muted-foreground";
};

const fitBgColor = (score: number) => {
  if (score >= 85) return "bg-success";
  if (score >= 70) return "bg-highlight";
  return "bg-muted-foreground";
};

const CareerCard = ({ rec, index }: { rec: CareerRecommendation; index: number }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`bg-card rounded-2xl border border-border shadow-card overflow-hidden ${
        index === 0 ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div
        className="p-4 sm:p-6 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              {index === 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-primary text-primary-foreground px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3" /> Top Match
                </span>
              )}
              <span className="text-xs text-muted-foreground font-medium">#{rec.rank}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground font-display">{rec.career_title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
              {rec.why_fits.slice(0, 120)}...
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="text-right">
              <span className={`text-2xl sm:text-3xl font-bold font-display ${fitColor(rec.fit_score)}`}>
                {rec.fit_score}%
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground">fit score</p>
            </div>
            <div className="w-16 sm:w-24 h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${fitBgColor(rec.fit_score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${rec.fit_score}%` }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        <motion.div
          className="flex items-center justify-center mt-3 sm:mt-4 text-xs text-muted-foreground"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6 border-t border-border pt-4 sm:pt-6">
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Why This Fits You
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.why_fits}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" /> What You'll Do
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.role_description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Skills You Have
                  </h4>
                  <ul className="space-y-2">
                    {rec.skills_you_have.map((skill) => (
                      <li key={skill} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-highlight" /> Skills to Develop
                  </h4>
                  <ul className="space-y-2">
                    {rec.skills_to_develop.map((skill) => (
                      <li key={skill} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-3.5 h-3.5 text-highlight mt-0.5 flex-shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-primary" /> Career Outlook
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: "Entry Salary", value: rec.career_outlook.salary_entry },
                    { label: "Experienced", value: rec.career_outlook.salary_experienced },
                    { label: "Growth", value: rec.career_outlook.growth_potential },
                    { label: "Work-Life", value: rec.career_outlook.work_life_balance },
                    { label: "Jobs", value: rec.career_outlook.job_availability },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 rounded-xl p-2.5 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <ArrowRight className="w-4 h-4 text-accent" /> Your Next Steps
                </h4>
                <ol className="space-y-2">
                  {rec.next_steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent font-semibold text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CareerCard;
