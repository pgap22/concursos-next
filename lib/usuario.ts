import { Prisma, roles, usuario } from '@prisma/client';
import prisma from './prisma';
// Create a new usuario
export async function createUsuario(data: usuario): Promise<usuario> {
    return prisma.usuario.create({ data });
}

// Get a single usuario by ID
export async function getUsuarioById(id: string): Promise<usuario | null> {
    return prisma.usuario.findUnique({ where: { id } });
}

// Get a single usuario by Usuario
export async function getUsuarioByUsuario(usuario: string | undefined): Promise<usuario | null> {

    return prisma.usuario.findFirst({ where: { usuario } });
}

// Update an existing usuario
export async function updateUsuario(id: string, data: Partial<usuario>): Promise<usuario | null> {
    return prisma.usuario.update({ where: { id }, data });
}

// Delete a usuario
export async function deleteUsuario(id: string): Promise<usuario | null> {
    return prisma.usuario.delete({ where: { id } });
}

// Get all usuarios
export async function getAllUsuarios(): Promise<usuario[]> {
    return prisma.usuario.findMany();
}
// Get all usuarios
export async function getUsuariosByRol(rol: roles | undefined): Promise<usuario[]> {
    return prisma.usuario.findMany({
        where: {
            rol
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}
export async function getJurados(): Promise<Prisma.usuarioGetPayload<{
    include: {
        JuradosConcursos: true
    }
}>[]> {
    return prisma.usuario.findMany({
        where: {
            rol: 'jurado'
        },
        include: {
            JuradosConcursos: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
}