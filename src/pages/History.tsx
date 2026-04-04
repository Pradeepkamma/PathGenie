import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Clock, ChevronRight, Loader2, FileText } from "lucide-react";
import type { AnalysisResult } from "@/lib/quizData";

interface HistoryItem {
  id: string;
  results: AnalysisResult;
  created_at: string;
}

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("user_results")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setItems(data.map(d => ({ ...d, results: d.results as unknown as AnalysisResult })));
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentStep={3} />
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display mb-2">
            Your Career History
          </h1>
          <p className="text-muted-foreground mb-8">
            View your past career analysis results
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No results yet</h2>
            <p className="text-muted-foreground mb-6">Take the career quiz to get your first analysis!</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-primary rounded-xl text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Start Quiz
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/results/${item.id}?source=history`)}
                className="bg-gradient-card rounded-xl border border-border shadow-card p-4 sm:p-5 cursor-pointer hover:shadow-elevated transition-shadow group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.results.recommendations?.[0]?.career_title || "Career Analysis"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.results.summary || "View your detailed career recommendations"}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {item.results.recommendations?.slice(0, 3).map((r) => (
                        <span
                          key={r.career_title}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {r.career_title}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
