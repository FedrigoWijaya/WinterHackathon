// Canonical helpers for chat IDs + demo data.
// All screens must use *this* pairId to avoid mismatched threads.

import type { Router } from "expo-router";

export const GREEN = "#0F4D3A";
export const CURRENT_USER_ID = "u_me"; // swap with your real auth user id

// ONE thread per pair of users -> deterministic id
export function pairId(a: string, b: string) {
  return [a, b].sort().join("__"); // e.g. "u_me__u_otti"
}

// Known users (for nice titles/avatars)
export const USERS: Record<string, { name: string; color: string }> = {
  u_me:     { name: "You",        color: "#CFCFCF" },
  u_otti:   { name: "Otti Cafe",  color: "#CFCFCF" },
  u_figo:   { name: "Mr.Figo",    color: GREEN     },
  u_bella:  { name: "Bella Deli", color: "#F48C04" },
  u_market: { name: "Urban Market", color: "#8E9A9B" },
};

// Given a thread id "A__B", return the *other* user's label
export function threadTitleFromId(id: string, me: string = CURRENT_USER_ID) {
  const [a, b] = id.split("__");
  const other = a === me ? b : b === me ? a : b; // fallback: b
  return USERS[other]?.name ?? other;
}

export type ThreadRow = {
  id: string;
  name: string;
  last: string;
  color: string; // avatar color
};

// Seed list for Messages screen (one row per contact)
export function seedThreadsFor(me: string): ThreadRow[] {
  const contacts = ["u_otti", "u_figo", "u_bella", "u_market"];
  const lastLines = [
    "Hi",
    "Are you available today?",
    "Thanks!",
    "See you soon",
  ];
  return contacts.map((uid, i) => ({
    id: pairId(me, uid),
    name: USERS[uid]?.name ?? uid,
    last: `${USERS[uid]?.name ?? uid} : ${lastLines[i % lastLines.length]}`,
    color: USERS[uid]?.color ?? "#CFCFCF",
  }));
}

// Convenience: open or create a thread (client-side nav only here)
export function openThreadWith(router: Router, me: string, other: string) {
  const id = pairId(me, other);
  // TODO: call your backend to ensure the thread doc exists, if needed
  router.push(`/messages/${id}`);
}
