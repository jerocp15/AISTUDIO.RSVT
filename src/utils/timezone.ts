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
  return getDetectedTimezone();
};

export const setStoredTimezone = (tz: string): void => {
  // no-op
};

// Formats today's date matching the device local timezone as YYYY-MM-DD
export const getTodayStringInTimezone = (tz?: string): string => {
  try {
    const timeZone = tz && tz !== "AUTO" ? tz : getDetectedTimezone();
    const d = new Date();
    
    const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone }).format(d);
    const month = new Intl.DateTimeFormat("en", { month: "2-digit", timeZone }).format(d);
    const day = new Intl.DateTimeFormat("en", { day: "2-digit", timeZone }).format(d);
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

// Formats current system time in HH:MM (24-hour style) matching the device local timezone
export const getSystemTime24InTimezone = (tz?: string): string => {
  try {
    const timeZone = tz && tz !== "AUTO" ? tz : getDetectedTimezone();
    const d = new Date();
    
    const hour = new Intl.DateTimeFormat("en", { hour: "2-digit", hourCycle: "h23", timeZone }).format(d);
    const minute = new Intl.DateTimeFormat("en", { minute: "2-digit", timeZone }).format(d);
    
    const cleanHour = String(hour).padStart(2, "0").slice(-2);
    const cleanMinute = String(minute).padStart(2, "0").slice(-2);
    
    return `${cleanHour}:${cleanMinute}`;
  } catch (e) {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }
};

// Get list of standard/popular timezones for selection
export const POPULAR_TIMEZONES = [
  { name: "Device Local Time", value: "AUTO" }
];

