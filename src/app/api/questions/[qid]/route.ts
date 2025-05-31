// src/app/api/questions/[qid]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; qid: string } },
) {
  const data = await req.json();

  const updated = await prisma.question.update({
    where: { id: Number(params.qid) },
    data,
  });

  return NextResponse.json(updated);
}

export async function GET() {
  return NextResponse.json(
    { message: "Method not implemented" },
    { status: 405 },
  );
}
