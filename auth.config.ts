import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { getUsuarioByUsuario } from "./lib/usuario"
import { verifyPassword } from "./lib/password"

export default {
    providers: [
        Credentials({
            credentials: {
                usuario: {},
                password: {}
            },
            authorize: async (credentials) => {
                const { usuario, password } = credentials
                if (!usuario || !password) return null
                if (typeof usuario !== 'string' || typeof password !== 'string') return null

                const usuarioEncontrado = await getUsuarioByUsuario(usuario);
                if (!usuarioEncontrado) {
                    throw new Error("Usuario o contraseña incorrecto")
                }

                const validarPassword = await verifyPassword(password, usuarioEncontrado.password)

                if (!validarPassword) {
                    throw new Error("Usuario o contraseña incorrecto")
                }

                if (validarPassword) return usuarioEncontrado

                return null
            }
        })
    ],
} satisfies NextAuthConfig