// File: src/app/api/quizzes/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { QuizPayload } from "@/lib/types";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: { include: { options: true } },
    },
  });
  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, questions } = body as QuizPayload;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Remove 'id' fields from questions and options before insertion
    const cleanedQuestions = questions.map((q) => {
      return {
        text: q.text,
        type: q.type,
        options: {
          create: q.options.map((opt) => ({
            text: opt.text,
            correct: opt.correct,
          })),
        },
      };
    });

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: cleanedQuestions,
        },
      },
      include: {
        questions: { include: { options: true } },
      },
    });

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error creating new quiz\n" + error.message },
      { status: 500 }
    );
  }
}
