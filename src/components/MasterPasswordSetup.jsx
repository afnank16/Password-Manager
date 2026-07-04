import { useState, useRef } from "react";
import { deriveKey, saveVerifyToken } from "../db/vault";

function MasterPasswordSetup({ onSetup }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const confirmInputRef = useRef(null);

  async function handleSetup() {// Validate password and confirm
  if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
  if (password !== confirm) { setError("Passwords do not match"); return; }
  setLoading(true);
  const key = await deriveKey(password);
  await saveVerifyToken(key);
  onSetup(key);
}

  const handleKeyDown = (e, nextRef) => { // Handle Enter key to move focus to the next input
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      nextRef?.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#BFE5F2] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md flex flex-col gap-5 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold tracking-tight">Create Master Password</h1>
          <p className="text-gray-500 text-sm mt-1 leading-relaxed">
            This password encrypts your vault. If you forget it, your data cannot be recovered.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            autoFocus
            type="password"
            placeholder="Master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, confirmInputRef)}
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <input
            ref={confirmInputRef}
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSetup();
              }
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-100 font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleSetup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition shadow-sm shadow-blue-100"
        >
          {loading ? "Setting up..." : "Create Vault"}
        </button>
      </div>
    </div>
  );
}

export default MasterPasswordSetup;