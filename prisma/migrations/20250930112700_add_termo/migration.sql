-- CreateTable
CREATE TABLE "public"."Termo" (
    "id" SERIAL NOT NULL,
    "termo" TEXT NOT NULL,
    "definicao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Termo_pkey" PRIMARY KEY ("id")
);
