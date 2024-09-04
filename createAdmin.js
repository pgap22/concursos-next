const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12; // Number of salt rounds for bcrypt

async function hashPassword(password) {
    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
}

const prisma = new PrismaClient();

const AdminUser = "admin";
const AdminPassword = "admin";

async function main() {
    try {
        const isAdmin = await prisma.usuario.findFirst({
            where: {
                rol: 'admin'
            }
        });

        if (isAdmin) {
            console.log("Admin already exists");
            return;
        }

        const password = await hashPassword(AdminPassword);

        await prisma.usuario.create({
            data: {
                nombre: "Admin",
                usuario: AdminUser,
                password: password,
                rol: 'admin'
            }
        });

        console.log("Admin created");
    } catch (error) {
        console.error(`Error creating admin: ${error.message}`);
    } finally {
        await prisma.$disconnect(); // Ensure Prisma client disconnects
    }
}

main();
