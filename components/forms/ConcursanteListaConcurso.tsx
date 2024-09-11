"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ConcursanteFull } from "@/types/ConcursanteFull"
import { Concurso } from "@prisma/client"
import { Button } from "../ui/button"
import { useTransition } from "react"
import { toggleInscripcionConcursante } from "@/actions/toggleInscripcionConcursante"
import { Controller, useForm } from "react-hook-form"

interface AddConcursoForm {
    id_concurso: string,
}

export default function ConcursanteListaConcurso({ concursos, concursante }: { concursos: Concurso[], concursante: ConcursanteFull }) {
    const [isPending, startTransition] = useTransition();
    const { handleSubmit, control, reset, watch } = useForm<AddConcursoForm>();
    const toggle = (data: AddConcursoForm) => {
        startTransition(async () => {
            await toggleInscripcionConcursante(concursante.id, data.id_concurso, true)
            reset({id_concurso: ""})
        })
    }
    return (
        <>
            <form onSubmit={handleSubmit(toggle)} className="mt-2">
                <Controller
                    name="id_concurso"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select value={watch("id_concurso")} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar Concurso" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    concursos?.map(concurso => (
                                        <SelectItem value={concurso.id}>{concurso.nombre}</SelectItem>

                                    ))
                                }
                            </SelectContent>
                        </Select>
                    )}
                />
                <Button disabled={isPending} className="w-full mt-4">Inscribir a concurso</Button>
            </form>
            {
                concursante?.participaciones.map(participacion => {
                    return (
                        <section className="my-2 flex items-center justify-between last:border-none border-b py-4">
                            <p>{participacion.concurso.nombre}</p>
                            <Button disabled={isPending} onClick={() => toggle({ id_concurso: participacion.id_concurso })} variant={"destructive"}>Eliminar</Button>
                        </section>
                    )
                })
            }
        </>
    )
}