// Import the openDB function from the 'idb' library, which simplifies IndexedDB usage
import { openDB } from "idb";

// Define constants for the database name and version
const DB_NAME = "VaultDB";
const DB_VERSION = 3;

// Function to open (or create) the database
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    // The upgrade callback runs when the DB is created or its version changes
    upgrade(db) {
      // Create 'vaults' store if it doesn't exist
      if (!db.objectStoreNames.contains("vaults")) {
        db.createObjectStore("vaults", { keyPath: "id", autoIncrement: true });
      }
      // Create 'entries' store if it doesn't exist
      if (!db.objectStoreNames.contains("entries")) {
        const store = db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
        // Add an index on 'vaultId' so we can query entries by vault
        store.createIndex("vaultId", "vaultId");
      }
      // Create 'meta' store if it doesn't exist (for miscellaneous metadata)
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });
}

// ---------------- Vaults ----------------

// Create a new vault with a given name
export async function createVault(name) {
  const db = await getDB();
  return db.add("vaults", { name });
}

// Get all vaults from the database
export async function getAllVaults() {
  const db = await getDB();
  return db.getAll("vaults");
}

// ---------------- Entries ----------------

// Save a new entry inside a specific vault
export async function saveEntry(vaultId, entry) {
  const db = await getDB();
  return db.add("entries", { ...entry, vaultId });
}

// Get all entries belonging to a specific vault
export async function getAllEntries(vaultId) {
  const db = await getDB();
  console.log("querying vaultId:", vaultId);
  // Debug: log all raw entries before filtering
  const all = await db.getAll("entries");
  console.log("all raw entries:", all);
  // Query entries by vaultId using the index
  return db.getAllFromIndex("entries", "vaultId", vaultId);
}

// Update an existing entry by id and vaultId
export async function updateEntry(id, vaultId, data) {
  const db = await getDB();
  return db.put("entries", { ...data, id, vaultId });
}

// Delete an entry by id
export async function deleteEntry(id) {
  const db = await getDB();
  return db.delete("entries", id);
}

// ---------------- Meta ----------------

// Get a metadata value by key
export async function getMeta(key) {
  const db = await getDB();
  return db.get("meta", key);
}

// Set a metadata value by key
export async function setMeta(key, value) {
  const db = await getDB();
  return db.put("meta", value, key);
}

// ---------------- Utility ----------------

// Find a vault by its name (case-insensitive)
export async function getVaultByName(name) {
  const db = await getDB();
  const all = await db.getAll("vaults");
  return all.find(v => v.name.toLowerCase() === name.toLowerCase());
}
