import { DefaultSession } from "next-auth";
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            usuario: string
            rol: string
            nombre: string
        } & DefaultSession['user'];
    }

    interface User {
        id: string
        usuario: string
        rol: string
        nombre: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        usuario: string
        rol: string
        nombre: string
    }
}