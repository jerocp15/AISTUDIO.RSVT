/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Lock, LogIn, Sparkles, CheckCircle2 } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (role: "Admin" | "Staff", username: string) => void;
  subAccounts?: Array<{ username: string; password?: string }>;
  isSyncing?: boolean;
}

export default function LoginScreen({ onLoginSuccess, subAccounts = [], isSyncing = false }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successRole, setSuccessRole] = useState<"Admin" | "Staff" | null>(null);

  // Hardcoded credential mappings for immediate validation
  const CREDENTIALS = {
    admin: {
      username: "admin",
      password: "adminpassword",
      role: "Admin" as const,
      label: "Main Account (Admin)"
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const uLower = username.trim().toLowerCase();
    const p = password.trim();

    if (!uLower || !p) {
      setErrorMsg("Please enter both credentials.");
      return;
    }

    // Read custom sub accounts: combine prop and local storage for robust cross-browser safety
    let customSubAccounts: Array<{ username: string; password?: string }> = [...subAccounts];
    
    // If the prop is empty, check localStorage as fallback
    if (customSubAccounts.length === 0) {
      const customSubStr = localStorage.getItem("guest_rsvp_mngr_sub_accounts_list");
      if (customSubStr) {
        try {
          customSubAccounts = JSON.parse(customSubStr);
        } catch (err) {}
      }
    }

    if (uLower === CREDENTIALS.admin.username && p === CREDENTIALS.admin.password) {
      triggerSuccess(CREDENTIALS.admin.role, username);
    } else if (customSubAccounts.some(acc => acc.username.toLowerCase() === uLower && acc.password === p)) {
      const match = customSubAccounts.find(acc => acc.username.toLowerCase() === uLower);
      triggerSuccess("Staff", match ? match.username : username);
    } else {
      setErrorMsg("Invalid username or password.");
    }
  };

  const triggerSuccess = (role: "Admin" | "Staff", loggedUsername: string) => {
    setSuccessRole(role);
    setTimeout(() => {
      onLoginSuccess(role, loggedUsername);
    }, 800);
  };

  return (
    <div id="login-screen-bg" className="min-h-screen bg-[#f3f6fa] flex items-center justify-center p-4 selection:bg-gold-pale selection:text-navy">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-150 relative">
        
        {/* Visual Header Banner */}
        <div className="bg-[#0b1b3d] text-white p-8 relative overflow-hidden">
          {/* Subtle gold accent lighting */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gold/15 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-4xl p-3 bg-white/10 rounded-2xl mb-4 shadow-sm" role="img" aria-label="Guest Manager Logo">
              📋
            </span>
            <h1 className="font-serif text-2xl font-black tracking-tight text-white">
              Guest Reservation Portal
            </h1>
            <p className="text-xs text-slate-300 font-medium tracking-wide mt-1 uppercase">
              Event Seating, Booking & Live Synchronizer
            </p>

            {/* Live Cloud Sync connection indicator */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/90">
              {isSyncing ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>Connecting cloud data...</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Cloud DB Connected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="p-8">
          {successRole ? (
            <div id="login-success-state" className="py-12 flex flex-col items-center text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-navy">Access Granted</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Signing you into your <span className="text-[#bf8f30] font-bold">{successRole === "Admin" ? "Main Admin Account" : "Sub Staff Account"}</span>...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5" id="login-form-element">
              
              {/* Account Type Informational Banner */}
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <p className="text-[11px] text-[#4b5c73] font-medium leading-normal">
                  Identify with a <b>Main Account</b> to gain unrestricted staff coordination & Google Sheets control rules, or a <b>Sub Account</b> for live list operations.
                </p>
              </div>

              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider" htmlFor="login-username-input">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin or staff"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-gold rounded-xl text-navy font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gold-pale transition"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider" htmlFor="login-password-input">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-gold rounded-xl text-navy font-bold text-sm focus:outline-none focus:ring-2 focus:ring-gold-pale transition"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Error block */}
              {errorMsg && (
                <div id="login-error-alert" className="text-xs text-red-600 bg-red-50 border border-red-150 px-3.5 py-2.5 rounded-xl font-semibold leading-relaxed flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                id="login-submit-button"
                type="submit"
                className="w-full py-3.5 bg-navy hover:bg-[#132852] text-white font-bold text-sm rounded-xl border border-navy shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-gold-light" />
                <span>Sign In to System</span>
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
