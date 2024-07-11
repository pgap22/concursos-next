/*
  Warnings:

  - Added the required column `id_criterio_ponderacion` to the `PuntajesConcursante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PuntajesConcursante" ADD COLUMN     "id_criterio_ponderacion" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PuntajesConcursante" ADD CONSTRAINT "PuntajesConcursante_id_criterio_ponderacion_fkey" FOREIGN KEY ("id_criterio_ponderacion") REFERENCES "CriteriosPonderacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
