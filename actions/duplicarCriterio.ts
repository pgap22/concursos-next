"use server"
import prisma from "@/lib/prisma";
import { CriterioFull } from "@/types/CriterioFull";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function duplicarCriterio(id_rubrica:string, data:CriterioFull) {
    try {
        const {puntajes} = data

        const datoCriterio : Prisma.RubricaCriteriosCreateInput = {
            nombre: data.nombre+" Copia",
            descripcion:  data.descripcion,
            rubrica: {
                connect: {
                    id: id_rubrica
                }
            },
            puntajes: {
                create: puntajes.map(puntaje => {
                    return{
                        nombre: puntaje.nombre,
                        tipo: puntaje.tipo
                    }
                })
            },
        }
    
        const rubrica = await prisma.rubricaCriterios.create({
            data: datoCriterio
        })

        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return rubrica
    } catch (error) {
        console.log(error)
    }
}