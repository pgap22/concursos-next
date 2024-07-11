-- CreateTable
CREATE TABLE "JuradosConcursos" (
    "id" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,
    "id_jurado" TEXT NOT NULL,

    CONSTRAINT "JuradosConcursos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JuradosConcursos" ADD CONSTRAINT "JuradosConcursos_id_jurado_fkey" FOREIGN KEY ("id_jurado") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuradosConcursos" ADD CONSTRAINT "JuradosConcursos_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "Concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
