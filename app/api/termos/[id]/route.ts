import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - atualizar termo existente
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const data = await req.json();
    const termoId = Number(id);
    if (isNaN(termoId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const atualizado = await prisma.termo.update({
      where: { id: termoId },
      data,
    });

    return NextResponse.json(atualizado);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - apagar termo
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const termoId = Number(id);
    if (isNaN(termoId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.termo.delete({ where: { id: termoId } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}