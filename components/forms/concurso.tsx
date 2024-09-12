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
import { Concurso, Rubrica } from "@prisma/client";
import { Textarea } from "../ui/textarea";
import Link from "next/link";
import dayjs from "dayjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getStatusProperties } from "@/lib/estadoConcurso";
import { cambiarEstadoConcurso } from "@/actions/cambiarEstadoConcurso";
import { MdOutlineCopyAll, MdOutlineDelete, MdWarningAmber } from "react-icons/md";
import { deleteConcurso } from "@/actions/deleteConcurso";
import { ConcursoData } from "@/types/ConcursoData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils";
import Back from "../Back";
import { duplicarConcurso } from "@/actions/duplicarConcurso";

export default function ConcursoForm({ type, concurso, rubricas }: { type: 'create' | 'edit', concurso?: ConcursoData, rubricas?: Rubrica[] }) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState, setError, control } = useForm<ConcursoRegister>({
        resolver: zodResolver(concursoSchema),
        defaultValues: {
            nombre: concurso?.nombre,
            descripcion: concurso?.descripcion,
            id_rubrica: concurso?.id_rubrica as string,
            fecha: dayjs().format("YYYY-MM-DDTHH:mm")
        }
    });
    const router = useRouter();
    const { errors } = formState;
    const onDelete = () => {
        startTransition(async () => {
            await deleteConcurso(concurso?.id as string)
            router.push("/admin/concursos")
        })
    }

    const onDuplicarConcurso = () => {
        startTransition(async () => {
            const concursoCopia = await duplicarConcurso(concurso as ConcursoData)
            if (!concursoCopia) {
                setError('root', { message: "Hubo un error" });
                return
            }

            router.push("/admin/concursos/" + concursoCopia.id + "/editar")
        })
    }

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
        <div className={cn("bg-white rounded-lg shadow-lg p-6 w-full", type == "edit" ? "" : "max-w-md mx-auto")}>
            <Back href={"/admin/concursos/"} />

            <h1 className="text-3xl mb-2 font-bold text-gray-900">{type === "create" ? "Crear Concurso" : `Editar "${concurso?.nombre}"`} </h1>

            {
                type == "edit" && (
                    <>

                        <div className="flex flex-col gap-2 my-2 mb-6">
                            {!concurso?.participantes.length && (
                                <Alert className="bg-gray-100">
                                    <MdWarningAmber className="h-6 w-6  !text-gray-500" />
                                    <AlertTitle>Advertencia</AlertTitle>
                                    <AlertDescription>
                                        No tienes participantes !
                                    </AlertDescription>
                                </Alert>
                            )}
                            {!concurso?.JuradosConcursos.length && (
                                <Alert className="bg-gray-100">
                                    <MdWarningAmber className="h-6 w-6  !text-gray-500" />
                                    <AlertTitle>Advertencia</AlertTitle>
                                    <AlertDescription>
                                        No tienes jurados !
                                    </AlertDescription>
                                </Alert>
                            )}
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
                            <Button onClick={onDuplicarConcurso} disabled={isPending} variant={"outline"}>
                                Duplicar Concurso
                            </Button>
                        </div>
                    </>
                )
            }

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
                                    <SelectTrigger className={cn(errors.id_rubrica && ("border-red-500"))}>
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
                    {errors.id_rubrica && (
                        <span className="text-red-500 text-sm">Rubrica es requerida</span>
                    )}

                    {
                        (concurso?.estado) && (
                            <div className="space-y-2">
                                <EstadoConcurso concurso={concurso} />
                            </div>
                        )
                    }

                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-2">
                    <Button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-600 text-white ${isPending ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        disabled={isPending}
                    >
                        {isPending ? "Guardando..." : "Guardar"}
                    </Button>
                    {
                        type == "edit" && (
                            <>
                                <Button onClick={onDelete} disabled={isPending} variant={"destructive"}>
                                    <MdOutlineDelete size={24} />
                                </Button>
                            </>
                        )
                    }
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
