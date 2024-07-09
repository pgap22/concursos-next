"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCriterio(id:string) {
    try {
        const criterio = await prisma.rubricaCriterios.delete({
            where: {
                id
            }
        })
            
        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return criterio
    } catch (error) {
        throw error
    }
}