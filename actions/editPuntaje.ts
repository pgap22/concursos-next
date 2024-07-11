"use server"
import prisma from "@/lib/prisma"
import { PonderacionSchema } from "@/schemas/ponderacion"
import { revalidatePath } from "next/cache"

export const editPuntaje = async (id: string, data: PonderacionSchema) => {
    try {
        const puntaje = await prisma.criteriosPonderacion.update({
            where: {
                id
            }
            , data: {
                nombre: data.nombre,
                tipo: data.tipo,
            }
        })
        revalidatePath("/admin/rubricas/editar/[id]")
        return puntaje
    } catch (error) {
        throw error
    }
}