"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { set, useForm } from "react-hook-form"
import { Login, loginSchema } from "@/schemas/login"
import { Button } from "../ui/button"
import { useState, useTransition } from "react"
import { authLogin } from "@/actions/authLogin"
import { Alert } from "../ui/alert"
import { useRouter } from "next/navigation"
export default function InciarSesion() {
    const { register, handleSubmit } = useForm<Login>({
        resolver: zodResolver(loginSchema)
    })

    const [loading, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();

    const submit = (data: Login) => {
        setError("")
        startTransition(async () => {
            try {
                const resultado = await authLogin(data);
                if (resultado?.error) {
                    setError(resultado.error)
                    return
                }
                router.push("/redirect")
            } catch (error: any) {
                setError("Error en el servidor")
            }
        })
    }

    return (
        <div className="p-4 flex items-center justify-center md:min-h-screen">
            <div className="w-full md:max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4">
                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    {error && (
                        <Alert className="bg-red-100 text-red-700 border-red-400">
                            Error: {error}
                        </Alert>
                    )}
                    <div>
                        <Input
                            {...register('usuario')}
                            placeholder="Usuario"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <Input
                            {...register('password')}
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <Button disabled={loading} className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Iniciar Sesión
                    </Button>
                </form>
            </div>
        </div>
    )
}
