// app/lib/items.ts
export type ItemType = "kerbside" | "free" | "freeDelayed";
export type Category = "Kerbside" | "Food" | "Non-food";

export type Item = {
  id: string;
  type: ItemType;
  category: Category;
  title: string;
  description: string;
  image: string;
  location: string;
  distanceKm: number;
  owner: string;
  postedAgo?: string; // for "free"
  daysLeft?: string;  // for "kerbside"
  startAt?: string;   // for "freeDelayed"
  stockLeft?: number; // for "free"
};

const STORAGE_KEY = "items.v1";

// ---- Seed data (use whatever you already had, this is just an example)
const seed: Item[] = [
  {
    id: "it_kettle",
    type: "kerbside",
    category: "Kerbside",
    title: "Green kettle",
    description: "Perfect condition, moving overseas.",
    image:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop",
    location: "Indooroopilly",
    distanceKm: 2.1,
    owner: "Emma J.",
    daysLeft: "4 days left",
  },
  {
    id: "it_salad",
    type: "free",
    category: "Food",
    title: "Salad bowl",
    description: "Mixed salad, fresh and crisp.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    location: "Fortitude Valley",
    distanceKm: 0.8,
    owner: "Cafe Uno",
    postedAgo: "1 hr ago",
    stockLeft: 3,
  },
  {
    id: "it_tomatoes",
    type: "free",
    category: "Food",
    title: "Fresh tomatoes",
    description: "Sweet and juicy; today’s pick.",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop",
    location: "West End",
    distanceKm: 1.0,
    owner: "Local Farm",
    postedAgo: "10 min ago",
    stockLeft: 10,
  },
  {
    id: "it_voucher",
    type: "freeDelayed",
    category: "Non-food",
    title: "Cafe voucher",
    description: "Free coffee voucher for local cafe.",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
    location: "South Bank",
    distanceKm: 2.0,
    owner: "Otti Cafe",
    startAt: "Start 10 PM",
  },
];

export const ALL_ITEMS: Item[] = [...seed];

/** Legacy alias so old code like `_items.ITEMS` keeps working */
export const ITEMS: Item[] = ALL_ITEMS;

/** List a snapshot */
export function listItems(): Item[] {
  return [...ALL_ITEMS];
}

/** Lookup by id */
export function getItemById(id: string) {
  return ALL_ITEMS.find((x) => x.id === id);
}

/** Add a new item (used by Upload) */
export async function addItem(input: Omit<Item, "id">) {
  const id = "it_" + Date.now().toString(36);
  const item: Item = { ...input, id };
  ALL_ITEMS.unshift(item);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_ITEMS));
  } catch {}
  return id;
}

/** Restore persisted list (call once on app start) */
export async function hydrateItems() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      ALL_ITEMS.length = 0;
      ALL_ITEMS.push(...arr);
    }
  } catch {}
}
