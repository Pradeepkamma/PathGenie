import { motion } from "framer-motion";
import { Brain, Cpu, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const stages = [
  { icon: Brain, label: "Analyzing your profile..." },
  { icon: Cpu, label: "Matching career paths..." },
  { icon: Target, label: "Calculating fit scores..." },
  { icon: Zap, label: "Generating recommendations..." },
];

interface AnalysisScreenProps {
  onComplete: () => void;
}

const AnalysisScreen = ({ onComplete }: AnalysisScreenProps) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [onComplete]);

  const CurrentIcon = stages[stageIndex].icon;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-elevated"
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <CurrentIcon className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2
          key={stageIndex}
          className="text-2xl sm:text-3xl font-bold text-white font-display mb-4 drop-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {stages[stageIndex].label}
        </motion.h2>

        <div className="flex gap-2 justify-center mt-6">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= stageIndex ? "w-8 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        <p className="text-white/85 text-sm mt-8 font-medium">
          This usually takes about 10–15 seconds
        </p>
      </motion.div>
    </div>
  );
};

export default AnalysisScreen;
