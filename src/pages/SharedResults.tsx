import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ResultsView from "@/components/ResultsView";
import type { AnalysisResult } from "@/lib/quizData";
import { Loader2 } from "lucide-react";

const SharedResults = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) {
        setError("Invalid link");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("shared_results")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !data) {
        setError("Results not found or link has expired.");
        setLoading(false);
        return;
      }

      setResults(data.results as unknown as AnalysisResult);
      setEmail(data.email || "");
      setLoading(false);
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground font-display mb-2">Oops!</h1>
          <p className="text-muted-foreground">{error || "Something went wrong."}</p>
        </div>
      </div>
    );
  }

  return <ResultsView results={results} email={email} onStartOver={() => window.location.href = "/"} isShared />;
};

export default SharedResults;
