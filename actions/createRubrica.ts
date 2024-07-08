"use server"
import prisma from "@/lib/prisma";
import { RubricaData } from "@/types/RubricaData";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createRubrica(data:RubricaData) {
    try {
        const {criterios} = data

        const dataRubrica : Prisma.RubricaCreateInput = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            criterios: {
                create: criterios.map(criterio => {
                    const {ponderaciones} = criterio
                    return {
                        nombre: criterio.nombre,
                        descripcion: criterio.descripcion,
                        puntajes: {
                            create: ponderaciones.map(ponderacion => {
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

        revalidatePath("/admin/rubricas")
        return rubrica
    } catch (error) {
        console.log(error)
    }
}