import React from "react";

interface QuizProgressGridProps {
  answers: ("correct" | "incorrect" | null)[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRetake: (index: number) => void;
}

const QuizProgressGrid: React.FC<QuizProgressGridProps> = ({
  answers,
  currentIndex,
  onSelect,
  onRetake,
}) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {answers.map((a, i) => (
        <div key={i} className="relative">
          <button
            onClick={() => onSelect(i)}
            className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm transition-colors
              ${a === "correct" ? "bg-green-500 text-white" : a === "incorrect" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"}
              ${currentIndex === i ? "ring-2 ring-blue-500" : ""}
              ${currentIndex === i ? " scale-110" : ""}
            `}
            aria-label={`Go to question ${i + 1}`}
            type="button"
          >
            {i + 1}
          </button>
          {a === "incorrect" && (
            <button
              onClick={() => onRetake(i)}
              className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full w-5 h-5 flex items-center justify-center text-xs text-red-500 shadow hover:bg-gray-100"
              title="Retake question"
              aria-label="Retake question"
            >
              ↺
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizProgressGrid;

