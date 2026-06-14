/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Guest, RsvpStatus, EntryType, TableConfig, EventDetails } from "../types";

// Get today's date in YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const initialEventDetails: EventDetails = {
  title: "Le Chateaux Ritz Banquet",
  date: getTodayString(),
  venue: "Grand Ballroom, Ritz Tower Plaza, Manila",
  time: "19:00"
};

export const initialTables: TableConfig[] = [
  { name: "Table 1", capacity: 2, icon: "🔥", override: "" },
  { name: "Table 2", capacity: 2, icon: "🔥", override: "" },
  { name: "Table 3", capacity: 4, icon: "💧", override: "" },
  { name: "Table 4", capacity: 4, icon: "💧", override: "" },
  { name: "Table 5", capacity: 4, icon: "💧", override: "" },
  { name: "Private Room", capacity: 12, icon: "💧", override: "" },
  { name: "Bar Area", capacity: 8, icon: "🍹", override: "" }
];

export const initialStaff: string[] = [
  "Ana Cruz",
  "Ben Reyes",
  "Carlo Diaz"
];

export const initialGuests: Guest[] = [
  {
    id: "1",
    name: "Maria Santos",
    phone: "+63 912 345 6789",
    type: EntryType.RESERVATION,
    date: getTodayString(),
    time: "07:00 PM",
    pax: 4,
    table: "Table 5",
    status: RsvpStatus.CONFIRMED,
    notes: "Birthday celebration",
    staff: "Ana Cruz"
  },
  {
    id: "2",
    name: "Juan Dela Cruz",
    phone: "+63 917 111 2222",
    type: EntryType.RESERVATION,
    date: getTodayString(),
    time: "08:00 PM",
    pax: 2,
    table: "Table 1",
    status: RsvpStatus.SEATED,
    notes: "Anniversary dinner",
    staff: "Ben Reyes",
    arrival: "19:55"
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    phone: "+1 (555) 753-1597",
    type: EntryType.WALK_IN,
    date: getTodayString(),
    time: "06:00 PM",
    pax: 3,
    table: "Bar Area",
    status: RsvpStatus.SEATED,
    notes: "Drinks and appetizers",
    staff: "Carlo Diaz",
    arrival: "18:02"
  },
  {
    id: "4",
    name: "Eleanor Vance",
    phone: "+1 (555) 123-4567",
    type: EntryType.RESERVATION,
    date: getTodayString(),
    time: "07:30 PM",
    pax: 5,
    table: "Private Room",
    status: RsvpStatus.PENDING,
    notes: "Business meeting, VIP, requires prompt service.",
    staff: "Ana Cruz"
  }
];
