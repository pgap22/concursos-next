"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Importamos useRouter desde next/navigation
import { Concurso } from "@prisma/client";
import { Alert } from "../ui/alert";
import { Concursante, concursanteSchema } from "@/schemas/concursante";
import { createConcursante } from "@/actions/createConcursante";
import { updateConcursante } from "@/actions/updateConcursante";
import { ConcursanteFull } from "@/types/ConcursanteFull";
import ConcursanteDatos from "./concursanteDatos";
import { MdOutlineDelete } from "react-icons/md";
import { deleteConcursante } from "@/actions/deleteConcursante";


export default function ConcursanteForm({ type, concursante, concursos }: {
    type: 'create' | 'edit', concursante?: ConcursanteFull, concursos?: Concurso[]
}) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState, setError } = useForm<Concursante>({
        resolver: zodResolver(concursanteSchema),
        defaultValues: {
            ...concursante,
        }
    });
    console.log(concursos)
    const router = useRouter();
    const { errors } = formState;
    const onDelete = () => {
        startTransition(async () => {
            await deleteConcursante(concursante?.id as string);
            router.push("/admin/concursantes")
        })
    }
    const onSubmit = async (data: Concursante) => {
        startTransition(async () => {
            try {
                const resultado = type === "create" ? await createConcursante(data) : await updateConcursante(concursante?.id as string, data);

                if ('error' in resultado) {
                    setError("root", { message: resultado.error, type: 'custom' });
                    return;
                }

                router.push("/admin/concursantes");

            } catch (error) {
                console.log(error);
            }
        });
    };

    return (
        <div className="flex flex-col md:grid grid-cols-2 lg:grid-cols-3 gap-4">

            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
                <h1 className="text-xl font-bold text-gray-900">{type === "create" ? "Crear" : "Editar"} Concursante</h1>

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
                            placeholder="Nombre del Concursante"
                            {...register("nombre")}
                            className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.nombre ? "border-red-500" : ""
                                }`}
                        />
                        {errors.nombre && (
                            <span className="text-red-500 text-sm">Nombre es requerido</span>
                        )}
                        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                            Institucion
                        </label>
                        <Input
                            id="nombre"
                            placeholder="Institucion"
                            {...register("institucion")}
                            className={`border border-gray-300 rounded-lg px-4 py-2 focus:outline-none ${errors.institucion ? "border-red-500" : ""
                                }`}
                        />
                        {errors.institucion && (
                            <span className="text-red-500 text-sm">La institucion es requerida</span>
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
            {
                type == "edit" && (
                    <ConcursanteDatos concursante={concursante as ConcursanteFull} />
                )
            }
            {
                type == "edit" && <div className="bg-white rounded-lg shadow-lg p-4 w-full">
                    <h2 className="font-bold">Lista de concursos inscritos</h2>
                    {
                        concursante?.participaciones.map(participacion => {
                            return (
                                <section className="my-2 last:border-none border-b py-4">
                                    <p>{participacion.concurso.nombre}</p>
                                </section>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}
