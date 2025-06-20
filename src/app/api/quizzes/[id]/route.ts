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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid quiz id" }, { status: 400 });
  }
  const data = await req.json();
  try {
    await prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    await prisma.question.deleteMany({ where: { quizId: id } });

    for (const q of data.questions) {
      const createdQ = await prisma.question.create({
        data: {
          text: q.text,
          type: q.type,
          quizId: id,
        },
      });
      for (const o of q.options) {
        await prisma.option.create({
          data: {
            text: o.text,
            correct: o.correct,
            questionId: createdQ.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}
