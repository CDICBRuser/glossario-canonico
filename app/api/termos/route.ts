import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - listar todos os termos
export async function GET() {
  const termos = await prisma.termo.findMany({ orderBy: { termo: "asc" } });
  return NextResponse.json(termos);
}

// POST - criar novo termo
export async function POST(req: Request) {
  const data = await req.json();
  const novo = await prisma.termo.create({ data });
  return NextResponse.json(novo);
}