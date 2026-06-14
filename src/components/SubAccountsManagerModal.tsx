/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Plus, Trash2, Key, Users, AlertCircle } from "lucide-react";

interface SubAccount {
  username: string;
  password?: string; // stored credentials
}

interface SubAccountsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subAccounts: SubAccount[];
  onAddSubAccount: (username: string, password?: string) => void;
  onRemoveSubAccount: (username: string) => void;
}

export default function SubAccountsManagerModal({
  isOpen,
  onClose,
  subAccounts,
  onAddSubAccount,
  onRemoveSubAccount
}: SubAccountsManagerModalProps) {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const u = newUsername.trim().toLowerCase();
    const p = newPassword.trim();

    if (!u) {
      setErrorMsg("Please enter a username.");
      return;
    }

    if (u.includes(" ")) {
      setErrorMsg("Username cannot contain spaces.");
      return;
    }

    if (u === "admin") {
      setErrorMsg("The word 'admin' is reserved for the primary administrator account.");
      return;
    }

    if (subAccounts.some(acc => acc.username.toLowerCase() === u)) {
      setErrorMsg("Sub account username already exists.");
      return;
    }

    if (!p) {
      setErrorMsg("Please enter a password.");
      return;
    }

    if (p.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    onAddSubAccount(u, p);
    setNewUsername("");
    setNewPassword("");
  };

  return (
    <div id="sub-accounts-manager-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div id="sub-accounts-manager-container" className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeIn flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-navy px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div>
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <span>🔑</span>
              <span>Manage Sub Accounts</span>
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              Only admin can create and manage floor staff sub accounts.
            </p>
          </div>
          <button
            id="sub-accounts-close-header-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/95 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col space-y-4 overflow-y-auto">
          
          {/* Quick Input Form for Account Registration */}
          <form onSubmit={handleSubmit} className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl shrink-0" id="sub-account-create-form">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#bf8f30]" />
              <span>Create Floor Staff Account</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider" htmlFor="new-sub-username">
                  Username
                </label>
                <input
                  id="new-sub-username"
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. jodie"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider" htmlFor="new-sub-password">
                  Password
                </label>
                <input
                  id="new-sub-password"
                  type="text" // text so Admin can easily write up temporary pass
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            {errorMsg && (
              <div id="sub-account-error-msg" className="text-[11px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="sub-account-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-gold hover:bg-gold-light text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sub Account</span>
            </button>
          </form>

          {/* List items scrollable container */}
          <div className="flex-grow flex flex-col space-y-2">
            <h4 className="text-xs font-bold text-[#8a9ab5] uppercase tracking-wider px-1">
              Active Sub Accounts ({subAccounts.length})
            </h4>

            <div className="overflow-y-auto border border-slate-100 rounded-2xl divide-y divide-slate-150 bg-slate-50/50 flex-1 max-h-[220px]">
              {subAccounts.length > 0 ? (
                subAccounts.map((acc, i) => (
                  <div
                    key={acc.username}
                    id={`custom-sub-account-${acc.username}`}
                    className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-navy flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        👤 {acc.username}
                      </span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5 ml-3">
                        Password: {acc.password}
                      </span>
                    </div>
                    <button
                      id={`remove-sub-account-${acc.username}`}
                      onClick={() => onRemoveSubAccount(acc.username)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
                      title={`Delete sub account ${acc.username}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
                  No custom sub accounts created yet.
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end text-xs shrink-0">
          <button
            id="sub-accounts-close-footer-btn"
            onClick={onClose}
            className="px-5 py-2 bg-navy hover:bg-navy-mid text-white font-bold rounded-lg transition cursor-pointer"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
