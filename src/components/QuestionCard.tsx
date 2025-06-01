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
};

export const QuestionCard: React.FC<QuestionProps> = ({
                                                        question,
                                                        onUpdateQuestion,
                                                        className = "",
  editMode = false,
                                                      }: QuestionProps) => {
  // Handles toggle for an option by updating its correctness state locally.
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

  return (
    <Card className={`p-4 m-2 rounded-lg shadow-md bg-white ${className}`}>
      <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
      <ul className="list-disc pl-5">
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            submitted={false}
            editMode={editMode}
            onToggle={() => {
              if (!editMode) return; // Only allow toggling in edit mode
              handleToggleOption(option.id!, !option.correct)
            }
          }
          />
        ))}
      </ul>
    </Card>
  );
};
