-- CreateEnum
CREATE TYPE "estadoConcurso" AS ENUM ('inscripcion', 'evaluacion', 'finalizado');

-- CreateEnum
CREATE TYPE "roles" AS ENUM ('jurado', 'admin');

-- CreateEnum
CREATE TYPE "PonderacionTipo" AS ENUM ('personalizado', 'escalaUnoCinco', 'Si_No');

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "roles" NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concurso" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" "estadoConcurso" NOT NULL,
    "id_rubrica" TEXT,

    CONSTRAINT "Concurso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubrica" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Rubrica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubricaCriterios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_rubrica" TEXT NOT NULL,

    CONSTRAINT "RubricaCriterios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CriteriosPonderacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_criterio" TEXT NOT NULL,
    "tipo" "PonderacionTipo" NOT NULL,

    CONSTRAINT "CriteriosPonderacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concursante" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,

    CONSTRAINT "concursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipacionConcursante" (
    "id" TEXT NOT NULL,
    "id_concurso" TEXT NOT NULL,
    "id_concursante" TEXT NOT NULL,

    CONSTRAINT "ParticipacionConcursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PuntajesConcursante" (
    "id" TEXT NOT NULL,
    "puntaje" DOUBLE PRECISION NOT NULL,
    "id_participacion" TEXT NOT NULL,

    CONSTRAINT "PuntajesConcursante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenalizacionConcursante" (
    "id" TEXT NOT NULL,
    "razon" TEXT NOT NULL,
    "id_participacion" TEXT NOT NULL,

    CONSTRAINT "PenalizacionConcursante_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Concurso" ADD CONSTRAINT "Concurso_id_rubrica_fkey" FOREIGN KEY ("id_rubrica") REFERENCES "Rubrica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubricaCriterios" ADD CONSTRAINT "RubricaCriterios_id_rubrica_fkey" FOREIGN KEY ("id_rubrica") REFERENCES "Rubrica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CriteriosPonderacion" ADD CONSTRAINT "CriteriosPonderacion_id_criterio_fkey" FOREIGN KEY ("id_criterio") REFERENCES "RubricaCriterios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacionConcursante" ADD CONSTRAINT "ParticipacionConcursante_id_concursante_fkey" FOREIGN KEY ("id_concursante") REFERENCES "concursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacionConcursante" ADD CONSTRAINT "ParticipacionConcursante_id_concurso_fkey" FOREIGN KEY ("id_concurso") REFERENCES "Concurso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PuntajesConcursante" ADD CONSTRAINT "PuntajesConcursante_id_participacion_fkey" FOREIGN KEY ("id_participacion") REFERENCES "ParticipacionConcursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenalizacionConcursante" ADD CONSTRAINT "PenalizacionConcursante_id_participacion_fkey" FOREIGN KEY ("id_participacion") REFERENCES "ParticipacionConcursante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
