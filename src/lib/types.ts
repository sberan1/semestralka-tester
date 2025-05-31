type ParsedQuestion = {
  question: string;
  type: "single" | "multi";
  options: { text: string; correct: boolean }[];
};

type ParsedQuiz = ParsedQuestion[];
