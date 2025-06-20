// File: src/components/QuestionCard.tsx
import React from "react";
import { OptionCard } from "@/components/OptionCard";
import { ParsedQuestion } from "@/lib/types";
import { Card } from "@/components/ui/card";

type QuestionProps = {
  question: ParsedQuestion;
  onUpdateQuestion: (updatedQuestion: ParsedQuestion) => void;
  className?: string;
  editMode?: boolean;
  quizMode?: boolean;
  onQuizSubmit?: (result: "correct" | "incorrect") => void;
  submittedResult?: "correct" | "incorrect" | null;
};

export const QuestionCard: React.FC<QuestionProps> = ({
  question,
  onUpdateQuestion,
  className = "",
  editMode = false,
  quizMode = false,
  onQuizSubmit,
  submittedResult = null,
}: QuestionProps) => {
  // Local state for quiz mode (user's selected answers)
  const [selected, setSelected] = React.useState<number[]>([]);
  const [submitted, setSubmitted] = React.useState(false);

  // Reset state if question changes
  React.useEffect(() => {
    setSelected([]);
    setSubmitted(false);
  }, [question.id]);

  React.useEffect(() => {
    if (quizMode && submittedResult) {
      setSubmitted(true);
    }
  }, [quizMode, submittedResult]);

  const handleToggleOption = (optionId: number, newCorrect: boolean) => {
    const updatedOptions = question.options.map((option) =>
      option.id === optionId ? { ...option, correct: newCorrect } : option
    );
    if (updatedOptions.map((option) => option.correct).filter(Boolean).length > 1) {
      question.type = "multi"; // If more than one option is correct, set type to multi
    }
    const updatedQuestion = { ...question, options: updatedOptions };
    onUpdateQuestion(updatedQuestion);
  };

  // Quiz mode: handle user selecting an option
  const handleSelectOption = (optionId: number) => {
    if (submitted) return;
    if (question.type === "single") {
      setSelected([optionId]);
    } else {
      setSelected((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  // Quiz mode: submit answer
  const handleSubmit = () => {
    setSubmitted(true);
    if (quizMode && onQuizSubmit) {
      const isCorrect = question.options.every((opt) =>
        opt.correct === selected.includes(opt.id!)
      );
      onQuizSubmit(isCorrect ? "correct" : "incorrect");
    }
  };

  return (
    <Card className={`p-4 m-2 rounded-lg shadow-md bg-white ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
      <ul className="list-disc pl-5">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            submitted={submitted}
            editMode={editMode}
            onToggle={() => {
              if (editMode) {
                handleToggleOption(option.id!, !option.correct);
              } else {
                handleSelectOption(option.id!);
              }
            }}
            className={
              !editMode && selected.includes(option.id!)
                ? "ring-2 ring-blue-500"
                : ""
            }
          />
        ))}
      </ul>
      {/* Show submit button in quiz mode */}
      {!editMode && !submitted && (
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          Submit Answer
        </button>
      )}
      {/* Show feedback after submission in quiz mode */}
      {!editMode && submitted && (
        <div className="mt-4">
          {question.options.every((opt) =>
            opt.correct === selected.includes(opt.id!)
          ) ? (
            <span className="text-green-600 font-semibold">Correct!</span>
          ) : (
            <span className="text-red-600 font-semibold">Incorrect.</span>
          )}
        </div>
      )}
    </Card>
  );
};
