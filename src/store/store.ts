// store/useQuizStore.ts
import { create } from "zustand";
import { Option, Question, Quiz } from "@prisma/client";

interface QuizStore {
  quizzes: Quiz[];
  activeQuizId: number | null;
  loading: boolean;
  fetchQuizzes: () => Promise<void>;
  setActiveQuiz: (id: number) => void;
  updateQuestion: (
    quizId: number,
    questionId: number,
    updated: Partial<Question>,
  ) => Promise<void>;
  updateOption: (
    quizId: number,
    questionId: number,
    optionId: number,
    updated: Partial<Option>,
  ) => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  activeQuizId: null,
  loading: false,

  fetchQuizzes: async () => {
    set({ loading: true });
    const res = await fetch("/api/quizzes");
    const data = await res.json();
    set({ quizzes: data, loading: false });
  },

  setActiveQuiz: (id) => set({ activeQuizId: id }),

  updateQuestion: async (quizId, questionId, updated) => {
    await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    await get().fetchQuizzes(); // reload
  },

  updateOption: async (quizId, questionId, optionId, updated) => {
    await fetch(
      `/api/quizzes/${quizId}/questions/${questionId}/options/${optionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      },
    );

    await get().fetchQuizzes();
  },
}));
