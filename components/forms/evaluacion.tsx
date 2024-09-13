"use client"
import { CriterioFull } from "@/types/CriterioFull";
import { Controller, useForm, } from "react-hook-form";
import { Button } from "../ui/button";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState, useTransition } from "react";
import { enviarResultados } from "@/actions/enviarResultados";
import { Input } from "../ui/input";

export default function Evaluacion({ criterios, id_participacion }: { criterios: CriterioFull[], id_participacion: string }) {
    const [evaluacion, setEvaluacion, remove] = useLocalStorage("evaluacion-" + id_participacion, {})
    const methods = useForm();
    const [query, setQuery] = useState("");
    const [cargando, startTransition] = useTransition()
    const onSubmit = (data: any) => {
        startTransition(async () => {
            try {
                await enviarResultados(data);
                remove()
            } catch (error) {
                console.log(error)
            }
        })
    };

    useEffect(() => {
        methods.reset({
            ...evaluacion,
            id_participacion,
        })
    }, [evaluacion])

    return (
        <>
            <div className="my-2 ">
                <h3>Buscar Ponderacion: </h3>
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value.toLowerCase())
                    }}
                    placeholder="Buscar criterio/ponderacion" />

            </div>
            <form className="flex flex-col gap-4" onSubmit={methods.handleSubmit(onSubmit, (e) => { console.log(e) })}>
                {criterios.filter(criterio => criterio.nombre.toLowerCase().includes(query) || criterio.puntajes.find(ponderacion => ponderacion.nombre.toLowerCase().includes(query))).map(criterio => <CriterioItem query={query} id_participacion={id_participacion} key={criterio.id} criterio={criterio} control={methods.control} />)}
                <Button disabled={cargando} type="submit">Enviar</Button>
            </form>
        </>
    )
}

const CriterioItem = ({ criterio, control, id_participacion, query}: { criterio: CriterioFull, control: any, id_participacion: string, query: string }) => {
    return (
        <div className="border p-4 rounded shadow-md">
            <h2 className="font-bold text-2xl">{criterio.nombre}</h2>
            <p className="text-gray-500">{criterio.descripcion}</p>

            <div className="mt-6">
                {criterio.puntajes.filter(puntaje => puntaje.nombre.toLowerCase().includes(query)).map(puntaje => {
                    const { tipo } = puntaje;

                    if (tipo === "Si_No") {
                        return (
                            <div key={puntaje.id} className="mb-4">
                                <h2 className="font-bold text-lg">{puntaje.nombre}</h2>
                                <div className="grid grid-cols-2 text-center gap-4 mt-2">
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Si" value="1" description="Este criterio se cumple" />
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="No" value="0" description="Este criterio no se cumple" />
                                </div>
                            </div>
                        );
                    }
                    if (tipo === "escalaUnoCinco") {
                        return (
                            <div key={puntaje.id} className="mb-4">
                                <h2 className="font-bold text-lg">{puntaje.nombre}</h2>
                                <div className="flex overflow-auto gap-4 mt-2">
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Excelente" value="5" description="5" />
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Muy Bueno" value="4" description="4" />
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Bueno" value="3" description="3" />
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Regular" value="2" description="2" />
                                    <CheckboxOption id_participacion={id_participacion} control={control} name={puntaje.id} label="Deficiente" value="1" description="1" />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

const CheckboxOption = ({ label, description, value, name, control, id_participacion }: { label: string, description?: string, value?: string, name: string, control: any, id_participacion: string }) => {
    const [evaluacion, setEvaluacion] = useLocalStorage("evaluacion-" + id_participacion, {})
    return (
        <label htmlFor={label + "-" + name} className="border puntaje min-w-36 rounded cursor-pointer select-none p-4 flex items-center flex-col">
            <h2>{label}</h2>
            {description && <p className="text-sm text-gray-500">{description}</p>}
            {value &&
                <Controller
                    name={name}
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                        <input type="radio" id={label + "-" + name} {...field} onChange={e => {
                            field.onChange(e)
                            setEvaluacion({
                                ...evaluacion,
                                [name]: e.target.value
                            })
                        }} value={value} checked={field.value === value} className="mt-2" />
                    )}
                />
            }
        </label>
    );
};
