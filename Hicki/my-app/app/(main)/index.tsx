import React, { useRef, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BG = "#F3F5F4";

const { width } = Dimensions.get("window");
const PAGE_PAD = 16;
const HERO_W = width - PAGE_PAD * 2;
const HERO_H = 210;
const CARD_W = Math.floor((width - PAGE_PAD * 2 - 12) / 2); // 2 cards

const HERO = [
  { uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=60" },
  { uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=60" },
  { uri: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=60" },
];

const ITEMS = [
  {
    tag: "Kerbies",
    distance: "0.6 km away",
    title: "Green kettle",
    left: "1 left",
    image: { uri: "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?auto=format&fit=crop&w=900&q=60" },
  },
  {
    tag: "Food",
    distance: "1 km away",
    title: "Fresh tomatoes",
    left: "10 left",
    image: { uri: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=60" },
  },
];

export default function Home() {
  const [dot, setDot] = useState(0);
  const ref = useRef<ScrollView>(null);

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: 28 }}>
      {/* Top location bar */}
      <View style={s.topBar}>
        <Text style={s.locationLabel}>Location</Text>
        <View style={s.locationRow}>
          <Ionicons name="location-outline" size={20} color="#fff" />
          <Text style={s.locationText}>149 Victoria Park Rd</Text>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </View>
      </View>

      {/* Hero carousel */}
      <View style={s.section}>
        <View style={s.heroWrap}>
          <ScrollView
            ref={ref}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
              if (i !== dot) setDot(i);
            }}
            scrollEventThrottle={16}
          >
            {HERO.map((img, i) => (
              <Image key={i} source={img} style={s.heroImg} resizeMode="cover" />
            ))}
          </ScrollView>
          <View style={s.dots}>
            {HERO.map((_, i) => (
              <View key={i} style={[s.dot, dot === i && s.dotActive]} />
            ))}
          </View>
        </View>
      </View>

      {/* Stat pill */}
      <View style={s.section}>
        <View style={s.statCard}>
          <Text style={s.statNumber}>15</Text>
          <Text style={s.statCaption}>items rescued this month</Text>
        </View>
      </View>

      {/* Nearby items title */}
      <View style={[s.section, { marginTop: 18 }]}>
        <Text style={s.h2}>Nearby items</Text>
      </View>

      {/* Grid 2-up */}
      <View style={[s.section, s.grid]}>
        {ITEMS.map((it, idx) => (
          <View key={idx} style={s.card}>
            <View style={{ position: "relative" }}>
              <Image source={it.image} style={s.cardImage} resizeMode="cover" />
              <View style={s.badge}>
                <Text style={s.badgeText}>{it.tag}</Text>
              </View>
            </View>

            <View style={{ padding: 12 }}>
              <Text style={s.distance}>{it.distance}</Text>
              <Text style={s.cardTitle}>{it.title}</Text>

              <View style={s.cardFooter}>
                <Text style={s.leftText}>{it.left}</Text>
                <View style={s.snagBtn}>
                  <Text style={s.snagText}>Snag</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* space above the nav bar */}
      <View style={{ height: 12 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  topBar: { backgroundColor: GREEN, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 18 },
  locationLabel: { color: "#D6EFE7", fontSize: 12, marginBottom: 6 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  locationText: { color: "#fff", fontSize: 18, fontWeight: "700", flex: 1 },

  section: { paddingHorizontal: PAGE_PAD, marginTop: 16 },

  heroWrap: { width: HERO_W, height: HERO_H, alignSelf: "center", borderRadius: 24, overflow: "hidden" },
  heroImg: { width: HERO_W, height: HERO_H },
  dots: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.6)" },
  dotActive: { width: 10, height: 10, backgroundColor: "#fff", borderRadius: 999 },

  statCard: { backgroundColor: ORANGE, borderRadius: 24, paddingVertical: 18, alignItems: "center" },
  statNumber: { color: "#fff", fontSize: 44, fontWeight: "800", lineHeight: 48 },
  statCaption: { color: "#fff", opacity: 0.9, marginTop: 6 },

  h2: { fontSize: 24, fontWeight: "700", color: GREEN },

  grid: { flexDirection: "row", gap: 12, flexWrap: "wrap" },

  card: { width: CARD_W, backgroundColor: BG, borderRadius: 18, overflow: "hidden" },
  cardImage: { width: "100%", height: 140 },
  badge: { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, color: "#555" },

  distance: { color: "#6b6b6b", fontSize: 12, marginBottom: 2 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1b1b1b" },

  cardFooter: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftText: { color: "#f97316", fontSize: 12, fontWeight: "600" },
  snagBtn: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  snagText: { color: "#f97316", fontWeight: "700" },
});
