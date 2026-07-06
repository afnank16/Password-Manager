import { useState, useEffect } from "react";
import { getAllVaults } from "./db/db";
import MasterPasswordSetup from "./components/MasterPasswordSetup";
import LockScreen from "./components/LockScreen";
import VaultList from "./components/VaultList";

function App() {
  const [appState, setAppState] = useState(null);
  const [vaultKey, setVaultKey] = useState(null);
  const [vaultId, setVaultId] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {// Check if vaults exist in the database
    async function checkSetup() {
      const allVaults = await getAllVaults();
      setVaults(allVaults);
      setAppState(allVaults.length > 0 ? "locked" : "fresh");
    }
    checkSetup();
  }, []);

  function handleSetup(key, vaultId) {
    setVaultKey(key);
    setVaultId(vaultId);
    setAppState("unlocked");
  }

  function handleUnlock(key, vaultId, loadedEntries) {
    setVaultKey(key);
    setVaultId(vaultId);
    setEntries(loadedEntries);
    setAppState("unlocked");
  }

  if (appState === null) return <div className="text-white">Loading...</div>;
  if (appState === "fresh") return <MasterPasswordSetup onSetup={handleSetup} />;
  if (appState === "locked") return <LockScreen vaults={vaults} onUnlock={handleUnlock} onCreateNew={() => setAppState("fresh")} />;
  if (appState === "unlocked") return <VaultList vaultKey={vaultKey} vaultId={vaultId} entries={entries} setEntries={setEntries} />;
}

export default App;