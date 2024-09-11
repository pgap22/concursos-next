/*
  Warnings:

  - You are about to drop the column `prueba` on the `Concurso` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Concurso" DROP COLUMN "prueba";

-- AlterTable
ALTER TABLE "concursante" ADD COLUMN     "prueba" BOOLEAN NOT NULL DEFAULT false;
