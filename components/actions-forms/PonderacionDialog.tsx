import { ponderacionSchema, PonderacionSchema } from "@/schemas/ponderacion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { v4 } from "uuid"

interface PonderacionDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: PonderacionSchema, id?: string) => void
  defaultValues?: PonderacionSchema
}

export default function PonderacionDialog({ open, onClose, onSubmit, defaultValues }: PonderacionDialogProps) {
  const { register, handleSubmit, control, reset } = useForm<PonderacionSchema>({
    resolver: zodResolver(ponderacionSchema),
    defaultValues
  })

  useEffect(() => {
    if (!defaultValues?.id) {
      reset({
        id: v4()
      })
    }
    reset(defaultValues)
  }, [defaultValues, reset])

  const handleFormSubmit = (data: PonderacionSchema) => {
    onSubmit(data, defaultValues?.id)
    reset()
    onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{defaultValues ? "Editar Ponderación" : "Crear Ponderación"}</AlertDialogTitle>
          <AlertDialogDescription>
            Completa los campos requeridos
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de ponderación" />
                </SelectTrigger>
                <SelectContent
                  ref={(ref) => {
                    if (!ref) return;
                    ref.ontouchstart = (e) => {
                      e.preventDefault();
                    };
                  }}
                >
                  <SelectItem value="escalaUnoCinco">Escala del Uno al Cinco</SelectItem>
                  <SelectItem value="Si_No">Si / No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Input {...register("nombre")} placeholder="Nombre de la ponderación" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">Continuar</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}