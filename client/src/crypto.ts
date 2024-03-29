import pdkfd2 from "crypto-js/pbkdf2";
import { AES, SHA256, enc } from "crypto-js";

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

export function encryptVault({
  vaultKey,
  vault,
}: {
  vaultKey: string;
  vault: string;
}) {
  return AES.encrypt(vault, vaultKey).toString();
}

export function decryptVault({
  vaultKey,
  vault,
}: {
  vaultKey: string;
  vault: string;
}) {
  const bytes = AES.decrypt(vault, vaultKey);
  const decrypted = bytes.toString(enc.Utf8);

  try {
    return JSON.parse(decrypted).vault;
  } catch (err) {
    return null;
  }
}
