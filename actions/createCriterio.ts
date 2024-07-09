"use server"
import prisma from "@/lib/prisma";
import { CriteriosSchema } from "@/schemas/criterios";
import { revalidatePath } from "next/cache";

export async function createCriterio(id_rubrica:string, data:CriteriosSchema) {
    try {
        const criterio = await prisma.rubricaCriterios.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                id_rubrica
            }
        })
        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return criterio
    } catch (error) {
        throw error
    }
}