// src/app/api/quizzes/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
  return NextResponse.json(quizzes);
}
