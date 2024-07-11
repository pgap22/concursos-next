"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const toggleConcursoJurado = async (id_jurado:string, id_concurso:string) => {
    try {
        const isParticipante = await prisma.juradosConcursos.findFirst({
            where: {
                AND: [
                    {id_jurado},
                    {id_concurso}
                ]
            }
        })

        if(isParticipante){
            await prisma.juradosConcursos.delete({
                where: {
                    id: isParticipante.id
                }
            })
            revalidatePath("/admin/concursos/[id]/jurados", "page")
            return true
        }

        await prisma.juradosConcursos.create({
            data: {
                id_jurado,
                id_concurso
            }
        })

        revalidatePath("/admin/concursos/[id]/jurados", "page")
        return true

    } catch (error) {
        console.log(error)
        throw error
    }
}