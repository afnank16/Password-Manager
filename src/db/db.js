import { openDB } from "idb";

const DB_NAME = "VaultDB";
const DB_VERSION = 3;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("vaults")) {
        db.createObjectStore("vaults", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("entries")) {
        const store = db.createObjectStore("entries", { keyPath: "id", autoIncrement: true });
        store.createIndex("vaultId", "vaultId");
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });
}

// Vaults
export async function createVault(name) {
  const db = await getDB();
  return db.add("vaults", { name });
}

export async function getAllVaults() {
  const db = await getDB();
  return db.getAll("vaults");
}

// Entries
export async function saveEntry(vaultId, entry) {
  const db = await getDB();
  return db.add("entries", { ...entry, vaultId });
}

export async function getAllEntries(vaultId) {
  const db = await getDB();
  console.log("querying vaultId:", vaultId);
  const all = await db.getAll("entries");
  console.log("all raw entries:", all);
  return db.getAllFromIndex("entries", "vaultId", vaultId);
}

export async function updateEntry(id, vaultId, data) {
  const db = await getDB();
  return db.put("entries", { ...data, id, vaultId });
}

export async function deleteEntry(id) {
  const db = await getDB();
  return db.delete("entries", id);
}

// Meta
export async function getMeta(key) {
  const db = await getDB();
  return db.get("meta", key);
}

export async function setMeta(key, value) {
  const db = await getDB();
  return db.put("meta", value, key);
}

export async function getVaultByName(name) {
  const db = await getDB();
  const all = await db.getAll("vaults");
  return all.find(v => v.name.toLowerCase() === name.toLowerCase());
}