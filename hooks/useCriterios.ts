import { useState } from "react";
import { CriteriosSchema } from "@/schemas/criterios";
import { PonderacionSchema } from "@/schemas/ponderacion";
import { v4 as uuidv4 } from "uuid";

export function useCriterios(initialCriterios: CriteriosSchema[] = []) {
    const [criterios, setCriterios] = useState<CriteriosSchema[]>(initialCriterios);
    const [idCriterio, setIdCriterio] = useState<string | undefined>();
    const [idPonderacion, setIdPonderacion] = useState<string | undefined>();

    const addCriterio = (data: CriteriosSchema) => {
        data.id = uuidv4();
        setCriterios([...criterios, data]);
    };

    const editCriterio = (id: string, data: CriteriosSchema) => {
        setCriterios(criterios.map(criterio => criterio.id === id ? { ...criterio, ...data } : criterio));
    };

    const deleteCriterio = (id: string) => {
        setCriterios(criterios.filter(criterio => criterio.id !== id));
    };

    const duplicarCriterio = (id: string) => {
        const criterio = criterios.find(c => c.id === id);
        if (criterio) {
            const criterioDuplicated = { ...criterio, id: uuidv4(), nombre: `${criterio.nombre} Copia` };
            criterioDuplicated.puntajes = criterio.puntajes?.map(p => ({ ...p, id: uuidv4() }));
            setCriterios([...criterios, criterioDuplicated]);
        }
    };

    const addPonderacion = (data: PonderacionSchema) => {
        setCriterios(criterios.map(criterio => 
            criterio.id === idCriterio ? { ...criterio, ponderaciones: [...(criterio.puntajes || []), { ...data, id: uuidv4() }] } : criterio
        ));
    };

    const editPonderacion = (data: PonderacionSchema) => {
        setCriterios(criterios.map(criterio => 
            criterio.id === idCriterio ? {
                ...criterio, 
                ponderaciones: criterio.puntajes?.map(p => p.id === idPonderacion ? { ...p, ...data } : p)
            } : criterio
        ));
    };

    const deletePonderacion = (idCriterio: string, idPonderacion: string) => {
        setCriterios(criterios.map(criterio => 
            criterio.id === idCriterio ? {
                ...criterio, 
                ponderaciones: criterio.puntajes?.filter(p => p.id !== idPonderacion)
            } : criterio
        ));
    };

    return {
        criterios,
        addCriterio,
        editCriterio,
        deleteCriterio,
        duplicarCriterio,
        addPonderacion,
        editPonderacion,
        deletePonderacion,
        setIdCriterio,
        setIdPonderacion,
        idCriterio,
        idPonderacion
    };
}
