"use client"
import { rubricaSchema, RubricaSchema } from "@/schemas/rubrica"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useEffect, useState, useTransition } from "react"
import { criteriosSchema, CriteriosSchema } from "@/schemas/criterios"
import { RubricaData } from "@/types/RubricaData"
import { ponderacionSchema, PonderacionSchema } from "@/schemas/ponderacion"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog"
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { RubricaFull } from "@/types/RubricaFull"
import { Prisma, RubricaCriterios } from "@prisma/client"
import { editDatosGeneralesRubrica } from "@/actions/editDatosGeneralesRubrica"
import { useRouter } from "next/navigation"
import { Alert } from "../ui/alert"
import { createCriterio } from "@/actions/createCriterio"
import { deleteCriterio } from "@/actions/deleteCriterio"
import { duplicarCriterio } from "@/actions/duplicarCriterio"
import { CriterioFull } from "@/types/CriterioFull"

export default function EditarRubricaForm({ rubrica }: { rubrica: RubricaFull }) {
    const { register, handleSubmit } = useForm<RubricaSchema>({
        defaultValues: {
            nombre: rubrica.nombre,
            descripcion: rubrica.descripcion
        },
        resolver: zodResolver(rubricaSchema)
    })
    const [formAddCriterio, setformAddCriterio] = useState(false);
    const [cargando, startTransition] = useTransition()
    const [addPonderacionDialog, setAddponderacionDialog] = useState(false)
    const [editPonderacionDialog, setEditPonderacionDialog] = useState(false)
    const [idCriterio, setIdCriterio] = useState();
    const [idPonderacion, setIdPonderacion] = useState();
    const [alerta, setAlerta] = useState<string>();

    const enviarDatos = (data: RubricaSchema) => {
        startTransition(async () => {
            try {
                await editDatosGeneralesRubrica(rubrica.id, data);
                setAlerta("Cambios aplicados !")
            } catch (error) {

            }
        })
    }

    const onDeleteCriterio = (id:string) =>{
        startTransition(async()=>{
            try {
                await deleteCriterio(id);
                setAlerta("Se ha eliminado el criterio !")
            } catch (error) {
                console.log(error)
            }
        })
    }

    const onDuplicarCriterio = (id_criterio:string)=>{
       startTransition(async()=>{
            try {
                const criterio = rubrica.criterios.find(criterio => criterio.id==id_criterio)

                await duplicarCriterio(rubrica.id,criterio as CriterioFull)
            } catch (error) {
                console.log(error)
            }
       })
    }

    const crearCriterioRubrica = (data : CriteriosSchema)=>{
        startTransition(async()=>{
            try {
                await createCriterio(rubrica.id, data);
                setformAddCriterio(false)
                setAlerta("Se ha creado el criterio existosamente")
            } catch (error) {
                console.log(error)
            }
        })
    }

    return (
        <>
            <h2 className="mb-6">Creacion de Rubrica</h2>
            {alerta && <Alert variant={"destructive"} className="!border-blue-500 !text-blue-500">{alerta}</Alert>}
            <form onSubmit={handleSubmit(enviarDatos)} className="space-y-4 mb-4">
                <h3>Informacion general de la rubrica</h3>
                <Input {...register("nombre")} placeholder="Nombre de la rubrica" />
                <Textarea  {...register("descripcion")} placeholder="Descripcion de la rubrica" />
                <Button disabled={cargando} className="w-full mt-4">Editar Rubrica</Button>
            </form>
            <div className="space-y-4 mb-4">
                <h3>Criterios</h3>
                <Button disabled={cargando} onClick={() => setformAddCriterio(!formAddCriterio)}>
                    {formAddCriterio ? "Cerrar" : "Añadir Criterio"}
                </Button>
                {formAddCriterio && <AddCriterioServerActionForm onSubmit={crearCriterioRubrica} disabled={cargando} />}
                <div className="flex flex-col gap-4 ">
                    {rubrica.criterios.map((criterio) => (
                        <CriterioItemServerAction
                            key={criterio.id}
                            criterio={criterio}
                            disabled={cargando}
                            onDuplicate={onDuplicarCriterio}
                            onDelete={onDeleteCriterio}
                            onEdit={() => { }}
                            onAddPonderacion={() => { }}
                            onEditPonderacion={() => { }}
                            onDeletePonderacion={() => { }}
                        />
                    ))}
                </div>
            </div>
            <PonderacionDialog
                open={addPonderacionDialog}
                onClose={() => setAddponderacionDialog(false)}
                onSubmit={() => { }}
            />
            <PonderacionDialog
                open={editPonderacionDialog}
                onClose={() => setEditPonderacionDialog(false)}
                onSubmit={() => { }}
                defaultValues={rubrica.criterios.find(criterio => criterio.id == idCriterio)?.puntajes?.find(ponderacion => ponderacion.id == idPonderacion)}
            />
        </>
    )
}


interface AddCriterioServerActionFormProps {
    onSubmit: (data: CriteriosSchema)=> void
    disabled: boolean
}

function AddCriterioServerActionForm({onSubmit, disabled }: AddCriterioServerActionFormProps) {
    const { register, handleSubmit, reset } = useForm<CriteriosSchema>({
        resolver: zodResolver(criteriosSchema)
    });

    const handleFormSubmit = (data: CriteriosSchema) => {
        onSubmit(data)
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-sm">
            <Input {...register("nombre")} placeholder="Nombre del criterio" />
            <Textarea {...register("descripcion")} placeholder="Descripcion del criterio" />
            <Button disabled={disabled}>Crear</Button>
        </form>
    );
}


interface CriterioItemServerActionProps {
    criterio: Prisma.RubricaCriteriosGetPayload<{
        include: {
            puntajes: true
        }
    }>;
    disabled: boolean;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onEdit: (id: string, data: CriteriosSchema) => void;
    onAddPonderacion: (id: string) => void;
    onEditPonderacion: (idCriterio: string, idPonderacion: string) => void;
    onDeletePonderacion: (idCriterio: string, idPonderacion: string) => void;
}

function CriterioItemServerAction({
    criterio,
    disabled,
    onDelete,
    onEdit,
    onDuplicate,
    onAddPonderacion,
    onEditPonderacion,
    onDeletePonderacion
}: CriterioItemServerActionProps) {
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
                        <Textarea {...register("descripcion")} placeholder={criterio.descripcion} />
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
            <Button disabled={disabled} onClick={()=> onDuplicate(criterio.id as string)} variant={"outline"}>Duplicar Criterio</Button>

            <div className="mt-2">
                <h3 className="font-bold text-lg">Criterios</h3>
                <Button disabled={disabled} onClick={() => onAddPonderacion(criterio.id as string)}>Agregar Ponderacion</Button>
            </div>
            {
                criterio.puntajes?.map(ponderacion => (
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


interface PonderacionDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PonderacionSchema) => void;
    defaultValues?: PonderacionSchema;
}

function PonderacionDialog({ open, onClose, onSubmit, defaultValues }: PonderacionDialogProps) {
    const { register, handleSubmit, control, reset } = useForm<PonderacionSchema>({
        resolver: zodResolver(ponderacionSchema),
        defaultValues
    });


    useEffect(() => {
        reset(defaultValues)
        return () => {
            reset();
        }
    }, [defaultValues])

    const handleFormSubmit = (data: PonderacionSchema) => {
        onSubmit(data);
        reset();
        onClose();
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{defaultValues ? "Editar Ponderacion" : "Crear Ponderacion"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Escribe todos los campos que se requiren
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <Input {...register("nombre")} placeholder="Nombre ponderacion" />
                    <Controller
                        control={control}
                        name="tipo"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de ponderacion" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="escalaUnoCinco">Escala del Uno al Cinco</SelectItem>
                                    <SelectItem value="Si_No">Si / No</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit">Continue</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

