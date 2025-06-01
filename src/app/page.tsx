"use client";

import { useQuizStore } from "@/store/store";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import QuizzCard from "@/components/QuizzCard";
import PlusCard from "@/components/PlusCard";

export default function Home() {
  const { quizzes, fetchQuizzes, activeQuizId } = useQuizStore();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <>
      <Label>{activeQuizId}</Label>
      <div className={"flex flex-col items-center justify-start min-h-screen p-4 h-screen"}>
      <h1 className={"mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"}>Test Browser for 4IT427</h1>

      <div className={"flex flex-row flex-wrap justify-center items-center"}>
        {quizzes.map((q) => (
        <QuizzCard
          key={q.id}
          id={q.id}
          title={q.title}
          description={q.description}
          className={"m-5 min-w-sm flex content-between justify-between"}
        />
      ))}
       <PlusCard className={"m-5 min-w-sm"} />
      </div>
      </div>
    </>
  );
}
