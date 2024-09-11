import { Concurso, Prisma } from '@prisma/client';
import prisma from './prisma';
import { auth } from '@/auth';
import { ConcursoData } from '@/types/ConcursoData';
// Create a new concurso
export async function createconcurso(data: Concurso): Promise<Concurso> {
    return prisma.concurso.create({ data });
}
// Get a single concurso by ID
export async function getconcursoById(id: string): Promise<ConcursoData | null> {
    return prisma.concurso.findUnique({
        where: { id },
        include: {
            participantes: {
                select: { id: true }
            },
            JuradosConcursos: {
                select: { id: true }
            }
        }
    });
}
export async function getconcursoByIdWithParticipantes(id: string): Promise<Prisma.ConcursoGetPayload<{
    include: {
        participantes: {
            include: {
                concursante: true
            }
        }
    }
}> | null> {
    return prisma.concurso.findUnique({
        where: { id },
        include: {
            participantes: {
                include: {
                    concursante: true
                }
            }
        }
    });
}
export async function getconcursoByIdWithJurados(id: string): Promise<Prisma.ConcursoGetPayload<{
    include: {
        JuradosConcursos: {
            include: {
                jurado: true
            }
        }
    }
}> | null> {
    return prisma.concurso.findUnique({
        where: { id },
        include: {
            JuradosConcursos: {
                include: {
                    jurado: true
                }
            }
        }
    });
}

// Update an existing concurso
export async function updateconcurso(id: string, data: Partial<Concurso>): Promise<Concurso | null> {
    return prisma.concurso.update({ where: { id }, data });
}

// Delete a concurso
export async function deleteconcurso(id: string): Promise<Concurso | null> {
    return prisma.concurso.delete({ where: { id } });
}

// Get all concursos
export async function getAllconcursos(): Promise<Concurso[]> {
    return prisma.concurso.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });
}

export async function getConcursosByAuth() {
    const session = await auth();
    const concursos = await prisma.concurso.findMany({
        // include: {
        //     JuradosConcursos: true
        // },
        orderBy: {
            createdAt: 'asc'
        },
        where: {
            JuradosConcursos: {
                some: {
                    id_jurado: session?.user.id
                }
            }
        }
    })
    return concursos
}
export async function getConcursosEnableToParticipate(id_concursante: string) {
    const concursos = await prisma.concurso.findMany({
        where: {
            participantes: {
                none: {
                    id_concursante
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    return concursos
}

export async function getParticipantesConcursoById(id: string) {
    const participantes = await prisma.concursante.findMany({
        where: {
            participaciones: {
                some: {
                    id_concurso: id
                }
            },
        },
        include: {
            participaciones: {
                where: {
                    id_concurso: id
                },
                include: {
                    puntajes: true,
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
        // include: {
        //     participaciones: {
        //         include: {
        //             concurso: true
        //         }
        //     }
        // }
    })
    return participantes;
}

export async function alreadyEvaluted(id_participacion: string, id_jurado: string) {
    try {
        const pariticipacion = await prisma.puntajesConcursante.findFirst({
            where: {
                AND: [
                    {
                        id_participacion
                    },
                    {
                        id_jurado
                    }
                ]
            }
        })
        return pariticipacion;
    } catch (error) {
        console.log(error)
    }
}

export async function getResultadoByParticipacion(id_participacion: string, id_jurado: string) {
    try {
        const participacion = await prisma.participacionConcursante.findFirst({
            where: {
                id: id_participacion
            },
            include: {
                concursante: true,
                puntajes: {
                    where: {
                        id_jurado
                    },
                    include: {
                        criterioPonderacion: {
                            include: {
                                criterio: true
                            }
                        }
                    }
                },
            }
        })


        if (!participacion) return null
        // Agrupar los puntajes por criterio.id
        const agrupadosPorCriterio = participacion.puntajes.reduce((acc: Record<string, {
            puntajes: Prisma.PuntajesConcursanteGetPayload<{
                include: {
                    criterioPonderacion: {
                        include: {
                            criterio: true
                        }
                    }
                }
            }>[],
            nombre_criterio: string,
            descripcion: string,
        }>, puntaje) => {
            const criterioId = puntaje.criterioPonderacion.criterio.id;
            const nombre_criterio = puntaje.criterioPonderacion.criterio.nombre;
            const descripcion = puntaje.criterioPonderacion.criterio.descripcion;
            if (!acc[criterioId]) {
                acc[criterioId] = {
                    nombre_criterio,
                    descripcion,
                    puntajes: []
                }
            }

            acc[criterioId].puntajes.push(puntaje);
            return acc;
        }, {});

        console.log(agrupadosPorCriterio)

        return { participacion, agrupadosPorCriterio }
    } catch (error) {
        console.log(error)
    }
}

export async function getRankingConcurso(id_concurso: string) {
    try {
        const ranking = await prisma.participacionConcursante.findMany({
            where: {
                AND: [
                    {
                        concursante: {
                            prueba: false
                        }
                    },
                    {
                        id_concurso
                    }
                ]
            },

            include: {
                concursante: {
                    include: {
                        DatosGeneralesConcursante: true,
                        participaciones: {
                            where: {
                                id_concurso
                            },
                            include: {
                                puntajes: true
                            }
                        }
                    }
                }
            }
        })

        return ranking.map(concursante => {
            const puntajeAcumulado = concursante.concursante.participaciones.map(participacion => {
                const puntajeTotal = participacion.puntajes.reduce((acc, puntaje) => { return acc + (+puntaje.puntaje) }, 0)
                return puntajeTotal
            })
            return {
                nombre: concursante.concursante.nombre,
                datosGenerales: concursante.concursante.DatosGeneralesConcursante,
                puntajeAcumulado: puntajeAcumulado[0]
            }
        }).sort((a, b) => {
            return b.puntajeAcumulado - a.puntajeAcumulado
        })

    } catch (error) {
        console.log(error)
    }
}