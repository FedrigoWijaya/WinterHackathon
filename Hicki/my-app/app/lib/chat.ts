// app/lib/chat.ts
export const GREEN = "#0F4D3A";
export const CURRENT_USER_ID = "u_me";

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

export const idForName = (name: string) => `u_${slug(name)}`;

/** Show a sensible title even if the id is not seeded */
export function threadTitleFromId(id: string, meId = CURRENT_USER_ID) {
  if (!id) return "Chat";
  if (id === meId) return "Me";
  // strip u_
  const raw = id.replace(/^u_/, "");
  // prettify: "otti_cafe" -> "Otti Cafe"
  return raw
    .split("_")
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : ""))
    .join(" ")
    .trim();
}

export type ThreadRow = {
  id: string;
  name: string;
  last: string;
  color: string;
};

const COLORS = ["#0F4D3A", "#F48C04", "#A1BFB3", "#5F8F7D", "#8FB8A8"];

export function seedThreadsFor(_: string): ThreadRow[] {
  const names = ["Otti Cafe", "Mr.Figo", "Market", "Cafe Uno", "Jeni"];
  return names.map((n, i) => ({
    id: idForName(n),
    name: n,
    last: i === 0 ? "Hi" : "Hi there!",
    color: COLORS[i % COLORS.length],
  }));
}
