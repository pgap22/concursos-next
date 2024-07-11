"use server"

import { signIn } from "@/auth"
import { Login } from "@/schemas/login"
import { AuthError } from "next-auth";

export async function authLogin(data : Login) {
    try {
        console.log(data)
        await signIn("credentials",data);
    } catch (error) {
       if(error instanceof AuthError){
        throw "Usuario o contraseña incorrecto"
       }
        throw "Error en el servidor
    }
}
