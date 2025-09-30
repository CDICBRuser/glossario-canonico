import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - atualizar termo existente
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();

    // validação simples
    const termoId = Number(id);
    if (isNaN(termoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const atualizado = await prisma.termo.update({
      where: { id: termoId },
      data,
    });

    return NextResponse.json(atualizado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - apagar termo
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const termoId = Number(id);

    if (isNaN(termoId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.termo.delete({ where: { id: termoId } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
