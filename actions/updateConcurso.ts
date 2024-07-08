"use server"
import prisma from "@/lib/prisma";
import { ConcursoRegister } from "@/schemas/concurso";
import { Concurso } from "@prisma/client";
import { revalidatePath } from "next/cache";


export const updateConcurso = async (id: string, data: ConcursoRegister): Promise<Concurso | { error: string }> => {
    try {
        const concursoActualizado = await prisma.concurso.update({
            where: { id },
            data,
        });

        revalidatePath("/admin/concursos")
        return concursoActualizado;
    } catch (error) {
        console.error(`Error al actualizar el concurso con ID ${id}:`, error);
        return { error: 'No se pudo actualizar el concurso.' };
    }
};