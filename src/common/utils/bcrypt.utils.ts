import bycrypt from "bcrypt";
/**
 *
 * @param password from body
 * @returns hashed password
 */
export async function hash(password: string) {
  return bycrypt.hash(password, 10);
}

/**
 *
 * @param password from body
 * @param hashedPassword from DB
 * @returns promise of boolen
 */
export async function compare(password: string, hashedPassword: string) {
  // from body , from DB
  return bycrypt.compare(password, hashedPassword);
}
