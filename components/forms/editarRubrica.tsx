"use client"
import { rubricaSchema, RubricaSchema } from "@/schemas/rubrica"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useState, useTransition } from "react"
import { CriteriosSchema } from "@/schemas/criterios"
import { PonderacionSchema } from "@/schemas/ponderacion"
import { RubricaFull } from "@/types/RubricaFull"
import { editDatosGeneralesRubrica } from "@/actions/editDatosGeneralesRubrica"
import { createCriterio } from "@/actions/createCriterio"
import { deleteCriterio } from "@/actions/deleteCriterio"
import { duplicarCriterio } from "@/actions/duplicarCriterio"
import { CriterioFull } from "@/types/CriterioFull"
import { editCriterio } from "@/actions/editCriterio"
import { deleteRubricaAction } from "@/actions/deleteRubrica"
import { crearPuntaje } from "@/actions/crearPuntaje"
import { deletePuntaje } from "@/actions/deletePuntaje"
import { editPuntaje } from "@/actions/editPuntaje"
import AddCriterioForm from "../actions-forms/AddCriterioForm"
import CriterioItem from "../actions-forms/CriterioItem"
import PonderacionDialog from "../actions-forms/PonderacionDialog"
import { duplicarRubrica } from "@/actions/duplicarRubrica"
import { useRouter } from "next/navigation"

export default function EditarRubricaForm({ rubrica }: { rubrica: RubricaFull }) {
    const { register, handleSubmit } = useForm<RubricaSchema>({
        defaultValues: {
            nombre: rubrica.nombre,
            descripcion: rubrica.descripcion
        },
        resolver: zodResolver(rubricaSchema)
    })
    const [formAddCriterio, setFormAddCriterio] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [addPonderacionDialog, setAddPonderacionDialog] = useState(false)
    const [editPonderacionDialog, setEditPonderacionDialog] = useState(false)
    const [idCriterio, setIdCriterio] = useState<string>("")
    const [idPonderacion, setIdPonderacion] = useState<string>("")
    const [alerta, setAlerta] = useState<string>("")
    const router = useRouter();

    const enviarDatos = (data: RubricaSchema) => {
        startTransition(async () => {
            try {
                await editDatosGeneralesRubrica(rubrica.id, data)
                setAlerta("Cambios aplicados!")
            } catch (error) {
                console.error(error)
            }
        })
    }

    const onDuplicateRubrica = () => {
        startTransition(async () => {
            try {
                const duplicated = await duplicarRubrica(rubrica)
                router.push("/admin/rubricas/editar/" + duplicated?.id)
            } catch (error) {
                console.log(error)
            }
        })
    }

    const eliminarRubrica = () => {
        startTransition(async () => {
            try {
                await deleteRubricaAction(rubrica.id)
            } catch (error) {
                console.error(error)
            }
        })
    }

    const onDeleteCriterio = (id: string) => {
        startTransition(async () => {
            try {
                await deleteCriterio(id)
                setAlerta("Se ha eliminado el criterio!")
            } catch (error) {
                console.error(error)
            }
        })
    }

    const onDuplicarCriterio = (id: string) => {
        startTransition(async () => {
            try {
                const criterio = rubrica.criterios.find(c => c.id === id)
                await duplicarCriterio(rubrica.id, criterio as CriterioFull)
            } catch (error) {
                console.error(error)
            }
        })
    }

    const onEditCriterio = (id: string, data: CriteriosSchema) => {
        startTransition(async () => {
            try {
                await editCriterio(id, data)
            } catch (error) {
                console.error(error)
            }
        })
    }

    const crearCriterioRubrica = (data: CriteriosSchema) => {
        startTransition(async () => {
            try {
                await createCriterio(rubrica.id, data)
                setFormAddCriterio(false)
                setAlerta("Se ha creado el criterio exitosamente")
            } catch (error) {
                console.error(error)
            }
        })
    }

    const abrirPonderacionDialog = (id: string) => {
        setAddPonderacionDialog(true)
        setIdCriterio(id)
    }

    const onCrearPonderacion = (data: PonderacionSchema) => {
        startTransition(async () => {
            try {
                await crearPuntaje(idCriterio, data)
            } catch (error) {
                console.error(error)
            }
        })
    }

    const onDeletePuntaje = (id: string) => {
        startTransition(async () => {
            try {
                await deletePuntaje(id)
            } catch (error) {
                console.error(error)
            }
        })
    }

    const abrirEditarPonderacionDialog = (id: string, id_criterio: string) => {
        setIdPonderacion(id)
        setIdCriterio(id_criterio)
        setEditPonderacionDialog(true)
    }

    const onEditPuntaje = (data: PonderacionSchema) => {
        startTransition(async () => {
            try {
                await editPuntaje(idPonderacion, data)
            } catch (error) {
                console.error(error)
            }
        })
    }

    return (
        <div className="p-6 bg-white border rounded-md">
            <h2 className="mb-6 text-3xl font-bold">Edición de Rúbrica</h2>
            <form onSubmit={handleSubmit(enviarDatos)} className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold">Información General</h3>
                <Input {...register("nombre")} placeholder="Nombre de la rúbrica" />
                <Textarea {...register("descripcion")} placeholder="Descripción de la rúbrica" />
                <Button disabled={isPending} className="w-full mt-4">Guardar Cambios</Button>
            </form>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <h3 className="text-xl font-semibold">Criterios</h3>
                    <Button onClick={() => setFormAddCriterio(!formAddCriterio)}>
                        {formAddCriterio ? "Cerrar" : "Añadir Criterio"}
                    </Button>
                </div>
                {formAddCriterio && <AddCriterioForm onSubmit={crearCriterioRubrica} disabled={isPending} />}
                <div className="flex flex-col gap-4">
                    {rubrica.criterios.map(criterio => (
                        <CriterioItem
                            key={criterio.id}
                            criterio={criterio}
                            disabled={isPending}
                            onDuplicate={onDuplicarCriterio}
                            onDelete={onDeleteCriterio}
                            onEdit={onEditCriterio}
                            onAddPonderacion={abrirPonderacionDialog}
                            onEditPonderacion={abrirEditarPonderacionDialog}
                            onDeletePonderacion={onDeletePuntaje}
                        />
                    ))}
                </div>
                <Button disabled={isPending} onClick={eliminarRubrica} variant="destructive">Eliminar Rúbrica</Button>
                <Button disabled={isPending} className="ml-2" onClick={onDuplicateRubrica} variant="outline">Duplicar Rúbrica</Button>
            </div>
            <PonderacionDialog
                open={addPonderacionDialog}
                onClose={() => setAddPonderacionDialog(false)}
                onSubmit={onCrearPonderacion}
            />
            <PonderacionDialog
                open={editPonderacionDialog}
                onClose={() => setEditPonderacionDialog(false)}
                onSubmit={onEditPuntaje}
                defaultValues={rubrica.criterios.find(c => c.id === idCriterio)?.puntajes.find(p => p.id === idPonderacion)}
            />
        </div>
    )
}
