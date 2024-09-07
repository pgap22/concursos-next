/*
  Warnings:

  - Added the required column `id_jurado` to the `PuntajesConcursante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PuntajesConcursante" ADD COLUMN     "id_jurado" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PuntajesConcursante" ADD CONSTRAINT "PuntajesConcursante_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
