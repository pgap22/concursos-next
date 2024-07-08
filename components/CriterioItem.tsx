"use client";
import { Button } from "@/components/ui/button";
import { criteriosSchema, CriteriosSchema } from "@/schemas/criterios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface CriterioItemProps {
    criterio: CriteriosSchema;
    disabled: boolean;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onEdit: (id: string, data: CriteriosSchema) => void;
    onAddPonderacion: (id: string) => void;
    onEditPonderacion: (idCriterio: string, idPonderacion: string) => void;
    onDeletePonderacion: (idCriterio: string, idPonderacion: string) => void;
}

export default function CriterioItem({
    criterio,
    disabled,
    onDelete,
    onEdit,
    onDuplicate,
    onAddPonderacion,
    onEditPonderacion,
    onDeletePonderacion
}: CriterioItemProps) {
    const [editMode, setEditMode] = useState(false);
    const { register, handleSubmit } = useForm<CriteriosSchema>({
        resolver: zodResolver(criteriosSchema),
        defaultValues: criterio
    });

    return (
        <div className="border p-4 bg-white rounded min-w-44">
            {
                editMode
                    ? <form onSubmit={handleSubmit((data) => {
                        onEdit(criterio.id as string, data)
                        setEditMode(false)
                    })} className="space-y-4 mb-4" action="">
                        <Input {...register("nombre")} placeholder={criterio.nombre} />
                        <Textarea {...register("descripcion")} placeholder={criterio.descripcion}/>
                        <Button disabled={disabled}>Guardar Cambios</Button>
                        <Button disabled={disabled} type="button" onClick={() => setEditMode(false)} variant={"outline"}>Cerrar</Button>
                    </form>
                    : (<>
                        <p className="text-2xl font-bold text-gray-900">{criterio.nombre}</p>
                        <p className="font-normal text-gray-700">{criterio.descripcion}</p>
                    </>)
            }
            {!editMode && <Button disabled={disabled} onClick={() => setEditMode(e => true)}>Editar Criterio</Button>}
            <Button disabled={disabled} onClick={() => onDelete(criterio.id as string)} variant={"destructive"}>Eliminar Criterio</Button>
            <Button disabled={disabled} onClick={() => onDuplicate(criterio.id as string)} variant={"outline"}>Duplicar Criterio</Button>

            <div className="mt-2">
                <h3 className="font-bold text-lg">Criterios</h3>
                <Button disabled={disabled} onClick={() => onAddPonderacion(criterio.id as string)}>Agregar Ponderacion</Button>
            </div>
            {
                criterio.ponderaciones?.map(ponderacion => (
                    <div key={ponderacion.id} className="p-2 bg-gray-200 rounded-md">
                        <p>{ponderacion.nombre}</p>
                        <p>{ponderacion.tipo}</p>
                        <Button disabled={disabled} onClick={() => onEditPonderacion(criterio.id as string, ponderacion.id as string)}>Editar</Button>
                        <Button disabled={disabled} onClick={() => onDeletePonderacion(criterio.id as string, ponderacion.id as string)} variant={"destructive"}>Eliminar Ponderacion</Button>
                    </div>
                ))
            }
        </div>
    );
}
