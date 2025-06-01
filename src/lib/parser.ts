// File: src/lib/parser.ts
import { ParsedQuestion } from "@/lib/types";

export function parseQuizFile(fileContent: string): ParsedQuestion[] {
  const lines = fileContent.split(/\r?\n/);
  const result: ParsedQuestion[] = [];

  let currentQuestion: string | null = null;
  let currentOptions: { text: string; correct: boolean; id?: number }[] = [];
  let questionIdCounter = 1;
  let optionIdCounter = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (!trimmed.startsWith("+") && !trimmed.startsWith("-")) {
      // Save previous question if available
      if (currentQuestion && currentOptions.length > 0) {
        const correctCount = currentOptions.filter((opt) => opt.correct).length;
        result.push({
          id: questionIdCounter++,
          text: currentQuestion,
          type: correctCount === 1 ? "single" : "multi",
          options: currentOptions.map((opt) => ({
            id: optionIdCounter++,
            text: opt.text,
            correct: opt.correct,
          })),
        });
        currentOptions = [];
      }
      currentQuestion = trimmed;
    } else {
      const correct = trimmed.startsWith("+");
      const text = trimmed.substring(1).trim();
      currentOptions.push({ id: undefined, text, correct });
    }
  }

  // Save the last question if available
  if (currentQuestion && currentOptions.length > 0) {
    const correctCount = currentOptions.filter((opt) => opt.correct).length;
    result.push({
      id: questionIdCounter++,
      text: currentQuestion,
      type: correctCount === 1 ? "single" : "multi",
      options: currentOptions.map((opt) => ({
        id: optionIdCounter++,
        text: opt.text,
        correct: opt.correct,
      })),
    });
  }

  return result;
}
