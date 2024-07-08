"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CriteriosSchema } from "@/schemas/criterios";
import { PonderacionSchema } from "@/schemas/ponderacion";
import { useLocalStorage } from 'usehooks-ts';
import AddCriterioForm from "@/components/AddCriterioForm";
import CriterioItem from "@/components/CriterioItem";
import PonderacionDialog from "@/components/PonderacionDialog";
import { v4 as uuidv4 } from "uuid";

export default function CrearRubrica() {
    const [criterios, setCriterios] = useLocalStorage<CriteriosSchema[]>('crear-criterios', []);
    const [showCriterios, setShowCriterios] = useState<CriteriosSchema[]>([]);
    const [addPonderacionDialog, setAddponderacionDialog] = useState(false);
    const [editPonderacionDialog, setEditPonderacionDialog] = useState(false);
    const [idCriterio, setIdCriterio] = useState<string | undefined>();
    const [idPonderacion, setIdPonderacion] = useState<string | undefined>();
    const [formAddCriterio, setformAddCriterio] = useState(false);

    const addCriterios = (data: CriteriosSchema) => {
        setCriterios([...criterios, data]);
        setformAddCriterio(false);
    };

    const editCriterio = (id: string, data:CriteriosSchema) =>{
        setCriterios(criterios.map(criterio => {
            if(criterio.id == id){
                return data
            }
            return criterio
        }))
    }
    const deleteCriterio = (id: string) => {
        setCriterios(criterios.filter(criterio => criterio.id !== id));
    };

    const duplicarCriterio = (id:string)=>{
        const criterioDuplicated = {...criterios.find(criterio => criterio.id == id)};
        if(!criterioDuplicated) return;

        criterioDuplicated.id = uuidv4();
        criterioDuplicated.ponderaciones?.map(ponderacion => {
            ponderacion.id = uuidv4()
            return ponderacion
        })
        criterioDuplicated.nombre+= " Copia"
        
        setCriterios([...criterios, criterioDuplicated as CriteriosSchema])
    }

    const addPonderacion = (data: PonderacionSchema) => {
        setCriterios(criterios.map((criterio) => {
            if (criterio.id === idCriterio) {
                if (!criterio.ponderaciones) {
                    criterio.ponderaciones = [];
                }
                criterio.ponderaciones = [...criterio.ponderaciones, data];
                return criterio;
            }
            return criterio;
        }));
        setAddponderacionDialog(false);
    };

    const openPonderacionCriterio = (id: string) => {
        setAddponderacionDialog(true);
        setIdCriterio(id);
    };

    const deletePonderacion = (idCriterio: string, idPonderacion: string) => {
        setCriterios(criterios.map(criterio => {
            if (criterio.id == idCriterio) {
                const ponderaciones = criterio.ponderaciones?.filter(ponderacion => ponderacion.id !== idPonderacion) || [];
                criterio.ponderaciones = ponderaciones;
            }
            return criterio;
        }));
    };

    const abrirEditarPonderacion = (idCriterio: string, idPonderacion: string) => {
        const ponderacion = criterios.find(criterio => criterio.id == idCriterio)?.ponderaciones?.find(ponderacion => ponderacion.id == idPonderacion);
        setIdCriterio(idCriterio);
        setIdPonderacion(idPonderacion);
        if (ponderacion) {
            setEditPonderacionDialog(true);
        }
    };

    const editarPonderacion = (data: PonderacionSchema) => {
        setCriterios(criterios.map(criterio => {
            if (criterio.id == idCriterio) {
                const ponderaciones = criterio.ponderaciones?.map(ponderacion => {
                    if (ponderacion.id == idPonderacion) {
                        return data;
                    }
                    return ponderacion;
                }) || [];
                criterio.ponderaciones = ponderaciones;
            }
            return criterio;
        }));
        setEditPonderacionDialog(false);
    };

    useEffect(() => {
        setShowCriterios(criterios);
    }, [criterios]);

    return (
        <>
            <h2 className="mb-6">Creacion de Rubrica</h2>
            <div className="space-y-4 mb-4">
                <h3>Informacion de la rubrica</h3>
                <Input placeholder="Nombre de la rubrica" />
                <Textarea placeholder="Descripcion de la rubrica" />
            </div>
            <div className="space-y-4 mb-4">
                <h3>Criterios</h3>
                <Button onClick={() => setformAddCriterio(!formAddCriterio)}>
                    {formAddCriterio ? "Cerrar" : "Añadir Criterio"}
                </Button>
                {formAddCriterio && <AddCriterioForm onSubmit={addCriterios} />}
                <div className="flex flex-col gap-4 ">
                    {showCriterios.map((criterio) => (
                        <CriterioItem
                            key={criterio.id}
                            criterio={criterio}
                            onDuplicate={duplicarCriterio}
                            onDelete={deleteCriterio}
                            onEdit={editCriterio}
                            onAddPonderacion={openPonderacionCriterio}
                            onEditPonderacion={abrirEditarPonderacion}
                            onDeletePonderacion={deletePonderacion}
                        />
                    ))}
                </div>
            </div>
            <PonderacionDialog
                open={addPonderacionDialog}
                onClose={() => setAddponderacionDialog(false)}
                onSubmit={addPonderacion}
            />
            <PonderacionDialog
                open={editPonderacionDialog}
                onClose={() => setEditPonderacionDialog(false)}
                onSubmit={editarPonderacion}
                defaultValues={criterios.find(criterio => criterio.id == idCriterio)?.ponderaciones?.find(ponderacion => ponderacion.id == idPonderacion)}
            />
        </>
    );
}
