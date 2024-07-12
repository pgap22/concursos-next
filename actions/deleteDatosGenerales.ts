"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteDatosGenerales(id_datosgenerales: string) {
    try {
        await prisma.datosGeneralesConcursante.delete({
            where:{
                id: id_datosgenerales
            },
        })
        revalidatePath("/admin/concursantes/editar/[id]", "page")
        return {message: "OK"}
    } catch (error) {
        console.log(error)
        return {error: "Hubo un error en el servidor"}
    }
}