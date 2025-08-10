import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, Pressable, Image, useWindowDimensions, FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackHeader from "../components/BackHeader";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BEIGE = "#F4EFE8";
const MAX_W = 520;
const TABBAR_SPACE = 110;

const CATS = ["Cafe", "Restaurant", "Grocery"] as const;

type Reward = {
  id: string; title: string; desc: string; points: number; image: string;
  category: (typeof CATS)[number];
};

const DUMMY: Reward[] = [
  // cafe
  { id: "c1", title: "Brew & Co.", desc: "$5 discount all menu", points: 50, category: "Cafe",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop" },
  { id: "c2", title: "Morning Mug", desc: "Free pastry with any drink", points: 70, category: "Cafe",
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1200&auto=format&fit=crop" },
  { id: "c3", title: "Espresso Lane", desc: "2-for-1 cappuccino", points: 60, category: "Cafe",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop" },
  { id: "c4", title: "Latte House", desc: "$3 off any large coffee", points: 40, category: "Cafe",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop" },
  // restaurant
  { id: "r1", title: "Pasta Verde", desc: "10% off total bill", points: 120, category: "Restaurant",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop" },
  { id: "r2", title: "Grill Central", desc: "Free dessert with mains", points: 90, category: "Restaurant",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop" },
  { id: "r3", title: "Sushi Garden", desc: "Complimentary miso soup", points: 80, category: "Restaurant",
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1200&auto=format&fit=crop" },
  { id: "r4", title: "Taco Fiesta", desc: "Buy 2 tacos, get 1 free", points: 75, category: "Restaurant",
    image: "https://images.unsplash.com/photo-1601924572539-6f31928f04a5?q=80&w=1200&auto=format&fit=crop" },
  // grocery
  { id: "g1", title: "Green Mart", desc: "$5 off fresh produce", points: 60, category: "Grocery",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" },
  { id: "g2", title: "Daily Grocer", desc: "Free eggs with $30 spend", points: 85, category: "Grocery",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop" },
  { id: "g3", title: "Urban Market", desc: "10% off pantry items", points: 95, category: "Grocery",
    image: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=1200&auto=format&fit=crop" },
  { id: "g4", title: "Fresh & Go", desc: "Free bread loaf with $25 spend", points: 70, category: "Grocery",
    image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?q=80&w=1200&auto=format&fit=crop" },
];

export default function RewardsScreen() {
  const { width } = useWindowDimensions();
  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("Cafe");

  const data = useMemo(() => {
    const base = DUMMY.filter((r) => r.category === cat);
    const s = q.trim().toLowerCase();
    return (s ? base.filter(r => r.title.toLowerCase().includes(s) || r.desc.toLowerCase().includes(s)) : base).slice(0, 4);
  }, [q, cat]);

  const Header = () => (
    <View style={s.headerWrap}>
      <View style={[s.inner, { width: CONTENT_W }]}>
        <BackHeader title="Rewards" backTo="/(main)/profile" />
        <View style={s.searchWrap}>
          <Ionicons name="search" size={18} color={GREEN} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="What are you looking for?"
            placeholderTextColor="#7c9c92"
            style={s.searchInput}
            returnKeyType="search"
          />
        </View>
        <View style={s.chipsRow}>
          {CATS.map((c) => {
            const active = cat === c;
            return (
              <Pressable key={c} onPress={() => setCat(c)} style={[s.chip, active ? { backgroundColor: GREEN } : { backgroundColor: BEIGE }]}>
                <Text style={{ color: active ? "#fff" : GREEN, fontWeight: "700" }}>{c}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Reward }) => (
    <View style={[s.inner, { width: CONTENT_W }]}>
      <View style={s.card}>
        <Image source={{ uri: item.image }} style={s.cardImg} />
        <View style={{ flex: 1, paddingVertical: 8 }}>
          <Text style={s.cardTitle}>{item.title}</Text>
          <Text style={s.cardDesc}>{item.desc}</Text>
          <View style={s.cardBottom}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="star" size={16} color={ORANGE} />
              <Text style={s.pointsText}>{item.points} points</Text>
            </View>
            <Pressable style={s.redeemBtn}><Text style={s.redeemText}>Redeem</Text></Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: TABBAR_SPACE, backgroundColor: "#fff" }}
      scrollIndicatorInsets={{ bottom: TABBAR_SPACE }}
    />
  );
}

const s = StyleSheet.create({
  headerWrap: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    alignItems: "center",
  },
  inner: { alignSelf: "center" },

  searchWrap: {
    height: 42, borderRadius: 999, borderWidth: 2, borderColor: GREEN,
    paddingHorizontal: 12, flexDirection: "row", alignItems: "center",
  },
  searchInput: { flex: 1, marginLeft: 8, color: GREEN, paddingVertical: 6 },

  chipsRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 14, marginBottom: 6 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7ECE8",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cardImg: { width: 110, height: 70, borderRadius: 10, marginRight: 10, backgroundColor: "#ddd" },
  cardTitle: { color: GREEN, fontWeight: "800", fontSize: 14 },
  cardDesc: { color: GREEN, opacity: 0.9, fontSize: 12, marginTop: 2 },
  cardBottom: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pointsText: { color: GREEN, fontSize: 12, fontWeight: "700" },
  redeemBtn: { backgroundColor: ORANGE, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  redeemText: { color: "#fff", fontWeight: "800", fontSize: 12.5 },
});
