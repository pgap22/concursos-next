import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "./auth.config"
import prisma from "./lib/prisma"
import { Adapter } from "next-auth/adapters"

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async jwt({token, user, session}){
            if (user) {
                token.id = user.id as string
                token.nombre = user.nombre
                token.usuario = user.usuario
                token.rol = user.rol
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.nombre = token.nombre
                session.user.usuario = token.usuario
                session.user.rol = token.rol
            }
            return session
        },
    },
    adapter: PrismaAdapter(prisma) as Adapter,
    ...authConfig,
    session: {strategy: 'jwt'},
    
})