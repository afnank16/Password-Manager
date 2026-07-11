// Derive a cryptographic key from a password and salt using PBKDF2
export async function deriveKeyFromPassword(password, salt) {
  const encoder = new TextEncoder(); // Converts strings to Uint8Array

  // Import the raw password as key material for PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",                        // Raw binary data
    encoder.encode(password),      // Encode password into bytes
    "PBKDF2",                      // Algorithm to use
    false,                         // Key is not extractable
    ["deriveKey"]                  // Allowed operation
  );

  // Derive an AES-GCM key from the password + salt
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",              // Algorithm
      salt: salt,                  // Salt value (Uint8Array)
      iterations: 250000,          // Number of iterations (high for security)
      hash: "SHA-256",             // Hash function
    },
    keyMaterial,                   // Base key material
    { name: "AES-GCM", length: 256 }, // Output key type and size
    false,                         // Key is not extractable
    ["encrypt", "decrypt"]         // Allowed operations
  );

  return key; // Return the derived AES-GCM key
}

// Generate a random salt (16 bytes)
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Encrypt data using AES-GCM
export async function encryptData(data, key) {
  const encoder = new TextEncoder(); // For encoding strings
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV (12 bytes for AES-GCM)

  // Encrypt the JSON-encoded data
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },   // Algorithm + IV
    key,                           // Derived key
    encoder.encode(JSON.stringify(data)) // Encode data as JSON string
  );

  // Return ciphertext and IV (needed for decryption)
  return { ciphertext, iv };
}

// Decrypt data using AES-GCM
export async function decryptData(ciphertext, iv, key) {
  // Perform decryption
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },   // Algorithm + IV
    key,                           // Key used for encryption
    ciphertext                      // Encrypted data
  );

  const decoder = new TextDecoder(); // For decoding bytes back to string
  return JSON.parse(decoder.decode(decrypted)); // Parse JSON back to object/string
}
