import prisma from "./prisma";

// Crear
export async function createDatosGeneralesConcursante(data: {
    campo: string;
    valor: string;
    id_concursante: string;
  }) {
    return await prisma.datosGeneralesConcursante.create({
      data,
    });
  }
  
  // Leer (obtener por id)
  export async function getDatosGeneralesConcursanteById(id: string) {
    return await prisma.datosGeneralesConcursante.findUnique({
      where: { id },
    });
  }
  
  // Leer (obtener todos)
  export async function getAllDatosGeneralesConcursantes() {
    return await prisma.datosGeneralesConcursante.findMany({
         orderBy: {
            createdAt: 'asc'
        }
    });
  }
  
  // Actualizar
  export async function updateDatosGeneralesConcursante(id: string, data: {
    campo?: string;
    valor?: string;
    id_concursante?: string;
  }) {
    return await prisma.datosGeneralesConcursante.update({
      where: { id },
      data,
    });
  }
  
  // Eliminar
  export  async function deleteDatosGeneralesConcursante(id: string) {
    return await prisma.datosGeneralesConcursante.delete({
      where: { id },
    });
  }