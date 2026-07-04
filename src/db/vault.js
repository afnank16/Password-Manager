import { encryptData, decryptData } from "../crypto/crypto";
import { deriveKeyFromPassword, generateSalt } from "../crypto/crypto";
import { saveEntry, getAllEntries, deleteEntry, updateEntry, getMeta, setMeta } from "./db";

function saltKey(vaultId) { return `vault:${vaultId}:salt`; }
function verifyKey(vaultId) { return `vault:${vaultId}:verify`; }

export async function getOrCreateSalt(vaultId) {
  let salt = await getMeta(saltKey(vaultId));
  if (!salt) {
    salt = generateSalt();
    await setMeta(saltKey(vaultId), salt);
  }
  return salt;
}

export async function deriveKey(vaultId, password) {
  const salt = await getOrCreateSalt(vaultId);
  return deriveKeyFromPassword(password, salt);
}

export async function saveVerifyToken(vaultId, key) {
  const { ciphertext, iv } = await encryptData("vault-ok", key);
  await setMeta(verifyKey(vaultId), { ciphertext, iv });
}

export async function verifyPassword(vaultId, key) {
  const token = await getMeta(verifyKey(vaultId));
  if (!token) return true;
  try {
    const result = await decryptData(token.ciphertext, token.iv, key);
    return result === "vault-ok";
  } catch {
    return false;
  }
}

export async function addPasswordEntry(vaultId, plainEntry, key) {
  const { ciphertext, iv } = await encryptData(plainEntry, key);
  return saveEntry(vaultId, { ciphertext, iv });
}

export async function loadAllEntries(vaultId, key) {
  const entries = await getAllEntries(vaultId);
  return Promise.all(
    entries.map(async (entry) => {
      const data = await decryptData(entry.ciphertext, entry.iv, key);
      return { id: entry.id, ...data };
    })
  );
}

export async function editPasswordEntry(id, vaultId, plainEntry, key) {
  const { ciphertext, iv } = await encryptData(plainEntry, key);
  await updateEntry(id, vaultId, { ciphertext, iv });
}

export async function removeEntry(id) {
  return deleteEntry(id);
}