import { useState, useEffect } from "react";
import { getMeta } from "./db/db";
import MasterPasswordSetup from "./components/MasterPasswordSetup";
import LockScreen from "./components/LockScreen";
import VaultList from "./components/VaultList";

function App() {
  const [appState, setAppState] = useState(null);
  const [vaultKey, setVaultKey] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function checkSetup() {
      const salt = await getMeta("salt");
      setAppState(salt ? "locked" : "fresh");
    }
    checkSetup();
  }, []);

  function handleSetup(key) {
    setVaultKey(key);
    setAppState("unlocked");
  }

  function handleUnlock(key, loadedEntries) {
    setVaultKey(key);
    setEntries(loadedEntries);
    setAppState("unlocked");
  }

  if (appState === null) return <div className="text-white">Loading...</div>;
  if (appState === "fresh") return <MasterPasswordSetup onSetup={handleSetup} />;
  if (appState === "locked") return <LockScreen onUnlock={handleUnlock} />;
  if (appState === "unlocked") return <VaultList vaultKey={vaultKey} entries={entries} setEntries={setEntries} />;
}

export default App;