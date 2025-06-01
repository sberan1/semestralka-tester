'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuizStore } from "@/store/store";
import type { Quiz, Question, Option } from "@prisma/client";

type QuizWithQuestions = Quiz & {
  questions: (Question & { options: Option[] })[]
};

export default function QuizPage() {
  const { id } = useParams();
  const { activeQuiz, activeQuizId, fetchQuizzes, setActiveQuiz } = useQuizStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If there is no active quiz, fetch everything and set the active quiz based on the URL id.
    if (!activeQuiz && id || activeQuizId !== Number(id)) {
      fetchQuizzes().then(() => {
        const quizId = Number(id);
        setActiveQuiz(quizId);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activeQuiz, id, fetchQuizzes, setActiveQuiz]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Cast activeQuiz to the extended type with questions and options.
  const quiz = activeQuiz as QuizWithQuestions;

  if (!quiz || !quiz.questions) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="p-8">
  <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
  {quiz.description && <p className="mb-8">{quiz.description}</p>}
  {quiz.questions.map((question) => (
    <div key={question.id} className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">{question.text}</h2>
    <ul className="list-disc list-inside">
  {question.options.map((option) => (
      <li key={option.id} className="ml-4">{option.text}</li>
  ))}
  </ul>
  </div>
  ))}
</div>
);
}
