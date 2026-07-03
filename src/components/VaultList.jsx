import { useState } from "react";
import { addPasswordEntry, removeEntry, loadAllEntries } from "../db/vault";

function VaultList({ vaultKey, entries, setEntries }) {
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibleIds, setVisibleIds] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!site || !username || !password) return;
    setLoading(true);
    await addPasswordEntry({ site, username, password }, vaultKey);
    const updated = await loadAllEntries(vaultKey);
    setEntries(updated);
    setSite("");
    setUsername("");
    setPassword("");
    setLoading(false);
  }

  async function handleDelete(id) {
    await removeEntry(id);
    const updated = await loadAllEntries(vaultKey);
    setEntries(updated);
  }

  function toggleVisibility(id) {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <h1 className="text-2xl font-bold">My Vault</h1>

        {/* Add Entry Form */}
        <div className="bg-gray-900 p-6 rounded-2xl flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-300">Add New Entry</h2>
          <input
            type="text"
            placeholder="Site (e.g. github.com)"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-800 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Saving..." : "Add Entry"}
          </button>
        </div>

        {/* Entries List */}
        <div className="flex flex-col gap-3">
          {entries.length === 0 && (
            <p className="text-gray-500 text-sm">No entries yet. Add one above.</p>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className="bg-gray-900 p-5 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">{entry.site}</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-400 hover:text-red-300 text-sm transition"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-400 text-sm">👤 {entry.username}</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-sm font-mono">
                  {visibleIds.includes(entry.id) ? entry.password : "••••••••"}
                </p>
                <button
                  onClick={() => toggleVisibility(entry.id)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                >
                  {visibleIds.includes(entry.id) ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default VaultList;