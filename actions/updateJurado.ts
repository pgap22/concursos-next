"use server"
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { UsuarioUpdate } from "@/schemas/usuario";
import { revalidatePath } from "next/cache";

export async function updateJurado(id: string, data: UsuarioUpdate) {
    try {
        // Realiza la actualización utilizando Prisma

        const isSameUser = await prisma.usuario.findFirst({
            where: {
                AND: [
                    {
                        usuario: data.usuario
                    },
                    {
                        id: {
                            not: id
                        }
                    }
                ]
            }
        })

        if (isSameUser) {
            return {
                error: "Ese usuario ya esta usado"
            }
        }

        if (data.password) {
            data.password = await hashPassword(data.password)
        }

        if (!data.password) {
            delete data.password
        }

        const updatedJurado = await prisma.usuario.update({
            where: { id },
            data
        });

        revalidatePath("/admin/jurados")
        // Retorna el jurado actualizado
        return updatedJurado;
    } catch (error) {
        console.error('Error al actualizar el jurado:', error);
        throw error; // Puedes manejar el error según tu lógica de aplicación
    }
}