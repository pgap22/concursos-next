"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Usuario, usuarioSchema, UsuarioUpdate, usuarioUpdateSchema } from "@/schemas/usuario";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJurado } from "@/actions/createJurado";
import { useRouter } from "next/navigation";
import { Concurso, usuario } from "@prisma/client";
import { updateJurado } from "@/actions/updateJurado";
import { MdOutlineDelete } from "react-icons/md";
import { deleteJurado } from "@/actions/deleteJurado";
import Back from "../Back";
import { JuradoFull } from "@/types/JuradoFull";
import JuradoListaConcurso from "./JuradoListaConcurso";
import { cn } from "@/lib/utils";

export default function JuradoForm({ type, jurado, concursos }: { type: 'create' | 'edit', jurado?: usuario, concursos?: Concurso[] }) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState, setError } = useForm<Usuario | UsuarioUpdate>({
        resolver: zodResolver(type == 'create' ? usuarioSchema : usuarioUpdateSchema),
        defaultValues: {
            ...jurado,
            password: ''
        }
    });
    const router = useRouter();
    const { errors } = formState;

    const onDelete = () => {
        startTransition(async () => {
            await deleteJurado(jurado?.id as string)
            router.push("/admin/jurados")
        })
    }

    const onSubmit = async (data: Usuario | UsuarioUpdate) => {
        startTransition(async () => {
            try {
                const resultado = type == "create" ? await createJurado(data as Usuario) : await updateJurado(jurado?.id as string, data as UsuarioUpdate)
                if ('error' in resultado) {
                    setError("usuario", { message: resultado.error, type: 'custom' })
                    return
                }

                router.push("/admin/jurados")

            } catch (error) {
                console.log(error)
            }
        });
    };

    return (
        <div className={cn("flex flex-col gap-4", type == "edit" ? "md:grid grid-cols-2 lg:grid-cols-3" : "max-w-xl mx-auto")}>
            <div className="bg-white rounded-lg shadow-lg p-4 w-full">
                <Back href={"/admin/jurados"} />

                <h1 className="text-3xl my-2 font-bold text-gray-900">{type == "create" ? "Crear" : "Editar"} Jurado</h1>


                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Nombre del Jurado"
                            {...register("nombre")}
                            className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.nombre ? "border-red-500" : ""
                                }`}
                        />
                        {errors.nombre && (
                            <span className="text-red-500 text-sm">Nombre es requerido</span>
                        )}

                        <label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                            Usuario
                        </label>
                        <Input
                            id="usuario"
                            type="text"
                            placeholder="Usuario del Jurado"
                            {...register("usuario")}
                            className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.usuario ? "border-red-500" : ""
                                }`}
                        />
                        {errors.usuario && (
                            <span className="text-red-500 text-sm">{errors.usuario.message}</span>
                        )}

                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Contraseña del Jurado"
                            {...register("password")}
                            className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.password ? "border-red-500" : ""
                                }`}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">Contraseña es requerida</span>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 justify-end">
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
                                <Button onClick={onDelete} disabled={isPending} variant={"destructive"}>
                                    <MdOutlineDelete size={24} />
                                </Button>
                            )
                        }
                    </div>
                </form>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4 w-full">
                <h2 className="font-bold">Agregar a concurso</h2>
                {type == "edit" && (
                    <JuradoListaConcurso jurado={jurado as JuradoFull} concursos={concursos as Concurso[]} />

                )}
            </div>
        </div>
    );
}
