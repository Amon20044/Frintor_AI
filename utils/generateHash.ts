'use server'
import * as argon2 from "argon2";

export const genHash = async (password : string) => argon2.hash(password);
