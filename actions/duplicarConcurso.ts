"use server"
import prisma from "@/lib/prisma";
import { ConcursoData } from "@/types/ConcursoData";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function duplicarConcurso(data:ConcursoData) {
    try {
        const datoCriterio : Prisma.ConcursoCreateInput = {
            nombre: data.nombre+" Copia",
            descripcion:  data.descripcion,
            fecha: data.fecha,
            estado: 'inscripcion',
            rubrica: {
                connect: {
                    id: data.id_rubrica as string
                }
            },
            JuradosConcursos: {
                create: data.JuradosConcursos.map(jurado =>{
                    return{
                        id_jurado: jurado.id_jurado
                    }
                })
            }
        }
    
        const concurso = await prisma.concurso.create({
            data: datoCriterio
        })

        revalidatePath("/admin/concursos/[id]/editar", "page")
        return concurso
    } catch (error) {
        console.log(error)
    }
}