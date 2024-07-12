"use server"
import prisma from "@/lib/prisma";
import { DatosGenralesConcursanteSchema } from "@/schemas/datosGeneralesConcursante";
import { revalidatePath } from "next/cache";

export async function agregarDatosGenerales(data:DatosGenralesConcursanteSchema, id_concursante: string) {
    try {
        await prisma.datosGeneralesConcursante.create({
            data: {
                ...data,
                id_concursante
            }
        })
        revalidatePath("/admin/concursantes/editar/[id]", "page")
        return {message: "OK"}
    } catch (error) {
        console.log(error)
        return {error: "Hubo un error en el servidor"}
    }
}