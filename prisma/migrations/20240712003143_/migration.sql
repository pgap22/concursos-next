-- CreateTable
CREATE TABLE "DatosGeneralesConcursante" (
    "id" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "id_concursante" TEXT NOT NULL,

    CONSTRAINT "DatosGeneralesConcursante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatosGeneralesConcursante_id_concursante_key" ON "DatosGeneralesConcursante"("id_concursante");

-- AddForeignKey
ALTER TABLE "DatosGeneralesConcursante" ADD CONSTRAINT "DatosGeneralesConcursante_id_concursante_fkey" FOREIGN KEY ("id_concursante") REFERENCES "concursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
