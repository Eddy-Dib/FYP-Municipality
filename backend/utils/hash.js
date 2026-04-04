import bcrypt from "bcrypt";

const ROUNDS = 5;

/**
 * Converts a plain text into a hashed password suitable for storage in the database.
 *
 * @param {string} plainPassword The plain text password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 *
 * @example
 * const hashed = await hashPassword("mySecret123");
 */
export const hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, ROUNDS);
};


/**
 * Compares a plain text password with a hashed password.
 *
 * @param {string} plainPassword The plain text password entered by the user.
 * @param {string} hashedPassword The previously hashed password stored in the database.
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise.
 *
 * @example
 * const isValid = await verifyPassword("mySecret123", hashedPasswordFromDB);
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};