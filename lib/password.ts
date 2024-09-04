import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Number of salt rounds for bcrypt

export async function hashPassword(password: string): Promise<string> {
    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error hashing password: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while hashing the password.');
        }
    }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error verifying password: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred while verifying the password.');
        }
    }
}
