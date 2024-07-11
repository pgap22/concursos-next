"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { ConcursoRegister, concursoSchema } from "@/schemas/concurso";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateConcurso } from "@/actions/updateConcurso";
import { useRouter } from "next/navigation"; // Importamos useRouter desde next/navigation
import { createConcurso } from "@/actions/createConcurso";
import { Concurso, estadoConcurso, Prisma, Rubrica } from "@prisma/client";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import { Alert } from "../ui/alert";
import dayjs from "dayjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getStatusProperties } from "@/lib/estadoConcurso";
import { cambiarEstadoConcurso } from "@/actions/cambiarEstadoConcurso";
export default function ConcursoForm({ type, concurso, rubricas }: { type: 'create' | 'edit', concurso?: Concurso, rubricas?: Rubrica[] }) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState, setError, control } = useForm<ConcursoRegister>({
        resolver: zodResolver(concursoSchema),
        defaultValues: {
            ...concurso,
            fecha: dayjs().format("YYYY-MM-DDTHH:mm")
        }
    });
    const router = useRouter();
    const { errors } = formState;

    const onSubmit = async (data: ConcursoRegister) => {
        startTransition(async () => {
            try {
                const resultado = type === "create" ? await createConcurso(data) : await updateConcurso(concurso?.id as string, data);
                if ('error' in resultado) {
                    setError("root", { message: resultado.error, type: 'custom' });
                    return;
                }

                router.push("/admin/concursos");

            } catch (error) {
                console.log(error);
            }
        });
    };


    return (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            <Link href={"/admin/concursos/"}>Volver</Link>

            <h1 className="text-3xl mb-2 font-bold text-gray-900">{type === "create" ? "Crear" : "Editar"} Concurso</h1>

            {
                type == "edit" && (
                    <div className="flex flex-col gap-2 my-2 mb-6">
                        <Button asChild >
                            <Link href={"/admin/concursos/" + concurso?.id + "/participantes"}>
                                Ver participantes
                            </Link>
                        </Button>
                        <Button asChild >
                            <Link href={"/admin/concursos/" + concurso?.id + "/jurados"}>
                                Ver Jurados
                            </Link>
                        </Button>
                        <Button asChild >
                            <Link href={"/admin/concursos/" + concurso?.id + "/ranking"}>
                                Ver Ranking
                            </Link>
                        </Button>
                    </div>
                )
            }
            {/* Botón de importar Excel (simulado) */}
            {/* <div className="my-2 mb-6">
                <Button>Importar Excel</Button>
            </div> */}

            {/* Formulario de creación de concurso */}
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-2">
                    {errors.root && (
                        <Alert variant={"destructive"} >{errors.root.message}</Alert>
                    )}
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <Input
                        id="nombre"
                        type="text"
                        placeholder="Nombre del Concurso"
                        {...register("nombre")}
                        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.nombre ? "border-red-500" : ""
                            }`}
                    />
                    {errors.nombre && (
                        <span className="text-red-500 text-sm">Nombre es requerido</span>
                    )}
                    <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                        Descripcion
                    </label>
                    <Textarea
                        id="nombre"
                        placeholder="Descripcion"
                        {...register("descripcion")}
                        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.descripcion ? "border-red-500" : ""
                            }`}
                    />
                    {errors.descripcion && (
                        <span className="text-red-500 text-sm">Nombre es requerido</span>
                    )}

                    <label htmlFor="fecha" className="text-sm font-medium text-gray-700">
                        Fecha
                    </label>
                    <Input
                        id="fecha"
                        defaultValue={dayjs().format("YYYY-MM-DDTHH:mm")}
                        type="datetime-local"
                        {...register("fecha", { valueAsDate: true })}
                        className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.fecha ? "border-red-500" : ""
                            }`}
                    />
                    {errors.fecha && (
                        <span className="text-red-500 text-sm">Fecha es requerida</span>
                    )}

                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                        Rubrica
                    </label>
                    <Controller
                        control={control}
                        name="id_rubrica"
                        render={({ field }) => {
                            return (
                                <Select onValueChange={field.onChange} value={field.value as string}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una rubrica" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            rubricas?.map(rubrica =>
                                            (
                                                <SelectItem key={rubrica.id} value={rubrica.id}>{rubrica.nombre.trim()}</SelectItem>

                                            )
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                            )
                        }}
                    />
                    {
                        (concurso?.estado) && (
                            <div className="space-y-2">
                                <EstadoConcurso concurso={concurso} />
                            </div>
                        )
                    }
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-600 text-white ${isPending ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar"}
                    </Button>
                    <Button
                        asChild
                        type="button"
                        className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:border-blue-500"
                    >
                        <Link href={"/admin/concursos"}>
                            Cancelar
                        </Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}




const EstadoConcurso = ({ concurso }: { concurso: Concurso }) => {

    const { colorClass, statusText, icon, next } = getStatusProperties(concurso.estado);
    const [cargando, startTransition] = useTransition();

    const onEditEstado = () => {
        startTransition(async () => {
            try {
                await cambiarEstadoConcurso(concurso)
            } catch (error) {
                console.log(error)
            }
        })
    }
    return (
        <div className="space-y-2">
            <div className={`p-4 rounded-lg border ${colorClass} flex items-center space-x-4`}>
                <div className="text-3xl">
                    {icon}
                </div>
                <div>
                    <div className="text-xl font-semibold">
                        {statusText}
                    </div>
                    <div className="text-sm">
                        {`El concurso está actualmente en estado de ${statusText.toLowerCase()}.`}
                    </div>
                </div>
            </div>
            {next == "Inscripcion" && <p className="text-red-500 font-bold">* Si pasas a inscripcion se borrara el ranking !</p>}
            <Button onClick={onEditEstado} disabled={cargando} type="button">Pasar a {next}</Button>
        </div>
    );
};
