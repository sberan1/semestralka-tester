// File: src/lib/types.ts
export type ParsedOption = {
  id?: number;
  text: string;
  correct: boolean;
};

export type ParsedQuestion = {
  id?: number;
  text: string;
  type: "single" | "multi";
  options: ParsedOption[];
};

export type ParsedQuiz = ParsedQuestion[];

export type QuizPayload = {
  title: string;
  description?: string;
  questions: ParsedQuiz;
};
