"use client"
import { useTransition } from "react";
import { Button } from "../ui/button";
import { concursante, Prisma } from "@prisma/client";
import { toggleInscripcionConcursante } from "@/actions/toggleInscripcionConcursante";

export function Concursante({ concursante, concurso_id }: {
    concursante: Prisma.concursanteGetPayload<{
        include: {
            participaciones: true
        }
    }>, concurso_id: string
}) {
    const inscrito = concursante.participaciones.some(participacion => participacion.id_concurso == concurso_id)
    const [cargando, startTransition] = useTransition()
    const hasNoParticipation = concursante.participaciones.length === 0;
    const userTest = concursante.prueba

    const OnParticipacion = () => {
        startTransition(async () => {
            try {
                await toggleInscripcionConcursante(concursante.id, concurso_id);
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <div className="p-4 border bg-white rounded-md">
            <p>{concursante.nombre}</p>
            {/* <p>{concursante.institucion}</p> */}
            <div className="space-x-2 my-2 md:mt-0">
                    {hasNoParticipation && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Sin concurso
                        </span>
                    )}
                    {userTest && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Prueba
                        </span>
                    )}
                </div>

            <Button disabled={cargando} onClick={OnParticipacion} variant={inscrito ? "outline" : "default"}>
                {
                    inscrito
                        ? "Eliminar"
                        : "Inscribir"
                }
            </Button>

        </div>
    )
}