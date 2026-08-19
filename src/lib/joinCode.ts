import { customAlphabet } from "nanoid";

// Sin caracteres ambiguos (0/O, 1/I) para que sea fácil de leer en pantalla y teclear en el celular.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const generateJoinCode = customAlphabet(ALPHABET, 4);
