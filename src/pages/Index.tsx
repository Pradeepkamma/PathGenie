import { useState, useCallback } from "react";
import LandingScreen from "@/components/LandingScreen";
import Questionnaire from "@/components/Questionnaire";
import AnalysisScreen from "@/components/AnalysisScreen";
import ResultsView from "@/components/ResultsView";
import { mockResults } from "@/lib/quizData";

type AppStep = "landing" | "questionnaire" | "analysis" | "results";

const Index = () => {
  const [step, setStep] = useState<AppStep>("landing");
  const [_email, setEmail] = useState("");

  const handleStart = (email: string) => {
    setEmail(email);
    setStep("questionnaire");
  };

  const handleQuizComplete = (_answers: Record<string, any>) => {
    setStep("analysis");
  };

  const handleAnalysisComplete = useCallback(() => {
    setStep("results");
  }, []);

  const handleStartOver = () => {
    setStep("landing");
    setEmail("");
  };

  switch (step) {
    case "landing":
      return <LandingScreen onStart={handleStart} />;
    case "questionnaire":
      return <Questionnaire onComplete={handleQuizComplete} />;
    case "analysis":
      return <AnalysisScreen onComplete={handleAnalysisComplete} />;
    case "results":
      return <ResultsView results={mockResults} onStartOver={handleStartOver} />;
  }
};

export default Index;
