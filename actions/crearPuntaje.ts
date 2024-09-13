"use server"
import prisma from "@/lib/prisma"
import { PonderacionSchema } from "@/schemas/ponderacion"
import { revalidatePath } from "next/cache"

export const crearPuntaje =  async (id_criterio : string, data : PonderacionSchema) => {
    try {
        const puntaje = await prisma.criteriosPonderacion.create({
            data: {
                nombre: data.nombre,
                tipo: data.tipo,
                id_criterio
            }
        })
        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return puntaje
    } catch (error) {
        throw error
    }
}