import { useState } from "react";
import { deriveKey, verifyPassword, loadAllEntries } from "../db/vault";

function LockScreen({ vaults, onUnlock, onCreateNew }) {
  const [selectedVaultId, setSelectedVaultId] = useState(vaults[0]?.id || null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    setLoading(true); setError("");
    try {
      const key = await deriveKey(selectedVaultId, password);
      const valid = await verifyPassword(selectedVaultId, key);
      if (!valid) { setError("Wrong password"); setLoading(false); return; }
      const entries = await loadAllEntries(selectedVaultId, key);
      onUnlock(key, selectedVaultId, entries);
    } catch { setError("Wrong password"); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#BFE5F2] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-sm border border-gray-200/60">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">Select your vault and enter your master password.</p>
        </div>

        <div className="flex flex-col gap-3">
          <select value={selectedVaultId} onChange={e => setSelectedVaultId(Number(e.target.value))}
            className="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {vaults.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          <input type="password" placeholder="Master password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleUnlock()}
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100 font-medium">{error}</div>}

          <button onClick={handleUnlock} disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-blue-100">
            {loading ? "Unlocking..." : "Unlock"}
          </button>
<p className="text-center text-sm text-gray-400">Don't have a vault? <span onClick={onCreateNew} className="text-blue-500 cursor-pointer hover:underline">Create one</span></p>
        </div>
      </div>
    </div>
  );
}

export default LockScreen;