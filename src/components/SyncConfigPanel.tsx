/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, CloudLightning, Copy, Check, ExternalLink } from "lucide-react";

interface SyncConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scriptUrl: string;
  onSaveUrl: (url: string) => void;
  onTestSync: (url: string) => Promise<boolean>;
}

export default function SyncConfigPanel({
  isOpen,
  onClose,
  scriptUrl,
  onSaveUrl,
  onTestSync
}: SyncConfigPanelProps) {
  const [urlInput, setUrlInput] = useState(scriptUrl);
  const [testState, setTestState] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  // Code template display so user can copy it
  const appsScriptCode = `/* Google Apps Script for Guest Manager Sync Web App */
function doPost(e) {
  // Safeguard: Check if doPost is executed directly from the Google Apps Script IDE Run button (which leaves 'e' undefined)
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Warning: doPost was run directly from the Google internal script editor instead of an HTTP request. This is normal and expected because Google leaves the event payload empty on manual triggers. Please use the 'Test Sync' button inside the web app dashboard to run this integration."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    let sheets = {
      reservations: ss.getSheetByName("reservations") || ss.insertSheet("reservations"),
      tables: ss.getSheetByName("tablesConfig") || ss.insertSheet("tablesConfig"),
      staff: ss.getSheetByName("staffList") || ss.insertSheet("staffList"),
      subAccounts: ss.getSheetByName("subAccounts") || ss.insertSheet("subAccounts")
    };

    if (action === "getAll") {
      let reservations = getData(sheets.reservations);
      let tables = getData(sheets.tables);
      let staff = getData(sheets.staff).map(row => row.name || row[0] || "");
      let subAccounts = getData(sheets.subAccounts);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        reservations,
        tables,
        staff,
        subAccounts
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "syncReservations") {
      clearAndWrite(sheets.reservations, data.reservations);
      return ok();
    }

    if (action === "syncTables") {
      clearAndWrite(sheets.tables, data.tables);
      return ok();
    }

    if (action === "syncStaff") {
      clearAndWrite(sheets.staff, data.staff.map(s => ({ name: s })));
      return ok();
    }

    if (action === "syncSubAccounts") {
      clearAndWrite(sheets.subAccounts, data.subAccounts);
      return ok();
    }

    function getData(sheet) {
      let rows = sheet.getDataRange().getValues();
      if (rows.length < 2) return [];
      let headers = rows[0];
      return rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => {
          obj[h] = row[i];
        });
        return obj;
      });
    }

    function clearAndWrite(sheet, arr) {
      sheet.clear();
      if (!arr.length) return;
      let headers = Object.keys(arr[0]);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      let data = arr.map(obj => headers.map(h => obj[h] ?? ""));
      if (data.length) sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }

    function ok() {
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Guest RSVP Sync Web App is ACTIVE! Paste this URL into the Guest Manager app's Sync Hub.")
    .setMimeType(ContentService.MimeType.TEXT);
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestState("testing");
    setTestMessage("Pinging Google Apps Script Web App API...");
    try {
      const success = await onTestSync(urlInput.trim());
      if (success) {
        setTestState("success");
        setTestMessage("Connection established successfully! Daily tables, reservations and crews linked.");
      } else {
        setTestState("error");
        setTestMessage("Failed to connect. Double check script deployment parameters.");
      }
    } catch (e) {
      setTestState("error");
      setTestMessage("CORS rejected or invalid endpoint URL.");
    }
  };

  const handleSaveAndClose = () => {
    onSaveUrl(urlInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        
        {/* Header */}
        <div className="bg-navy px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div>
            <h3 className="font-serif text-lg font-bold flex items-center gap-2">
              <CloudLightning className="w-5 h-5 text-gold animate-bounce" />
              <span>Google Sheets Integration Hub</span>
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              Sync reservations and database tables in real-time with an active Google Sheet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/95 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="hidden-scrollbar overflow-y-auto p-6 flex-1 space-y-6 text-xs text-navy">
          
          {/* Active input field */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#8a9ab5] uppercase tracking-wide">
              Deployed Apps Script Web App URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
              />
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={!urlInput.trim()}
                className="px-4 py-3 bg-navy hover:bg-navy-mid text-white font-bold rounded-xl text-xs transition disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
              >
                Test Sync
              </button>
            </div>
            
            {/* Test result message indicator */}
            {testState !== "idle" && (
              <div
                className={`p-3.5 rounded-xl border text-[11px] font-semibold animate-fadeIn ${
                  testState === "testing"
                    ? "bg-blue-50 border-blue-200 text-blue-800"
                    : testState === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {testState === "testing" && "⏳ "}
                {testState === "success" && "✅ "}
                {testState === "error" && "🚨 "}
                {testMessage}
              </div>
            )}
          </div>

          {/* Structured Step by Step Setup Guides */}
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <h4 className="font-serif text-sm font-bold text-navy uppercase tracking-wider">
              🛠️ Step-by-Step Setup Instructions
            </h4>

            <div className="space-y-3.5 text-slate-600 font-medium leading-relaxed">
              <p>
                <b className="text-navy">1. Create a Google Sheet:</b> Open a new browser tab with Google Sheets and create a blank spreadsheet. Give it any name (e.g. <i>Guest Manager Database</i>).
              </p>
              
              <p>
                <b className="text-navy">2. Open Script Editor:</b> In your active Google Sheet, select the browser toolbar option <b>Extensions</b> &gt; <b>Apps Script</b>.
              </p>

              <div>
                <b className="text-navy">3. Copy and Paste the Companion Sync Code below:</b>
                <div className="relative mt-2 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden font-mono text-[10px] text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-250 flex justify-between bg-white text-navy font-sans text-xs">
                    <span className="font-bold">SyncAppscript.gs</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-[#c9972c] font-semibold flex items-center gap-1 hover:text-[#b28525]"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? "Copied" : "Copy Code"}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-48 whitespace-pre leading-normal">
                    {appsScriptCode}
                  </pre>
                </div>
              </div>

              <p>
                <b className="text-navy">4. Deploy as Web App:</b> Click <b>Deploy</b> (top right) &gt; <b>New Deployment</b>. Set <b>Select type</b> to <b>Web App</b>. Change access parameter <b>Who has access</b> to <b className="text-navy">"Anyone"</b> (this is vital!), and set <b>Execute as</b> to <b className="text-navy">"Me"</b>. Close and execute auth consent prompts.
              </p>

              <p>
                <b className="text-navy">5. Copy Web App URL:</b> Copy the deployed macros Web App link (ends in `/exec`), paste it into the URL field above, and click <b>Save and Link</b>!
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2 text-xs shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-250 bg-white text-slate-600 font-bold rounded-lg hover:bg-slate-55 transition cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSaveAndClose}
            className="px-5 py-2 bg-navy text-white font-bold rounded-lg hover:bg-navy-mid transition cursor-pointer shadow-sm"
          >
            Save and Link Sheet
          </button>
        </div>

      </div>
    </div>
  );
}
