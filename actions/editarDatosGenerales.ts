"use server"
import prisma from "@/lib/prisma";
import { DatosGenralesConcursanteSchema } from "@/schemas/datosGeneralesConcursante";
import { revalidatePath } from "next/cache";

export async function editarDatosGenerales(data:DatosGenralesConcursanteSchema, id_datosgenerales: string) {
    try {
        await prisma.datosGeneralesConcursante.update({
            where:{
                id: id_datosgenerales
            },
            data: {
                ...data,
            }
        })
        revalidatePath("/admin/concursantes/editar/[id]", "page")
        return {message: "OK"}
    } catch (error) {
        console.log(error)
        return {error: "Hubo un error en el servidor"}
    }
}