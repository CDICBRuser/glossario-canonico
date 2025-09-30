import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const termoId = Number(id);
    if (isNaN(termoId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.termo.delete({ where: { id: termoId } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

