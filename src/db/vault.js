import { encryptData, decryptData } from "../crypto/crypto";
import { saveEntry, getAllEntries, deleteEntry, getMeta, setMeta } from "./db";
import { deriveKeyFromPassword, generateSalt } from "../crypto/crypto";

export async function getOrCreateSalt() {
  let salt = await getMeta("salt");
  if (!salt) {
    salt = generateSalt();
    await setMeta("salt", salt);
  }
  return salt;
}

export async function deriveKey(password) {
  const salt = await getOrCreateSalt();
  return deriveKeyFromPassword(password, salt);
}

export async function addPasswordEntry(plainEntry, key) {
  const { ciphertext, iv } = await encryptData(plainEntry, key);
  const id = await saveEntry({ ciphertext, iv });
  return id;
}

export async function loadAllEntries(key) {
  const entries = await getAllEntries();

  const decrypted = await Promise.all(
    entries.map(async (entry) => {
      const data = await decryptData(entry.ciphertext, entry.iv, key);
      return { id: entry.id, ...data };
    })
  );

  return decrypted;
}

export async function removeEntry(id) {
  return deleteEntry(id);
}