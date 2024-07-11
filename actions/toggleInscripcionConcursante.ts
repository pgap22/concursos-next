"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const toggleInscripcionConcursante = async (id_concursante:string, id_concurso:string) => {
    try {
        const isParticipante = await prisma.participacionConcursante.findFirst({
            where: {
                AND: [
                    {id_concursante},
                    {id_concurso}
                ]
            }
        })

        if(isParticipante){
            await prisma.participacionConcursante.delete({
                where: {
                    id: isParticipante.id
                }
            })
            revalidatePath("/admin/concursos/[id]/jurados", "page")
            return true
        }

        await prisma.participacionConcursante.create({
            data: {
                id_concursante,
                id_concurso
            }
        })

        console.log(isParticipante)
        revalidatePath("/admin/concursos/[id]/participantes", "page")
        return true

    } catch (error) {
        console.log(error)
        throw error
    }
}