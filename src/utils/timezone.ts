/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized utilities for managing the active timezone of the RSVP system.

export const getDetectedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch (e) {
    return "UTC";
  }
};

export const getStoredTimezone = (): string => {
  const stored = localStorage.getItem("guest_rsvp_mngr_timezone");
  if (stored) return stored;
  const detected = getDetectedTimezone();
  localStorage.setItem("guest_rsvp_mngr_timezone", detected);
  return detected;
};

export const setStoredTimezone = (tz: string): void => {
  localStorage.setItem("guest_rsvp_mngr_timezone", tz);
};

// Formats today's date matching the chosen timezone as YYYY-MM-DD
export const getTodayStringInTimezone = (tz: string): string => {
  try {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    const parts = formatter.formatToParts(d);
    const year = parts.find(p => p.type === "year")?.value || String(d.getFullYear());
    const month = parts.find(p => p.type === "month")?.value || String(d.getMonth() + 1).padStart(2, "0");
    const day = parts.find(p => p.type === "day")?.value || String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (e) {
    // fallback
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

// Formats current system time in HH:MM (24-hour style) matching the chosen timezone
export const getSystemTime24InTimezone = (tz: string): string => {
  try {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const parts = formatter.formatToParts(d);
    let hour = parts.find(p => p.type === "hour")?.value || String(d.getHours()).padStart(2, "0");
    const minute = parts.find(p => p.type === "minute")?.value || String(d.getMinutes()).padStart(2, "0");
    
    // Some formats include leading spaces or map 24 to 00/24 depending on runtime
    hour = hour.trim();
    if (hour === "24") hour = "00";
    hour = hour.padStart(2, "0");
    
    return `${hour}:${minute}`;
  } catch (e) {
    // fallback
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
};

// Get list of standard/popular timezones for selection
export const POPULAR_TIMEZONES = [
  { name: "Local Autodetected", value: "AUTO" },
  { name: "London (GMT/BST)", value: "Europe/London" },
  { name: "Paris/Riyadh (GMT+3)", value: "Asia/Riyadh" },
  { name: "Dubai (GMT+4)", value: "Asia/Dubai" },
  { name: "New York (EST/EDT)", value: "America/New_York" },
  { name: "Chicago (CST/CDT)", value: "America/Chicago" },
  { name: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
  { name: "Tokyo (GMT+9)", value: "Asia/Tokyo" },
  { name: "Singapore (GMT+8)", value: "Asia/Singapore" },
  { name: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { name: "UTC / GMT", value: "UTC" }
];
