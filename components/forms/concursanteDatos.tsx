"use client"
import { ConcursanteFull } from "@/types/ConcursanteFull";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { datosGenralesConcursanteSchema, DatosGenralesConcursanteSchema } from "@/schemas/datosGeneralesConcursante";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { agregarDatosGenerales } from "@/actions/agregarDatosGenerales";
import { DatosGeneralesConcursante } from "@prisma/client";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { editDatosGeneralesRubrica } from "@/actions/editDatosGeneralesRubrica";
import { editarDatosGenerales } from "@/actions/editarDatosGenerales";
import { deleteDatosGenerales } from "@/actions/deleteDatosGenerales";

export default function ConcursanteDatos({ concursante }: { concursante: ConcursanteFull }) {
    const { register, handleSubmit, reset } = useForm<DatosGenralesConcursanteSchema>({
        resolver: zodResolver(datosGenralesConcursanteSchema)
    })
    console.log(concursante)
    const [loading, startTransition] = useTransition();
    const crearDatosGeneraleas = (data: DatosGenralesConcursanteSchema) => {
        startTransition(async () => {
            try {
                await agregarDatosGenerales(data, concursante.id)
                reset();
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 w-full">
            <h2 className="font-bold">Datos Generales Adicionales</h2>
            <form onSubmit={handleSubmit(crearDatosGeneraleas)}>
                <div className="flex flex-col gap-2">
                    <Input {...register("campo")} placeholder="Campo Ej: No Participante" />
                    <Input {...register("valor")} placeholder="Valor Ej: 14" />
                </div>
                <Button disabled={loading} className="w-full mt-2">Agregar</Button>
            </form>
            <div className="flex flex-col gap-2 mt-2">
                {
                    concursante?.DatosGeneralesConcursante.map(dato => <DatoGeneralConcursante key={dato.id} dato={dato} />)
                }
            </div>
        </div>
    )
}


const DatoGeneralConcursante = ({ dato }: { dato: DatosGeneralesConcursante }) => {
    const { register, handleSubmit } = useForm<DatosGeneralesConcursante>({
        resolver: zodResolver(datosGenralesConcursanteSchema),
        defaultValues: {
            campo: dato.campo,
            valor: dato.valor
        }
    })
    const [editMode, setEditMode] = useState(false)
    const [loading, startTransition] = useTransition();

    const editarDato = (data:DatosGenralesConcursanteSchema)=>{
        startTransition(async()=>{
            try {
                await editarDatosGenerales(data,dato.id)
                setEditMode(false)
            } catch (error) {
                console.log(error)
            }
        })   
    }
    const deleteDato = ()=>{
        startTransition(async()=>{
            try {
                await deleteDatosGenerales(dato.id)
            } catch (error) {
                console.log(error)
            }
        })   
    }

    return (
        <div className="flex flex-col items-center gap-2 border p-2 rounded-md">
            {
                editMode
                    ?
                    <form onSubmit={handleSubmit(editarDato)} className="flex w-full flex-col gap-2">
                        <Input {...register("campo")} placeholder="Campo Ej: No Participante" />
                        <Input {...register("valor")} placeholder="Valor Ej: 14" />
                        <Button disabled={loading}>Editar</Button>
                    </form>
                    : (
                        <div className="text-sm w-full flex gap-2 overflow-auto">
                            <p className="font-bold">{dato.campo}:</p>
                            <p>{dato.valor}</p>
                        </div>
                    )
            }
            <div className="w-full flex">
                <Button disabled={loading} onClick={()=> setEditMode(e => !e)} className="aspect-square w-8 h-8 p-0">
                    <MdOutlineEdit size={20} />
                </Button>
                <Button disabled={loading} onClick={deleteDato} variant={"destructive"} className="aspect-square ml-2 w-8 h-8 p-0">
                    <MdOutlineDelete size={20} />
                </Button>
            </div>
        </div>
    )
}