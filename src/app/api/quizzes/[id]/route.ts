import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const quizId = Number(params.id);
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json(quiz);
}

export async function DELETE (
  request: Request,
  { params }: { params: { id: string } }
){
  const quizId = Number(params.id);

  try {
    await prisma.quiz.delete({
      where: { id: quizId },
    });
    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting quiz\n" + error.message },
      { status: 500 }
    );
  }
}
