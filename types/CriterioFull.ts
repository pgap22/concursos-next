import { Prisma } from "@prisma/client";

export type CriterioFull = Prisma.RubricaCriteriosGetPayload<{
    include: {
        puntajes: true
    }
}>