import { Prisma, Rubrica } from '@prisma/client';
import prisma from './prisma';
import { RubricaData } from '@/types/RubricaData';
import { RubricaFull } from '@/types/RubricaFull';
// Create a new rubrica
export async function createRubrica(data: Rubrica): Promise<Rubrica> {
    return prisma.rubrica.create({ data });
}

// Get a single rubrica by ID
export async function getRubricaById(id: string): Promise<RubricaFull| null> {
    return prisma.rubrica.findUnique({
        where: { id },
        include: {
            criterios: {
                include: {
                    puntajes: true
                }
            }
        }

    });
}

// Update an existing rubrica
export async function updateRubrica(id: string, data: Partial<Rubrica>): Promise<Rubrica | null> {
    return prisma.rubrica.update({ where: { id }, data });
}

// Delete a rubrica
export async function deleteRubrica(id: string): Promise<Rubrica | null> {
    return prisma.rubrica.delete({ where: { id } });
}

// Get all rubricas
export async function getAllRubricas(): Promise<Rubrica[]> {
    return prisma.rubrica.findMany();
}