import { useState } from "react";
import { deriveKey } from "../db/vault";
import { loadAllEntries } from "../db/vault";

function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    setLoading(true);
    setError("");
    try {
      const key = await deriveKey(password);
      const entries = await loadAllEntries(key);
      onUnlock(key, entries);
    } catch {
      setError("Wrong password");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md flex flex-col gap-4">
        <h1 className="text-white text-2xl font-bold">Unlock Vault</h1>
        <p className="text-gray-400 text-sm">Enter your master password to access your vault.</p>

        <input
          type="password"
          placeholder="Master password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          className="bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleUnlock}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Unlocking..." : "Unlock"}
        </button>
      </div>
    </div>
  );
}

export default LockScreen;