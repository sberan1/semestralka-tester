// File: src/store/store.ts
import { create } from "zustand";
import { Option, Question, Quiz } from "@prisma/client";

interface QuizStore {
  quizzes: Quiz[];
  activeQuizId: number | null;
  activeQuiz: Quiz | null;
  loading: boolean;
  fetchQuizzes: () => Promise<void>;
  setActiveQuiz: (id: number) => Promise<void>;
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
  deleteQuiz: (id: number) => Promise<any>;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [],
  activeQuizId: null,
  activeQuiz: null,
  loading: false,

  fetchQuizzes: async () => {
    set({ loading: true });
    const res = await fetch("/api/quizzes");
    const data = await res.json();
    set({
      quizzes: data,
      loading: false,
      activeQuiz: get().activeQuizId
        ? data.find((q: Quiz) => q.id === get().activeQuizId) || null
        : null,
    });
  },

  setActiveQuiz: async (id) => {
    const res = await fetch(`/api/quizzes/${id}`);
    const selectedQuiz = await res.json();
    set({ activeQuizId: id, activeQuiz: selectedQuiz });
  },

  updateQuestion: async (quizId, questionId, updated) => {
    await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    await get().fetchQuizzes();
  },

  updateOption: async (quizId, questionId, optionId, updated) => {
    await fetch(`/api/quizzes/${quizId}/questions/${questionId}/options/${optionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    await get().fetchQuizzes();
  },

  deleteQuiz: async (id: number) => {
    try {
      const res = await fetch("/api/quizzes/" + id, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        await get().fetchQuizzes();
      } else {
        console.error("Error deleting quiz:", data.error);
      }
      return data;
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
    }
  },
}));
