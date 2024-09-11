import { Prisma } from "@prisma/client";

export type ConcursoData = Prisma.ConcursoGetPayload<{
    include: {
        participantes: {
            select: { id: true }
        },
        JuradosConcursos: {
            select: { id: true }
        }
    }
}>