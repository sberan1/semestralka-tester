'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuizStore } from "@/store/store";
import type { Quiz, Question, Option } from "@prisma/client";
import { QuestionCard } from "@/components/QuestionCard";
import QuizProgressGrid from "@/components/QuizProgressGrid";

type QuizWithQuestions = Quiz & {
  questions: (Question & { options: Option[] })[]
};

export default function QuizPage() {
  const { id } = useParams();
  const { activeQuiz, activeQuizId, fetchQuizzes, setActiveQuiz } = useQuizStore();
  const [loading, setLoading] = useState(true);
  const [shuffledQuestions, setShuffledQuestions] = useState<(Question & { options: Option[] })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<("correct" | "incorrect" | null)[]>([]);

  const [retakeKey, setRetakeKey] = useState(0);

  const quiz = activeQuiz as QuizWithQuestions;

  const LS_KEY = (id: string | number) => `quiz-answers-${id}`;
  const LS_SHUFFLE_KEY = (id: string | number) => `quiz-shuffle-${id}`;

  function loadAnswers(id: string | number, count: number) {
    if (typeof window === "undefined") return Array(count).fill(null);
    try {
      const raw = localStorage.getItem(LS_KEY(id));
      if (!raw) return Array(count).fill(null);
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length !== count) return Array(count).fill(null);
      return arr;
    } catch {
      return Array(count).fill(null);
    }
  }

  function saveAnswers(id: string | number, answers: ("correct" | "incorrect" | null)[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_KEY(id), JSON.stringify(answers));
  }

  function loadShuffle(id: string | number, count: number) {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(LS_SHUFFLE_KEY(id));
      if (!raw) return null;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || arr.length !== count) return null;
      return arr;
    } catch {
      return null;
    }
  }

  function saveShuffle(id: string | number, order: number[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LS_SHUFFLE_KEY(id), JSON.stringify(order));
  }

  useEffect(() => {
    if ((!activeQuiz && id) || activeQuizId !== Number(id)) {
      fetchQuizzes().then(() => {
        const quizId = Number(id);
        setActiveQuiz(quizId);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [activeQuiz, id, fetchQuizzes, setActiveQuiz, activeQuizId]);

  useEffect(() => {
    if (quiz && quiz.questions) {
      let order = loadShuffle(id, quiz.questions.length);
      if (!order) {
        order = [...Array(quiz.questions.length).keys()]
          .sort(() => Math.random() - 0.5);
        saveShuffle(id, order);
      }
      const shuffled = order.map((i: number) => quiz.questions[i]);
      setShuffledQuestions(shuffled);
      setCurrentIndex(0);
      setAnswers(loadAnswers(id, shuffled.length));
    }
  }, [quiz]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz || !quiz.questions) {
    return <div>Quiz not found</div>;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, shuffledQuestions.length - 1));
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleAnswer = (result: "correct" | "incorrect") => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = result;
      saveAnswers(id, updated);
      return updated;
    });
  };

  const handleRetake = (index: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[index] = null;
      saveAnswers(id, updated);
      return updated;
    });
    setCurrentIndex(index);
    setRetakeKey((k) => k + 1);
  };

  const numCorrect = answers.filter((a) => a === "correct").length;
  const numIncorrect = answers.filter((a) => a === "incorrect").length;
  const numAnswered = answers.filter((a) => a !== null).length;
  const percent = numAnswered > 0 ? Math.round((numCorrect / numAnswered) * 100) : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="w-full p-10 bg-white rounded-lg shadow-lg mx-36">
        <h1 className="text-2xl font-bold mb-4 text-center">{quiz.title}</h1>
        {quiz.description && <p className="mb-6 text-center text-gray-600">{quiz.description}</p>}
        <div className="flex flex-row-reverse items-center justify-center mb-6">
        <div className="flex flex-wrap content-between mb-6 ml-7 justify-center gap-6 max-w-md">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            Correct: <span className="font-bold text-green-600">{numCorrect}</span> &nbsp;|
            Incorrect: <span className="font-bold text-red-600">{numIncorrect}</span> &nbsp;|
            Answered: <span className="font-bold">{numAnswered}/{answers.length}</span> &nbsp;|
            Score: <span className="font-bold text-blue-600">{percent}%</span>
          </div>
              <QuizProgressGrid
                answers={answers}
                currentIndex={currentIndex}
                onSelect={setCurrentIndex}
                onRetake={handleRetake}
              />
        </div>
        {shuffledQuestions.length > 0 && (
          <div className='w-lg'>
            <QuestionCard
              key={currentIndex + '-' + retakeKey}
              question={shuffledQuestions[currentIndex]}
              onUpdateQuestion={() => {}}
              editMode={false}
              quizMode={true}
              onQuizSubmit={handleAnswer}
              submittedResult={answers[currentIndex]}
            />
            <div className="flex gap-4 mt-4 justify-center">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === shuffledQuestions.length - 1}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500 text-center">
              Question {currentIndex + 1} of {shuffledQuestions.length}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
