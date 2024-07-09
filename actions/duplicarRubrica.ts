"use server"
import prisma from "@/lib/prisma";
import { RubricaFull } from "@/types/RubricaFull";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function duplicarRubrica(data:RubricaFull) {
    try {
        const {criterios} = data

        const dataRubrica : Prisma.RubricaCreateInput = {
            nombre: data.nombre+ "Copia",
            descripcion: data.descripcion,
            criterios: {
                create: criterios.map(criterio => {
                    const { puntajes } = criterio
                    return {
                        nombre: criterio.nombre,
                        descripcion: criterio.descripcion,
                        puntajes: {
                            create: puntajes.map(ponderacion => {
                                return(
                                    {
                                        nombre: ponderacion.nombre,
                                        tipo: ponderacion.tipo,
                                    }
                                )
                            })
                        }
                    }
                })
            }
        }
    
        const rubrica = await prisma.rubrica.create({
            data: dataRubrica
        })

        revalidatePath("/admin/rubricas/editar/[id]", "page")
        return rubrica
    } catch (error) {
        console.log(error)
    }
}