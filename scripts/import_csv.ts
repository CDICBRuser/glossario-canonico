import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const filePath = "C:/Users/anderson.morais/Desktop/python cic/termo,definicao,fonte.txt";
  const content = fs.readFileSync(filePath, "utf-8");

  const termos: { termo: string; definicao: string; fonte: string }[] = [];

  // Quebramos por linhas
  const lines = content.split(/\r?\n/);

  let currentTerm: { termo: string; definicao: string; fonte: string } | null = null;

  for (const line of lines) {
    // Ignorar linhas vazias
    if (!line.trim()) continue;

    // Detecta o começo de um novo termo: começa com aspas "
    if (line.startsWith('"')) {
      // Salva termo anterior
      if (currentTerm) termos.push(currentTerm);

      // Divide pelo separador de CSV (vírgula), respeitando aspas
      const match = line.match(/^"([^"]+)","([^"]+)","([^"]+)"$/);
      if (match) {
        currentTerm = {
          termo: match[1].trim(),
          definicao: match[2].trim(),
          fonte: match[3].trim(),
        };
      } else {
        console.warn("Linha com formato inesperado:", line);
        currentTerm = null;
      }
    } else {
      // Linha continua a definição ou fonte do termo atual
      if (currentTerm) {
        currentTerm.fonte += " " + line.trim();
      }
    }
  }

  // Adiciona o último termo
  if (currentTerm) termos.push(currentTerm);

  console.log(`Total de termos lidos: ${termos.length}`);

  for (const t of termos) {
    await prisma.termo.create({ data: t });
  }

  console.log("Importação finalizada!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});