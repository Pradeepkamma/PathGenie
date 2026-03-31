import { motion } from "framer-motion";
import { generatePdfReport } from "@/lib/generatePdfReport";
import ResultsCharts from "./ResultsCharts";
import CareerChatbot from "./CareerChatbot";
import ProgressTracker from "./ProgressTracker";
import ResourceLibrary from "./ResourceLibrary";
import PeerComparison from "./PeerComparison";
import CareerComparisonTable from "./CareerComparisonTable";
import GoalSummaryCard from "./results/GoalSummaryCard";
import RoadmapCard from "./results/RoadmapCard";
import SkillsCard from "./results/SkillsCard";
import ToolsCard from "./results/ToolsCard";
import NextStepsCard from "./results/NextStepsCard";
import CareerCard from "./results/CareerCard";
import {
  Send,
  RotateCcw,
  Mail,
  Loader2,
  Share2,
  Link,
} from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResultsViewProps {
  results: AnalysisResult;
  email: string;
  onStartOver: () => void;
  isShared?: boolean;
}

const ResultsView = ({ results, email, onStartOver, isShared }: ResultsViewProps) => {
  const { recommendations, summary } = results;
  const [emailing, setEmailing] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleDownloadReport = () => {
    generatePdfReport(results);
    toast.success("📄 PDF report downloaded!");
  };

  const handleSendToEmail = async () => {
    setEmailing(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-report-email", {
        body: { email, results },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`📧 Report sent to ${email}!`);
    } catch (err) {
      console.error("Email report error:", err);
      toast.error("Failed to send report. Please try again.");
    } finally {
      setEmailing(false);
    }
  };

  const handleShare = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("🔗 Link copied to clipboard!");
      return;
    }
    try {
      const { data, error } = await supabase
        .from("shared_results")
        .insert([{ email, results: JSON.parse(JSON.stringify(results)) }])
        .select("id")
        .single();
      if (error) throw error;
      const url = `${window.location.origin}/results/${data.id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      toast.success("🔗 Shareable link copied to clipboard!");
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to create shareable link.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-display mb-2 sm:mb-3">
            Your Career Recommendations
          </h1>
          <p className="text-xs sm:text-base text-muted-foreground max-w-md mx-auto">
            Based on your profile, here are your top matches ranked by fit score.
          </p>
        </motion.div>

        {/* Structured Card Sections */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-10">
          <GoalSummaryCard summary={summary} />
          <RoadmapCard recommendations={recommendations} />
          <SkillsCard recommendations={recommendations} />
          <ToolsCard recommendations={recommendations} />
          <NextStepsCard recommendations={recommendations} />
        </div>

        {/* Charts */}
        <ResultsCharts recommendations={recommendations} />

        {/* Progress Tracker */}
        {!isShared && (
          <ProgressTracker recommendations={recommendations} email={email} />
        )}

        {/* Peer Comparison */}
        {!isShared && (
          <PeerComparison recommendations={recommendations} />
        )}

        {/* Resource Library */}
        <ResourceLibrary recommendations={recommendations} />

        {/* Career Comparison Table */}
        <CareerComparisonTable recommendations={recommendations} />

        {/* All Career Cards */}
        <div className="space-y-4 mb-8 sm:mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-foreground font-display">All Career Matches</h2>
          {recommendations.map((rec, i) => (
            <CareerCard key={rec.career_title} rec={rec} index={i} />
          ))}
        </div>

        {/* Actions */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity text-xs sm:text-base"
            onClick={handleDownloadReport}
          >
            <Mail className="w-4 h-4" /> Download Report
          </button>
          {!isShared && (
            <button
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-accent text-accent-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity disabled:opacity-50 text-xs sm:text-base"
              onClick={handleSendToEmail}
              disabled={emailing}
            >
              {emailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {emailing ? "Sending..." : "Email Report"}
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity text-xs sm:text-base"
          >
            {shareUrl ? <Link className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {shareUrl ? "Copy Link" : "Share"}
          </button>
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 font-medium transition-colors text-xs sm:text-base"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </button>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-8 sm:mt-12 text-center bg-gradient-card rounded-2xl border border-border shadow-card p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-foreground font-display mb-2">
            🚀 Want more personalized guidance?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
            Start over with different answers, or reach out for detailed career coaching.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onStartOver}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition-opacity text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <a
              href="mailto:feedback@pathgenie.com"
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors text-sm"
            >
              <Mail className="w-4 h-4" /> Contact / Feedback
            </a>
          </div>
        </motion.div>
      </div>

      {/* AI Career Chatbot */}
      <CareerChatbot results={results} />
    </div>
  );
};

export default ResultsView;
