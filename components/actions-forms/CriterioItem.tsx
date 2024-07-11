import { criteriosSchema, CriteriosSchema } from "@/schemas/criterios"
import { CriterioFull } from "@/types/CriterioFull"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { MdOutlineChevronRight, MdOutlineCopyAll, MdOutlineDelete, MdOutlineEdit } from "react-icons/md"
import { cn } from "@/lib/utils"
interface CriterioItemProps {
    criterio: CriterioFull | CriteriosSchema
    disabled: boolean
    onDelete: (id: string) => void
    onDuplicate: (id: string) => void
    onEdit: (id: string, data: CriteriosSchema) => void
    onAddPonderacion: (id: string) => void
    onEditPonderacion: (id: string, id_criterio: string) => void
    onDeletePonderacion: (id: string) => void
}

export default function CriterioItem({
    criterio,
    disabled,
    onDelete,
    onDuplicate,
    onEdit,
    onAddPonderacion,
    onEditPonderacion,
    onDeletePonderacion
}: CriterioItemProps) {
    const [editMode, setEditMode] = useState(false)
    const { register, handleSubmit } = useForm<CriteriosSchema>({
        resolver: zodResolver(criteriosSchema),
        defaultValues: criterio
    })
    const [open, setOpen] = useState(true);

    return (
        <div className="border p-4 bg-white rounded shadow-sm">
            {editMode ? (
                <form onSubmit={handleSubmit(data => {
                    onEdit(criterio.id, data)
                    setEditMode(false)
                })} className="space-y-4 mb-4">
                    <Input {...register("nombre")} placeholder="Nombre del criterio" />
                    <Textarea {...register("descripcion")} placeholder="Descripción del criterio" />
                    <Button disabled={disabled}>Guardar Cambios</Button>
                    <Button disabled={disabled} type="button" onClick={() => setEditMode(false)} variant="outline">Cerrar</Button>
                </form>
            ) : (
                <>
                    <h4 className="text-2xl font-bold text-gray-900">{criterio.nombre}</h4>
                    <p className="font-normal text-gray-600 my-2">{criterio.descripcion}</p>
                    <div className="flex md:flex-row flex-col gap-2">
                        <Button disabled={disabled} className="aspect-square p-2" onClick={() => setEditMode(true)}>
                            <MdOutlineEdit size={28} />
                        </Button>
                        <Button disabled={disabled} className="aspect-square p-2" onClick={() => onDelete(criterio.id)} variant="destructive">
                            <MdOutlineDelete size={28} />
                        </Button>
                        <Button disabled={disabled} className="aspect-square p-2" onClick={() => onDuplicate(criterio.id)} variant="outline">
                            <MdOutlineCopyAll size={28} />
                        </Button>
                    </div>
                    <div className="mt-4">
                        <div className="flex flex-col md:flex-row md:items-center  justify-between gap-2">
                            <div onClick={() => setOpen(e => !e)} className="flex select-none cursor-pointer items-center gap-2">
                                <MdOutlineChevronRight className={cn(open && "rotate-90")} size={24} />
                                <h5 className="text-lg font-semibold">Ponderaciones</h5>
                            </div>
                            {open && <Button disabled={disabled} onClick={() => onAddPonderacion(criterio.id)}>Agregar Ponderación</Button>
                            }
                        </div>
                        {open && criterio.puntajes.map(ponderacion => (
                            <div key={ponderacion.id} className="bg-gray-50 p-4 border rounded mt-2">
                                <p>{ponderacion.nombre}</p>
                                <p>{ponderacion.tipo}</p>
                                <div className="flex md:flex-row flex-col gap-2">
                                    <Button disabled={disabled} className="aspect-square p-2" onClick={() => onEditPonderacion(ponderacion.id, criterio.id)}>
                                        <MdOutlineEdit size={28} />
                                    </Button>
                                    <Button disabled={disabled} className="aspect-square p-2" onClick={() => onDeletePonderacion(ponderacion.id)} variant="destructive">
                                        <MdOutlineDelete size={28} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
