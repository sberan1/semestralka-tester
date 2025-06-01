// src/app/api/option/[oid]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch a specific option by ID
export async function GET(
  req: Request,
  { params }: { params: { oid: string } },
) {
  const option = await prisma.option.findUnique({
    where: { id: Number(params.oid) },
  });

  if (!option) {
    return NextResponse.json({ error: "OptionCard not found" }, { status: 404 });
  }

  return NextResponse.json(option);
}

// PATCH: Update a specific option by ID
export async function PATCH(
  req: Request,
  { params }: { params: { oid: string } },
) {
  const data = await req.json();

  const updatedOption = await prisma.option.update({
    where: { id: Number(params.oid) },
    data,
  });

  return NextResponse.json(updatedOption);
}

// DELETE: Delete a specific option by ID
export async function DELETE(
  req: Request,
  { params }: { params: { oid: string } },
) {
  await prisma.option.delete({
    where: { id: Number(params.oid) },
  });

  return NextResponse.json({ message: "OptionCard deleted successfully" });
}
