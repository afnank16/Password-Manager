import { useState } from "react";
import { addPasswordEntry, removeEntry, loadAllEntries, editPasswordEntry } from "../db/vault";
import { saveEntry, getAllEntries, deleteEntry, getMeta, setMeta, updateEntry } from "../db/db";
import { Shield, Key, User, Globe, Eye, EyeOff, Copy, Check, Edit2, Trash2, Plus, Terminal, Search } from "lucide-react";


function VaultList({ vaultKey, entries, setEntries, vaultId, vaultName }) {
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({ site: "", username: "", password: "" });
  const [site, setSite] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visibleIds, setVisibleIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = entries.filter(entry =>
    entry.site?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen bg-[#d2d8eb] bg-gray-100 text-slate-800 antialiased selection:bg-blue-100 overflow-x-hidden">
      {/* Subtle Engineering Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10">

        {/* --- DESKTOP APPLICATION CONTROLS BAR --- */}
        <header className="mb-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[12px] font-black  tracking-[0.2em] text-blue-600">VaultX</span>
              <h1 className="text-xl font-black tracking-tight text-slate-900">{vaultName || "Personal Vault"}</h1>
            </div>
          </div>

          {/* Action Header Stats */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1.5 text-xs">
            <span className="px-2 py-1 text-blue-600 font-bold">{filtered?.length || 0} ITEMS</span>
          </div>
        </header>

        {/* --- MAIN DESKTOP GRID --- */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: CONTROL PANEL & FORM (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-4 h-4 text-blue-600" />
                <h2 className="text-xs font-black  tracking-widest text-slate-400">Add New Credentials</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold  tracking-widest text-slate-400 block ml-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="github.com"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold  tracking-widest text-slate-400 block ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="username / email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold  tracking-widest text-slate-400 block ml-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-300 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all tracking-wide"
                    />
                    <button
                      onClick={() => setShowNewPassword(p => !p)}
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition rounded-md"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white font-bold text-sm py-3.5 rounded-xl transition-all active:scale-[0.99] shadow-md shadow-blue-200 disabled:opacity-50"
                >
                  {loading ? "Encrypting Asset..." : "Add Credential"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE DATA MATRIX (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">

            {/* Embedded Sub-Navbar search utility */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="pl-3 text-slate-400"><Search className="w-4 h-4" /></div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Filter entries by host or identifier..."
                className="w-full bg-transparent border-none outline-none text-xs text-slate-700 font-medium placeholder:text-slate-400 focus:ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-500 px-2 py-1 rounded-md font-bold transition mr-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">

              {filtered && filtered.map(entry => (
                <div
                  key={entry.id}
                  className={`border transition-all duration-200 rounded-2xl p-4 ${editingId === entry.id
                    ? "bg-white border-blue-400 shadow-md ring-4 ring-blue-500/10"
                    : "bg-white border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50/20"
                    }`}
                >
                  {editingId === entry.id ? (
                    /* --- INLINE EDIT MODE --- */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <input
                            className="w-full bg-transparent border-none text-xs font-bold text-slate-900 outline-none focus:ring-0 p-0"
                            value={editFields.site}
                            onChange={e => setEditFields(p => ({ ...p, site: e.target.value }))}
                            placeholder="Site Host"
                          />
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <input
                            className="w-full bg-transparent border-none text-xs font-bold text-slate-900 outline-none focus:ring-0 p-0"
                            value={editFields.username}
                            onChange={e => setEditFields(p => ({ ...p, username: e.target.value }))}
                            placeholder="Identifier"
                          />
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 w-full">
                            <Key className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <input
                              type={showEditPassword ? "text" : "password"}
                              className="w-full bg-transparent border-none text-xs text-blue-600 outline-none focus:ring-0 p-0 tracking-wide"
                              value={editFields.password}
                              onChange={e => setEditFields(p => ({ ...p, password: e.target.value }))}
                              placeholder="Secret Cipher"
                            />
                          </div>
                          <button
                            onClick={() => setShowEditPassword(p => !p)}
                            type="button"
                            className="text-blue-300 hover:text-blue-600 transition"
                          >
                            {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEdit}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-sm shadow-blue-200"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* --- VIEW MODE --- */
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shrink-0 text-white font-black text-sm shadow-sm shadow-blue-200">
                          {entry.site ? entry.site.substring(0, 2) : "••"}
                        </div>

                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-sm truncate tracking-tight">{entry.site}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1 max-w-[150px] truncate">
                              <span className="text-slate-400">usr:</span> {entry.username}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-2">
                              <span className="text-slate-400">pwd:</span>
                              <span className={`px-2 py-0.5 rounded text-xs tracking-wider ${visibleIds.includes(entry.id) ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-slate-100 text-slate-400"}`}>
                                {visibleIds.includes(entry.id) ? entry.password : "••••••••••••"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 border-t md:border-none border-slate-100 pt-2 md:pt-0">
                        <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-xl p-1">
                          <button
                            onClick={() => toggleVisibility(entry.id)}
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-white rounded-lg transition shadow-none hover:shadow-sm"
                            title={visibleIds.includes(entry.id) ? "Hide Password" : "Reveal Password"}
                          >
                            {visibleIds.includes(entry.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          <div className="w-[1px] h-4 bg-slate-200 my-auto" />

                          <button
                            onClick={() => copyPassword(entry.id, entry.password)}
                            className={`p-2 transition rounded-lg ${copied === entry.id ? "text-emerald-600 bg-emerald-50" : "text-slate-400 hover:text-blue-600 hover:bg-white"}`}
                            title="Copy Password"
                          >
                            {copied === entry.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEdit(entry)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-500 hover:text-blue-700 border border-blue-100 rounded-xl transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 bg-red-50 hover:bg-rose-50 text-red-400 hover:text-rose-600  border border-slate-200/60 rounded-xl transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              ))}

              {(!filtered || filtered.length === 0) && (
                <div className="text-center py-12 bg-white border border-dashed border-blue-100 rounded-2xl">
                  <Terminal className="w-8 h-8 text-blue-200 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">No indexed vectors found in database segment.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default VaultList;