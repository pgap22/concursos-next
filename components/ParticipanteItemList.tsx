"use client"
import { concursante, Prisma } from "@prisma/client";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toggleInscripcionConcursante } from "@/actions/toggleInscripcionConcursante";

export default function ParticiapanteItemList({ participante }: {
    participante: Prisma.ParticipacionConcursanteGetPayload<{
        include: {
            concursante: true
        }
    }>
}) {
    const [cargando, startTransition] = useTransition();

    const eliminar = () => {
        startTransition(async () => {
            try {
                await toggleInscripcionConcursante(participante.id_concursante, participante.id_concurso);
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <li key={participante.id} className="py-2 gap-2 flex justify-between items-center">
            <p className="text-base font-semibold text-gray-800">Participante: {participante.concursante.nombre}</p>
            <Button disabled={cargando} onClick={eliminar} variant={"destructive"}>Eliminar</Button>
        </li>
    )
}