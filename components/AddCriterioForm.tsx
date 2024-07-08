"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { criteriosSchema, CriteriosSchema } from "@/schemas/criterios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface AddCriterioFormProps {
    onSubmit: (data: CriteriosSchema) => void;
}

export default function AddCriterioForm({ onSubmit }: AddCriterioFormProps) {
    const { register, handleSubmit, reset } = useForm<CriteriosSchema>({
        resolver: zodResolver(criteriosSchema)
    });

    const handleFormSubmit = (data: CriteriosSchema) => {
        onSubmit(data);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-sm">
            <Input {...register("nombre")} placeholder="Nombre del criterio" />
            <Textarea {...register("descripcion")} placeholder="Descripcion del criterio" />
            <Button>Crear</Button>
        </form>
    );
}
