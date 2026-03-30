import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import StepIndicator from "@/components/StepIndicator";
import LandingScreen from "@/components/LandingScreen";
import Questionnaire from "@/components/Questionnaire";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultsView from "@/components/ResultsView";
import { questions, type AnalysisResult } from "@/lib/quizData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppStep = "landing" | "questionnaire" | "analysis" | "results";

const stepMap: Record<AppStep, number> = {
  landing: 0,
  questionnaire: 1,
  analysis: 2,
  results: 3,
};

const Index = () => {
  const [step, setStep] = useState<AppStep>("landing");
  const [email, setEmail] = useState("");
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

  const showNavAndSteps = step !== "landing";

  return (
    <div className="min-h-screen flex flex-col">
      {showNavAndSteps && (
        <>
          <Navbar currentStep={stepMap[step]} />
          <StepIndicator currentStep={stepMap[step]} />
        </>
      )}

      <div className="flex-1">
        {step === "landing" && <LandingScreen onStart={handleStart} />}
        {step === "questionnaire" && <Questionnaire onComplete={handleQuizComplete} />}
        {step === "analysis" && <AnalysisScreen onComplete={handleAnalysisComplete} />}
        {step === "results" && results && (
          <ResultsView results={results} email={email} onStartOver={handleStartOver} />
        )}
      </div>
    </div>
  );
};

export default Index;
