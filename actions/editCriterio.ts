"use server"
import prisma from "@/lib/prisma";
import { CriteriosSchema } from "@/schemas/criterios";
import { revalidatePath } from "next/cache";

export async function editCriterio(id: string, data: CriteriosSchema) {
    try {
        const criterio = await prisma.rubricaCriterios.update({
            where: {
                id
            }
            , data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
            }
        })
        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return criterio
    } catch (error) {
        throw error
    }
}