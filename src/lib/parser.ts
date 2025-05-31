function parseQuizFile(fileContent: string): ParsedQuestion[] {
  const lines = fileContent.split(/\r?\n/);
  const result: ParsedQuestion[] = [];

  let currentQuestion: string | null = null;
  let currentOptions: { text: string; correct: boolean }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (!trimmed.startsWith("+") && !trimmed.startsWith("-")) {
      // Save the previous question
      if (currentQuestion && currentOptions.length > 0) {
        const correctCount = currentOptions.filter((opt) => opt.correct).length;
        result.push({
          question: currentQuestion,
          type: correctCount === 1 ? "single" : "multi",
          options: currentOptions,
        });
        currentOptions = [];
      }
      currentQuestion = trimmed;
    } else {
      const correct = trimmed.startsWith("+");
      const text = trimmed.substring(1).trim();
      currentOptions.push({ text, correct });
    }
  }

  // Save the last question
  if (currentQuestion && currentOptions.length > 0) {
    const correctCount = currentOptions.filter((opt) => opt.correct).length;
    result.push({
      question: currentQuestion,
      type: correctCount === 1 ? "single" : "multi",
      options: currentOptions,
    });
  }

  return result;
}
