import { useState } from "react";
import { motion } from "framer-motion";
import { Columns3, ChevronDown, ChevronUp, CheckCircle2, BookOpen } from "lucide-react";
import type { CareerRecommendation } from "@/lib/quizData";

interface CareerComparisonTableProps {
  recommendations: CareerRecommendation[];
}

const fitBadge = (score: number) => {
  if (score >= 85) return "bg-success/15 text-success";
  if (score >= 70) return "bg-highlight/15 text-highlight";
  return "bg-muted text-muted-foreground";
};

const CareerComparisonTable = ({ recommendations }: CareerComparisonTableProps) => {
  const [open, setOpen] = useState(false);

  if (recommendations.length < 2) return null;

  const rows = [
    {
      label: "Fit Score",
      render: (rec: CareerRecommendation) => (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${fitBadge(rec.fit_score)}`}>
          {rec.fit_score}%
        </span>
      ),
    },
    {
      label: "Entry Salary",
      render: (rec: CareerRecommendation) => (
        <span className="text-sm text-foreground font-medium">{rec.career_outlook.salary_entry}</span>
      ),
    },
    {
      label: "Experienced Salary",
      render: (rec: CareerRecommendation) => (
        <span className="text-sm text-foreground font-medium">{rec.career_outlook.salary_experienced}</span>
      ),
    },
    {
      label: "Growth",
      render: (rec: CareerRecommendation) => (
        <span className="text-sm text-foreground">{rec.career_outlook.growth_potential}</span>
      ),
    },
    {
      label: "Work-Life Balance",
      render: (rec: CareerRecommendation) => (
        <span className="text-sm text-foreground">{rec.career_outlook.work_life_balance}</span>
      ),
    },
    {
      label: "Job Availability",
      render: (rec: CareerRecommendation) => (
        <span className="text-xs text-muted-foreground leading-snug">{rec.career_outlook.job_availability}</span>
      ),
    },
    {
      label: "Skills You Have",
      render: (rec: CareerRecommendation) => (
        <ul className="space-y-1">
          {rec.skills_you_have.slice(0, 3).map((s) => (
            <li key={s} className="flex items-start gap-1 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Skills to Develop",
      render: (rec: CareerRecommendation) => (
        <ul className="space-y-1">
          {rec.skills_to_develop.slice(0, 3).map((s) => (
            <li key={s} className="flex items-start gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3 text-highlight mt-0.5 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 bg-card rounded-2xl border border-border shadow-card p-5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Columns3 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground font-display">
              Compare Careers Side-by-Side
            </h2>
            <p className="text-xs text-muted-foreground">
              View all {recommendations.length} careers in a comparison table
            </p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 bg-card rounded-2xl border border-border shadow-card overflow-hidden"
        >
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-left" style={{ minWidth: `${120 + recommendations.length * 150}px` }}>
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 sm:p-4 text-xs font-semibold text-muted-foreground w-24 sm:w-36 sticky left-0 bg-card z-10">
                    Criteria
                  </th>
                  {recommendations.map((rec, i) => (
                    <th key={i} className="p-3 sm:p-4 min-w-[130px] sm:min-w-[160px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">#{rec.rank}</span>
                        <span className="text-xs sm:text-sm font-bold text-foreground font-display leading-tight">
                          {rec.career_title}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={`border-b border-border/50 ${ri % 2 === 0 ? "bg-muted/20" : ""}`}
                  >
                    <td className="p-3 sm:p-4 text-[11px] sm:text-xs font-semibold text-muted-foreground sticky left-0 bg-inherit z-10">
                      {row.label}
                    </td>
                    {recommendations.map((rec, ci) => (
                      <td key={ci} className="p-3 sm:p-4 align-top">
                        {row.render(rec)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CareerComparisonTable;
