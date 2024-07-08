"use server"
import prisma from "@/lib/prisma";
import { ConcursoRegister } from "@/schemas/concurso";
import { Concurso } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createConcurso = async (data: ConcursoRegister): Promise<Concurso | { error: string }> => {
    try {
        const nuevoConcurso = await prisma.concurso.create({
            data: {
                ...data,
                estado: 'inscripcion'
            }
        });
        revalidatePath("/admin/concursos")
        return nuevoConcurso;
    } catch (error) {
        console.error('Error al crear el concurso:', error);
        return { error: 'No se pudo crear el concurso.' };
    } 
};