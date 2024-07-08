/*
  Warnings:

  - Added the required column `descripcion` to the `Concurso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Concurso" ADD COLUMN     "descripcion" TEXT NOT NULL;
