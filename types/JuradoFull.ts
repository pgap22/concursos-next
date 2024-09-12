import { Prisma } from "@prisma/client"

export type JuradoFull = Prisma.usuarioGetPayload<{
    include: {
        JuradosConcursos: {
            include: {
                concurso: true
            }
        }
    }
}>
