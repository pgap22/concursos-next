const { PrismaClient } = require("@prisma/client");
const { randomBytes, pbkdf2 } = require('crypto');

async function hashPassword(password: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const saltLength: number = 16; // Length of salt for hashing
        const iterations: number = 100000; // Number of iterations for PBKDF2
        const keyLength: number = 32; // Length of output hash

        // Generate a salt
        //@ts-ignore
        randomBytes(saltLength, (err, salt) => {
            if (err) {
                reject(err);
                return;
            }

            // Hash the password with PBKDF2
            //@ts-ignore
            pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    // Combine salt and hashed password
                    const hashedPassword: string = `${iterations}:${salt.toString('hex')}:${derivedKey.toString('hex')}`;
                    resolve(hashedPassword);
                }
            });
        });
    });
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        // Parse stored hash to extract parameters
        const [storedIterations, storedSalt, storedDerivedKey] = storedHash.split(':');
        const iterations: number = parseInt(storedIterations);
        const salt: Buffer = Buffer.from(storedSalt, 'hex');
        const keyLength: number = storedDerivedKey.length / 2; // Length in bytes

        // Hash the password with the same parameters
        //@ts-ignore
        pbkdf2(password, salt, iterations, keyLength, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                // Generate hash from derived key
                const generatedHash: string = derivedKey.toString('hex');
                // Compare generated hash with stored derived key
                if (generatedHash === storedDerivedKey) {
                    resolve(true); // Passwords match
                } else {
                    resolve(false); // Passwords do not match
                }
            }
        });
    });
}

const prisma = new PrismaClient();

const AdminUser = "admin";
const AdminPassword = "admin";

(async () => {
    const isAdmin = await prisma.usuario.findFirst({
        where: {
            rol: 'admin'
        }
    });

    if (isAdmin) {
        console.log("Admin ya existe");
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

    console.log("Admin Creado");
})();
