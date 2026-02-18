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
  RotateCcw,
  Mail,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { AnalysisResult, CareerRecommendation } from "@/lib/quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResultsViewProps {
  results: AnalysisResult;
  email: string;
  onStartOver: () => void;
}

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

const CareerCard = ({
  rec,
  index,
}: {
  rec: CareerRecommendation;
  index: number;
}) => {
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
        className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {index === 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gradient-primary text-primary-foreground px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3" /> Top Match
                </span>
              )}
              <span className="text-xs text-muted-foreground font-medium">
                #{rec.rank}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground font-display">
              {rec.career_title}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {rec.why_fits.slice(0, 120)}...
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className={`text-3xl font-bold font-display ${fitColor(rec.fit_score)}`}>
                {rec.fit_score}%
              </span>
              <p className="text-xs text-muted-foreground">fit score</p>
            </div>
            <div className="w-24 h-2.5 bg-muted rounded-full overflow-hidden">
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
          className="flex items-center justify-center mt-4 text-xs text-muted-foreground"
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
            <div className="px-6 pb-6 space-y-6 border-t border-border pt-6">
              {/* Why it fits */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Why This Fits You
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.why_fits}</p>
              </div>

              {/* Role description */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" /> What You'll Do
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{rec.role_description}</p>
              </div>

              {/* Skills */}
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

              {/* Career Outlook */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-primary" /> Career Outlook
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Entry Salary", value: rec.career_outlook.salary_entry },
                    { label: "Experienced", value: rec.career_outlook.salary_experienced },
                    { label: "Growth", value: rec.career_outlook.growth_potential },
                    { label: "Work-Life", value: rec.career_outlook.work_life_balance },
                    { label: "Jobs", value: rec.career_outlook.job_availability },
                  ].map((item) => (
                    <div key={item.label} className="bg-muted/50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
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

const ResultsView = ({ results, email, onStartOver }: ResultsViewProps) => {
  const { recommendations, summary } = results;
  const [sending, setSending] = useState(false);

  const handleEmailReport = async () => {
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-report-email", {
        body: { email, results },
      });
      if (error) throw error;
      
      // Open the HTML report in a new tab for download
      if (data?.html) {
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "PathGenie-Career-Report.html";
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success(`📧 Report downloaded! We've also prepared it for ${email}`);
    } catch (err) {
      console.error("Email report error:", err);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const confidenceColor =
    summary.confidence_level === "High"
      ? "text-success"
      : summary.confidence_level === "Medium"
      ? "text-highlight"
      : "text-muted-foreground";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground font-display mb-3">
            Your Career Recommendations
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Based on your profile, here are your top matches ranked by fit score.
          </p>
        </motion.div>

        {/* Summary Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl border border-border shadow-card p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Top Recommendation</p>
              <h2 className="text-2xl font-bold text-foreground font-display">
                {summary.top_recommendation}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <span className={`font-bold font-display text-lg ${confidenceColor}`}>
                {summary.confidence_level}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.confidence_explanation}
          </p>
        </motion.div>

        {/* Career Cards */}
        <div className="space-y-4 mb-10">
          {recommendations.map((rec, i) => (
            <CareerCard key={rec.career_title} rec={rec} index={i} />
          ))}
        </div>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50"
            onClick={handleEmailReport}
            disabled={sending}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {sending ? "Preparing Report..." : "Download Report"}
          </button>
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsView;
