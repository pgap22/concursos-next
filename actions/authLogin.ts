"use server"

import { signIn } from "@/auth"
import { Login } from "@/schemas/login"
import { AuthError } from "next-auth";

export async function authLogin(data : Login) {
    try {
        await signIn("credentials",data);
    } catch (error) {
        console.log(error)
       if(error instanceof AuthError){
        return {error: "Usuario o Contraseña Invalidos"}
       }
        return {error: "Error en el servidor"}
    }
}
