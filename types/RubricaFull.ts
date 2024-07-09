import { Prisma } from "@prisma/client"

export type RubricaFull = Prisma.RubricaGetPayload<{
    include: {
        criterios: {
            include: {
                puntajes: true
            }
        }
    }
}>