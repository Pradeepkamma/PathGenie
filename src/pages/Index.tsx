import { useState, useCallback } from "react";
import LandingScreen from "@/components/LandingScreen";
import Questionnaire from "@/components/Questionnaire";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultsView from "@/components/ResultsView";
import { questions, type AnalysisResult } from "@/lib/quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppStep = "landing" | "questionnaire" | "analysis" | "results";

const Index = () => {
  const [step, setStep] = useState<AppStep>("landing");
  const [_email, setEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleStart = (email: string) => {
    setEmail(email);
    setStep("questionnaire");
  };

  const handleQuizComplete = (quizAnswers: Record<string, any>) => {
    setAnswers(quizAnswers);
    setStep("analysis");
  };

  const handleAnalysisComplete = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-career", {
        body: { answers, questions },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResults(data as AnalysisResult);
      setStep("results");
    } catch (err: any) {
      console.error("Analysis failed:", err);
      toast.error("Analysis failed. Please try again.");
      setStep("questionnaire");
    }
  }, [answers]);

  const handleStartOver = () => {
    setStep("landing");
    setEmail("");
    setAnswers({});
    setResults(null);
  };

  switch (step) {
    case "landing":
      return <LandingScreen onStart={handleStart} />;
    case "questionnaire":
      return <Questionnaire onComplete={handleQuizComplete} />;
    case "analysis":
      return <AnalysisScreen onComplete={handleAnalysisComplete} />;
    case "results":
      return results ? (
        <ResultsView results={results} onStartOver={handleStartOver} />
      ) : null;
  }
};

export default Index;
