import { concursante, Prisma } from '@prisma/client';
import prisma from './prisma';
// Create a new concursante
export async function createconcursante(data: concursante): Promise<concursante> {
    return prisma.concursante.create({ data });
}

// Get a single concursante by ID
export async function getconcursanteById(id: string): Promise<concursante | null> {
    return prisma.concursante.findUnique({ where: { id } });
}

// Get a single concursante by ID
export async function getConcursanteByIdWithConcursos(id: string): Promise<Prisma.concursanteGetPayload<{
    include: {
        DatosGeneralesConcursante: true
        participaciones: {
            include: {
                concurso: true,
            }
        }
    }
}> | null> {
    return prisma.concursante.findUnique({
        where: { id }, include: {
            DatosGeneralesConcursante: true,
            participaciones: {
                include: {
                    concurso: true,

                }
            }
        },

    });
}

// Update an existing concursante
export async function updateconcursante(id: string, data: Partial<concursante>): Promise<concursante | null> {
    return prisma.concursante.update({ where: { id }, data });
}

// Delete a concursante
export async function deleteconcursante(id: string): Promise<concursante | null> {
    return prisma.concursante.delete({ where: { id } });
}

// Get all concursantes
export async function getAllconcursantes(): Promise<Prisma.concursanteGetPayload<{
    include: {
        participaciones: {
            select: {
                concurso: {
                    select: {
                        id: true
                    }
                }
            }
        }
    }
}>[]> {
    return prisma.concursante.findMany({
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            participaciones: {
                select: {
                    concurso: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });
}
export async function getAllconcursantesWithParticipaciones(): Promise<Prisma.concursanteGetPayload<{
    include: {
        participaciones: true
    }
}>[]> {
    return prisma.concursante.findMany({
        include: {
            participaciones: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}
