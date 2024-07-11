"use client"
import { concursante, Prisma } from "@prisma/client";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toggleInscripcionConcursante } from "@/actions/toggleInscripcionConcursante";
import { toggleConcursoJurado } from "@/actions/toggleConcursoJurado";

export default function JuradoItemList({ jurado }: {
    jurado: Prisma.JuradosConcursosGetPayload<{
        include: {
            jurado: true
        }
    }>
}) {
    const [cargando, startTransition] = useTransition();

    const eliminar = () => {
        startTransition(async () => {
            try {
                await toggleConcursoJurado(jurado.id_jurado, jurado.id_concurso);
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <li key={jurado.id} className="py-2 gap-2 flex justify-between items-center">
            <p className="text-base font-semibold text-gray-800">Participante: {jurado.jurado.nombre}</p>
            <Button disabled={cargando} onClick={eliminar} variant={"destructive"}>Eliminar</Button>
        </li>
    )
}