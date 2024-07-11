import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { criteriosSchema, CriteriosSchema } from "@/schemas/criterios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { v4 } from "uuid"

interface AddCriterioFormProps  {
    onSubmit: (data: CriteriosSchema) => void
    disabled: boolean
  }
  
  export default function AddCriterioForm({ onSubmit, disabled }: AddCriterioFormProps) {
    const { register, handleSubmit, reset } = useForm<CriteriosSchema>({
      resolver: zodResolver(criteriosSchema),
      defaultValues: {
        id: v4()
    }
    })
  
    const handleFormSubmit = (data: CriteriosSchema) => {
      onSubmit(data)
      reset({
        id: v4()
      })
    }
  
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 max-w-sm">
        <Input {...register("nombre")} placeholder="Nombre del criterio" />
        <Textarea {...register("descripcion")} placeholder="Descripción del criterio" />
        <Button disabled={disabled}>Crear</Button>
      </form>
    )
  }