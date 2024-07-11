"use server"
import prisma from "@/lib/prisma";
import { Concurso, estadoConcurso } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const cambiarEstadoConcurso = async (concurso: Concurso) => {
    try {
        const { estado } = concurso;
        const nextEstado: estadoConcurso =
            estado == "inscripcion" ? "evaluacion"
                : estado == "evaluacion" ? "finalizado"
                    : estado == "finalizado" ? "inscripcion" : "inscripcion"

        await prisma.concurso.update({
            where: {
                id: concurso.id
            },
            data: {
                estado: nextEstado
            }
        })

        if (nextEstado == "inscripcion") {
            const xd = await prisma.puntajesConcursante.deleteMany({
                where: {
                    participacion: {
                        id_concurso: concurso.id
                    }
                }
            })
        }

        revalidatePath("/admin/concursos/[id]/editar", "page")
        revalidatePath("/admin/concursos/[id]/ranking", "page")
        return true
    } catch (error) {
        console.log(error)
    }
}