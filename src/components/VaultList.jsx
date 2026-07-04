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
    <div className="min-h-screen bg-gray-50 text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <header className=" rounded-xl w-full bg-white p-4 shadow-sm flex items-center justify-center">
          <h1 className="text-3xl font-bold my-2 text-slate-900 text-center">My Vault</h1>
        </header>


        {/* Add Entry Form */}
        <div className="bg-white p-6 rounded-2xl flex flex-col gap-3 shadow-sm border border-gray-200/60">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Entry</h2>
          <input
            type="text"
            placeholder="Site (e.g. github.com)"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

          {entries.map((entry) => (
            <div key={entry.id} className="bg-white p-5 rounded-2xl flex flex-col gap-2 shadow-sm border border-gray-200/60">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-400">URL : {entry.site}</span>
                <div className="flex gap-6">
                  <button className="text-blue-600 hover:text-blue-800 text-sm transition hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-600 text-sm transition hover:underline"
                  >
                    Delete
                  </button>
                </div>

              </div>
              <p className="text-gray-900 text-sm">Username : {entry.username}</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-900 text-sm font-mono">
                  Password : {visibleIds.includes(entry.id) ? entry.password : "••••••••"}
                </p>
                <button
                  onClick={() => toggleVisibility(entry.id)}
                  className="text-xs text-gray-700 hover:text-gray-300 transition"
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