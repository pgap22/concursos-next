"use client"
import { useTransition } from "react";
import { Button } from "../ui/button";
import { Prisma } from "@prisma/client";
import { toggleConcursoJurado } from "@/actions/toggleConcursoJurado";



export function JuradoConcurso({ jurado, concurso_id }: {
    jurado: Prisma.usuarioGetPayload<{
        include: {
            JuradosConcursos: true
        }
    }>, concurso_id: string
}) {
    const inscrito = jurado.JuradosConcursos.some(concurso => concurso.id_concurso == concurso_id)
    const [cargando, startTransition] = useTransition()

    const OnParticipacion = () => {
        startTransition(async () => {
            try {
                await toggleConcursoJurado(jurado.id, concurso_id);
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <div className="p-4 border bg-white rounded-md">
            <p>{jurado.nombre}</p>
        
            <Button className="w-full mt-2" disabled={cargando} onClick={OnParticipacion} variant={inscrito ? "outline" : "default"}>
                {
                    inscrito
                        ? "Eliminar"
                        : "Agregar"
                }
            </Button>

        </div>
    )
}