import { concursante } from '@prisma/client';
import prisma from './prisma';
// Create a new concursante
export async function createconcursante(data: concursante): Promise<concursante> {
    return prisma.concursante.create({ data });
}

// Get a single concursante by ID
export async function getconcursanteById(id: string): Promise<concursante | null> {
    return prisma.concursante.findUnique({ where: { id } });
}

// Update an existing concursante
export async function updateconcursante(id: string, data: Partial<concursante>): Promise<concursante | null> {
    return prisma.concursante.update({ where: { id }, data });
}

// Delete a concursante
export async function deleteconcursante(id: string): Promise<concursante | null> {
    return prisma.concursante.delete({ where: { id } });
}

// Get all concursantes
export async function getAllconcursantes(): Promise<concursante[]> {
    return prisma.concursante.findMany();
}