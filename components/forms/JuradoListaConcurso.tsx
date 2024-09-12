"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Concurso, Prisma, usuario } from "@prisma/client"
import { Button } from "../ui/button"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { JuradoFull } from "@/types/JuradoFull"
import { toggleConcursoJurado } from "@/actions/toggleConcursoJurado"

interface AddConcursoForm {
    id_concurso: string,
}


export default function JuradoListaConcurso({ concursos, jurado }: { concursos: Concurso[], jurado: JuradoFull }) {
    const [isPending, startTransition] = useTransition();
    const { handleSubmit, control, reset, watch } = useForm<AddConcursoForm>();
    const toggle = (data: AddConcursoForm) => {
        startTransition(async () => {
            await toggleConcursoJurado(jurado.id, data.id_concurso)
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
                jurado?.JuradosConcursos.map(jurado => {
                    return (
                        <section className="my-2 flex items-center justify-between last:border-none border-b py-4">
                            <p>{jurado.concurso.nombre}</p>
                            <Button disabled={isPending} onClick={() => toggle({ id_concurso: jurado.id_concurso })} variant={"destructive"}>Eliminar</Button>
                        </section>
                    )
                })
            }
        </>
    )
}