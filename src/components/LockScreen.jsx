import { useState } from "react";
import { deriveKey, loadAllEntries, verifyKey } from "../db/vault";

function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    setLoading(true); setError("");
    try {
      const key = await deriveKey(password);
      const valid = await verifyKey(key);
      if (!valid) { setError("Wrong password"); setLoading(false); return; }
      const entries = await loadAllEntries(key);
      onUnlock(key, entries);
    } catch { setError("Wrong password"); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#BFE5F2] to-blue-50/30 flex items-center justify-center p-4">
  <div className="bg-white p-8 rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-sm border border-gray-200/60 backdrop-blur-sm">
    
    <div>
      <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Unlock Vault</h1>
      <p className="text-gray-500 text-sm mt-1 leading-relaxed">
        Enter your master password to access your vault.
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <input
        type="password"
        placeholder="Master password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
        className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>

    {error && (
      <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100 font-medium">
        {error}
      </div>
    )}

    <button
      onClick={handleUnlock}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-blue-100"
    >
      {loading ? "Unlocking..." : "Unlock"}
    </button>
    
  </div>
</div>
  );
}

export default LockScreen;