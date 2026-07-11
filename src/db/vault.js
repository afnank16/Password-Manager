// Import crypto helpers for encryption/decryption
import { encryptData, decryptData } from "../crypto/crypto";
// Import key derivation and salt generation functions
import { deriveKeyFromPassword, generateSalt } from "../crypto/crypto";
// Import database helpers for entries and metadata
import { saveEntry, getAllEntries, deleteEntry, updateEntry, getMeta, setMeta } from "./db";

// Utility: generate a metadata key for storing salt for a vault
function saltKey(vaultId) { return `vault:${vaultId}:salt`; }
// Utility: generate a metadata key for storing verification token for a vault
function verifyKey(vaultId) { return `vault:${vaultId}:verify`; }

// Get or create a salt for a vault
export async function getOrCreateSalt(vaultId) {
  // Try to fetch existing salt from meta store
  let salt = await getMeta(saltKey(vaultId));
  // If no salt exists, generate one and save it
  if (!salt) {
    salt = generateSalt();
    await setMeta(saltKey(vaultId), salt);
  }
  // Return the salt (existing or newly created)
  return salt;
}

// Derive a cryptographic key from a password and vault-specific salt
export async function deriveKey(vaultId, password) {
  const salt = await getOrCreateSalt(vaultId);
  return deriveKeyFromPassword(password, salt);
}

// Save a verification token ("vault-ok") encrypted with the key
export async function saveVerifyToken(vaultId, key) {
  const { ciphertext, iv } = await encryptData("vault-ok", key);
  await setMeta(verifyKey(vaultId), { ciphertext, iv });
}

// Verify that a provided key can decrypt the stored verification token
export async function verifyPassword(vaultId, key) {
  const token = await getMeta(verifyKey(vaultId));
  // If no token exists, treat as valid
  if (!token) return true;
  try {
    // Attempt to decrypt the token
    const result = await decryptData(token.ciphertext, token.iv, key);
    // Check if it matches the expected string
    return result === "vault-ok";
  } catch {
    // If decryption fails, password is invalid
    return false;
  }
}

// Add a new password entry to a vault, encrypting the data
export async function addPasswordEntry(vaultId, plainEntry, key) {
  const { ciphertext, iv } = await encryptData(plainEntry, key);
  return saveEntry(vaultId, { ciphertext, iv });
}

// Load and decrypt all entries for a vault
export async function loadAllEntries(vaultId, key) {
  const entries = await getAllEntries(vaultId);
  return Promise.all(
    entries.map(async (entry) => {
      // Decrypt each entry
      const data = await decryptData(entry.ciphertext, entry.iv, key);
      // Return with original id plus decrypted data
      return { id: entry.id, ...data };
    })
  );
}

// Edit an existing password entry by re-encrypting new data
export async function editPasswordEntry(id, vaultId, plainEntry, key) {
  const { ciphertext, iv } = await encryptData(plainEntry, key);
  await updateEntry(id, vaultId, { ciphertext, iv });
}

// Remove an entry by id
export async function removeEntry(id) {
  return deleteEntry(id);
}
