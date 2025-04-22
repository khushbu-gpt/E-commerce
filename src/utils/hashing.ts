import argon2 from "argon2";
import AppError from "./AppError";

async function hashPassword(text: string) {
  if (!text) throw new AppError("PASSWORD IS REQUIRED FOR HASHING!");

  return await argon2.hash(text);
}
async function verifyPassword(password: string, hashedPassword: string) {
  if (!password || !hashedPassword)
    throw new AppError("PASSWORD and hashedPassword IS REQUIRED FOR HASHING!");

  return await argon2.verify(hashedPassword, password);
}

export { hashPassword, verifyPassword };
