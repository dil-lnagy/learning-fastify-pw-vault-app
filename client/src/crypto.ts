import pdkfd2 from "crypto-js/pbkdf2";
import { SHA256 } from "crypto-js";

export function hashPassword(password: string) {
  return SHA256(password).toString();
}

export function generateVaultKey({
  email,
  hashedPassword,
  salt,
}: {
  email: string;
  hashedPassword: string;
  salt: string;
}) {
  return pdkfd2(`${email}:${hashedPassword}`, salt, { keySize: 32 }).toString();
}
