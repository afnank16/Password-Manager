import { useState } from "react";
import { addPasswordEntry, removeEntry, loadAllEntries, editPasswordEntry } from "../db/vault";
import { saveEntry, getAllEntries, deleteEntry, getMeta, setMeta, updateEntry } from "../db/db";


function VaultList({ vaultKey, entries, setEntries, vaultId, vaultName }) {
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ site: "", username: "", password: "" });
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibleIds, setVisibleIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const filtered = entries.filter(e => e.site.toLowerCase().includes(search.toLowerCase()));

async function handleAdd() {
  if (!site || !username || !password) return;
  setLoading(true);
  await addPasswordEntry(vaultId, { site, username, password }, vaultKey);
  const updated = await loadAllEntries(vaultId, vaultKey);
  console.log("updated entries:", updated);
  setEntries(updated);
  setSite(""); setUsername(""); setPassword("");
  setLoading(false); setShowForm(false);
}

async function handleDelete(id) {
  await removeEntry(id);
  const updated = await loadAllEntries(vaultId, vaultKey);
  setEntries(updated);
}

async function handleEdit() {
  await editPasswordEntry(editingId, vaultId, editFields, vaultKey);
  const updated = await loadAllEntries(vaultId, vaultKey);
  setEntries(updated);
  setEditingId(null);
}
  function copyPassword(id, pwd) {
    navigator.clipboard.writeText(pwd);
    setCopied(id);
    setTimeout(() => setCopied(null), 1000);
  }

  function toggleVisibility(id) {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditFields({ site: entry.site, username: entry.username, password: entry.password });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-white p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <header className=" rounded-xl w-full bg-white p-4 shadow-sm flex items-center justify-center">
          <h1 className="text-3xl font-bold my-2 text-slate-900 text-center">{vaultName}</h1>
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
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button onClick={() => setShowNewPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer bg-transparent border-none">
              {showNewPassword ? "hide" : "show"}
            </button>
          </div>
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

          {filtered.map(entry => (
            <div
              key={entry.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-gray-200 transition"
            >
              {editingId === entry.id ? (
                /* EDIT MODE UI */
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      value={editFields.site}
                      onChange={e => setEditFields(p => ({ ...p, site: e.target.value }))}
                      placeholder="Site"
                    />
                    <input
                      className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      value={editFields.username}
                      onChange={e => setEditFields(p => ({ ...p, username: e.target.value }))}
                      placeholder="Username"
                    />
                    <div className="relative">
                      <input
                        type={showEditPassword ? "text" : "password"}
                        className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        value={editFields.password}
                        onChange={e => setEditFields(p => ({ ...p, password: e.target.value }))}
                        placeholder="Password"
                      />
                      <button onClick={() => setShowEditPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer bg-transparent border-none">
                        {showEditPassword ? "hide" : "show"}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:self-end">
                    <button
                      onClick={handleEdit}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition shadow-sm shadow-blue-100"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 font-medium px-4 py-2 rounded-xl text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* DISPLAY MODE UI */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <p className="font-bold text-gray-900">{entry.site}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-400">👤</span> {entry.username}
                      </span>

                      <span className="flex items-center gap-2">
                        <span className="text-gray-400">🔑</span>
                        <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-700 text-xs tracking-wider">
                          {visibleIds.includes(entry.id) ? entry.password : "••••••••••"}
                        </span>

                        <div className="flex items-center gap-3 ml-1 border-l border-gray-200 pl-3">
                          <button
                            onClick={() => toggleVisibility(entry.id)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                          >
                            {visibleIds.includes(entry.id) ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => copyPassword(entry.id, entry.password)}
                            className={`text-xs font-semibold transition ${copied === entry.id ? "text-green-600" : "text-gray-400 hover:text-gray-600"}`}
                          >
                            {copied === entry.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* Action Controls (Edit / Delete) */}
                  <div className="flex items-center justify-end gap-2 border-t sm:border-none pt-3 sm:pt-0 border-gray-50">
                    <button
                      onClick={() => startEdit(entry)}
                      className="text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default VaultList;