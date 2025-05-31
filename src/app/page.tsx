"use client";

import { useQuizStore } from "@/store/store";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import QuizzCard from "@/components/QuizzCard";

export default function Home() {
  const { quizzes, fetchQuizzes, activeQuizId } = useQuizStore();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <>
      <Label>{activeQuizId}</Label>
      {quizzes.map((q) => (
        <QuizzCard
          key={q.id}
          id={q.id}
          title={q.title}
          description={q.description}
        />
      ))}
    </>
  );
}
