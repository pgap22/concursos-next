"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ponderacionSchema, PonderacionSchema } from "@/schemas/ponderacion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PonderacionDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PonderacionSchema) => void;
    defaultValues?: PonderacionSchema;
}

export default function PonderacionDialog({ open, onClose, onSubmit, defaultValues }: PonderacionDialogProps) {
    const { register, handleSubmit, control, reset } = useForm<PonderacionSchema>({
        resolver: zodResolver(ponderacionSchema),
        defaultValues
    });

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
