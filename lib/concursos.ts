import { Concurso } from '@prisma/client';
import prisma from './prisma';
// Create a new concurso
export async function createconcurso(data: Concurso): Promise<Concurso> {
    return prisma.concurso.create({ data });
}

// Get a single concurso by ID
export async function getconcursoById(id: string): Promise<Concurso | null> {
    return prisma.concurso.findUnique({ where: { id } });
}

// Update an existing concurso
export async function updateconcurso(id: string, data: Partial<Concurso>): Promise<Concurso | null> {
    return prisma.concurso.update({ where: { id }, data });
}

// Delete a concurso
export async function deleteconcurso(id: string): Promise<Concurso | null> {
    return prisma.concurso.delete({ where: { id } });
}

// Get all concursos
export async function getAllconcursos(): Promise<Concurso[]> {
    return prisma.concurso.findMany();
}