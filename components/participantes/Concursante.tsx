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
            <p>{concursante.institucion}</p>

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