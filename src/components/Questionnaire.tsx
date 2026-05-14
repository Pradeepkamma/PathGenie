import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { questions, type Question } from "@/lib/quizData";

interface QuestionnaireProps {
  onComplete: (answers: Record<string, any>) => void;
}

const RatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex gap-2 flex-wrap justify-center">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
      <motion.button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={`w-12 h-12 rounded-xl font-semibold text-lg transition-all ${
          value === n
            ? "bg-gradient-primary text-primary-foreground shadow-soft"
            : "bg-card border border-border text-foreground hover:border-primary/50"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {n}
      </motion.button>
    ))}
  </div>
);

const MultiSelect = ({
  options,
  selected,
  onChange,
  allowOther,
  otherValue,
  onOtherChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
}) => {
  const otherSelected = selected.includes("other");
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <motion.button
              key={opt.value}
              type="button"
              onClick={() =>
                onChange(
                  isSelected
                    ? selected.filter((v) => v !== opt.value)
                    : [...selected, opt.value]
                )
              }
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? "bg-gradient-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSelected && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
              {opt.label}
            </motion.button>
          );
        })}
        {allowOther && (
          <motion.button
            type="button"
            onClick={() =>
              onChange(
                otherSelected
                  ? selected.filter((v) => v !== "other")
                  : [...selected, "other"]
              )
            }
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              otherSelected
                ? "bg-gradient-primary text-primary-foreground shadow-soft"
                : "bg-card border border-border text-foreground hover:border-primary/50"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {otherSelected && <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />}
            Other
          </motion.button>
        )}
      </div>
      {allowOther && otherSelected && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Type your language(s) here, comma separated"
          className="mt-4 w-full block px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
      )}
    </div>
  );
};

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const current = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;

  const currentAnswer = answers[current.id];

  const isAnswered = () => {
    if (!current.required) return true;
    if (!currentAnswer) return false;
    if (Array.isArray(currentAnswer)) return currentAnswer.length > 0;
    if (typeof currentAnswer === "string") return currentAnswer.trim().length > 0;
    return true;
  };

  const setAnswer = (value: any) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const next = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Merge any "other" free-text into the relevant multi-select answers
      const merged = { ...answers };
      Object.keys(answers).forEach((key) => {
        if (key.endsWith("_other")) {
          const baseKey = key.replace(/_other$/, "");
          const arr = Array.isArray(merged[baseKey]) ? [...merged[baseKey]] : [];
          const otherText = (answers[key] || "").trim();
          const idx = arr.indexOf("other");
          if (idx !== -1 && otherText) {
            arr.splice(idx, 1, ...otherText.split(",").map((s: string) => s.trim()).filter(Boolean));
            merged[baseKey] = arr;
          }
          delete merged[key];
        }
      });
      onComplete(merged);
    }
  };

  const back = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const renderInput = (q: Question) => {
    switch (q.type) {
      case "select":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {q.options?.map((opt) => (
              <motion.button
                key={opt.value}
                type="button"
                onClick={() => setAnswer(opt.value)}
                className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                  currentAnswer === opt.value
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "bg-card border border-border text-foreground hover:border-primary/50"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        );
      case "multi-select":
        return (
          <MultiSelect
            options={q.options || []}
            selected={currentAnswer || []}
            onChange={setAnswer}
            allowOther={q.id === "languages"}
            otherValue={answers[`${q.id}_other`] || ""}
            onOtherChange={(v) =>
              setAnswers((prev) => ({ ...prev, [`${q.id}_other`]: v }))
            }
          />
        );
      case "rating":
        return <RatingInput value={currentAnswer || 0} onChange={setAnswer} />;
      case "textarea":
        return (
          <textarea
            value={currentAnswer || ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={4}
            className="w-full max-w-lg mx-auto block px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        );
      default:
        return (
          <input
            type="text"
            value={currentAnswer || ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={q.placeholder}
            className="w-full max-w-lg mx-auto block px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-muted-foreground">
              Question {currentIndex + 1} of {total}
            </span>
            <span className="font-medium text-primary font-display">
              {current.category}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex items-start justify-center px-4 pt-4 pb-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              {current.difficulty && (
                <span
                  className={`inline-block mb-2 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    current.difficulty === "basic"
                      ? "bg-success/15 text-success"
                      : current.difficulty === "intermediate"
                      ? "bg-highlight/15 text-highlight"
                      : "bg-primary/15 text-primary"
                  }`}
                >
                  {current.difficulty === "basic"
                    ? "🟢 Basic"
                    : current.difficulty === "intermediate"
                    ? "🟡 Intermediate"
                    : "🔴 Advanced"}
                </span>
              )}
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 font-display">
                {current.question}
              </h2>
              {current.helperText && (
                <p className="text-muted-foreground text-xs mb-3">
                  {current.helperText}
                </p>
              )}
              {!current.helperText && <div className="mb-3" />}
              {renderInput(current)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={back}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <motion.button
            onClick={next}
            disabled={!isAnswered()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-primary text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed shadow-soft transition-opacity"
            whileHover={isAnswered() ? { scale: 1.03 } : {}}
            whileTap={isAnswered() ? { scale: 0.97 } : {}}
          >
            {currentIndex === total - 1 ? "Get Recommendations" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
