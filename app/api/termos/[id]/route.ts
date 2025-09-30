import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - atualizar termo existente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const atualizado = await prisma.termo.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(atualizado);
}

// DELETE - apagar termo
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.termo.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}