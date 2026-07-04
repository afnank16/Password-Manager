import { openDB } from "idb";

const DB_NAME = "VaultDB";
const STORE_NAME = "entries";
const META_STORE = "meta";
const DB_VERSION = 2;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    },
  });
}

export async function getMeta(key) {
  const db = await getDB();
  return db.get(META_STORE, key);
}

export async function setMeta(key, value) {
  const db = await getDB();
  return db.put(META_STORE, value, key);
}

export async function saveEntry(entry) {
  const db = await getDB();
  return db.add(STORE_NAME, entry);
}

export async function getAllEntries() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function deleteEntry(id) {
  const db = await getDB();
  return db.delete(STORE_NAME, id);
}

export async function updateEntry(id, data) {
  const db = await getDB();
  return db.put(STORE_NAME, { ...data, id });
}