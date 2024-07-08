"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Importamos useRouter desde next/navigation
import { concursante } from "@prisma/client";
import Link from "next/link";
import { Alert } from "../ui/alert";
import { Concursante, concursanteSchema } from "@/schemas/concursante";
import { createConcursante } from "@/actions/createConcursante";
import { updateConcursante } from "@/actions/updateConcursante";


export default function ConcursanteForm({ type, concursante }: { type: 'create' | 'edit', concursante?: concursante }) {
    const [isPending, startTransition] = useTransition();

    const { register, handleSubmit, formState, setError } = useForm<Concursante>({
        resolver: zodResolver(concursanteSchema),
        defaultValues: {
            ...concursante,
        }
    });

    const router = useRouter();
    const { errors } = formState;

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
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">{type === "create" ? "Crear" : "Editar"} Concursante</h1>

            {/* Botón de importar Excel (simulado) */}
            <div className="my-2 mb-6">
                <Button>Importar Excel</Button>
            </div>

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
                        <Link href={"/admin/concursantes"}>
                            Cancelar
                        </Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
