"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function enviarResultados(data : any) {
    try {
        const id_criteriosPuntaje = Object.keys(data).filter(criterioPuntaje => !criterioPuntaje.startsWith("id_"))
        const dataResultado = id_criteriosPuntaje.map(id_criterio => ({
            id_criterio_ponderacion: id_criterio,
            puntaje: +data[id_criterio],
            id_participacion: data.id_participacion
        }))

         await prisma.puntajesConcursante.createMany({
            data: dataResultado
        })

        revalidatePath("/jurado/concurso/[id]/evaluar/[id_participacion]", "page")
        return true;
    } catch (error) {
      throw (error)
    }
}