"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deletePuntaje(id:string) {
    try {
        await prisma.criteriosPonderacion.delete({
            where: {
                id
            }
        })
        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return true
    } catch (error) {
        throw error
    }
}