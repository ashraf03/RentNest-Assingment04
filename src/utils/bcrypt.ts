import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash Password
 */
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare Password
 */
const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const BcryptUtils = {
  hashPassword,
  comparePassword,
};