"use server"
import { PrismaClient } from '@prisma/client';
import { Usuario } from '@/schemas/usuario';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/password';

const prisma = new PrismaClient();

export async function createJurado(data: Usuario) {
  try {

    data.password =  await hashPassword(data.password)

    const juradoMismoUsuario = await prisma.usuario.findFirst({
        where: {
            usuario: data.usuario
        }
    })

    if(juradoMismoUsuario) return {
        error: "Ya existe ese usuario !"
    }

    const nuevoJurado = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        usuario: data.usuario,
        password: data.password,
        rol: 'jurado',
      },
    });

    revalidatePath("/admin/jurados")
    return nuevoJurado;
  } catch (error) {
    console.error('Error al crear el jurado:', error);
    throw {error: "Hubo un error en el servidor"}
  }
}
