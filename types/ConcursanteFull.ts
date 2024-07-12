import { Prisma } from "@prisma/client"

export type ConcursanteFull = Prisma.concursanteGetPayload<{
    include: {
        DatosGeneralesConcursante: true,
        participaciones: {
            include: {
                concurso: true
            }
        }
    }
}>