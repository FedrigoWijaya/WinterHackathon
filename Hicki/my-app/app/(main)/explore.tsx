// app/(main)/explore.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  useWindowDimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BG = "#F3F5F4";
const CARD_BG = "#F4EFE8";

type Cat = { title: string; image: string };
type Item = { tag: string; title: string; distance: string; left: string; image: string };

const CATEGORIES: Cat[] = [
  {
    title: "Kerbside",
    image:
      "https://images.unsplash.com/photo-1600490036275-35f4d5a5d2a7?auto=format&fit=crop&w=360&q=60",
  },
  {
    title: "Food",
    image:
      "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=360&q=60",
  },
  {
    title: "Non-food",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=360&q=60",
  },
  {
    title: "Local business",
    image:
      "https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=360&q=60",
  },
];

const RECENT: Item[] = [
  {
    tag: "Kerbies",
    title: "Green kettle",
    distance: "0.6 km away",
    left: "1 left",
    image:
      "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?auto=format&fit=crop&w=900&q=60",
  },
  {
    tag: "Kerbies",
    title: "Fresh tomatoes",
    distance: "1 km away",
    left: "10 left",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=60",
  },
  {
    tag: "Food",
    title: "Salad bowl",
    distance: "0.8 km away",
    left: "3 left",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=60",
  },
  {
    tag: "Local",
    title: "Cafe voucher",
    distance: "2 km away",
    left: "5 left",
    image:
      "https://images.unsplash.com/photo-1498654200943-1088dd4438ae?auto=format&fit=crop&w=900&q=60",
  },
];

export default function Explore() {
  const { width } = useWindowDimensions();

  // Layout constants
  const MAX_W = 520;     // cap for web so it looks like mobile
  const PAD = 16;        // page side padding
  const GAP_H = 16;      // gap between the 2 columns
  const GAP_V = 16;      // gap between rows

  const containerW = Math.min(width, MAX_W);
  const colW = Math.floor((containerW - PAD * 2 - GAP_H) / 2); // 2 columns + gap

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 110 }}>
      <View style={[styles.container, { maxWidth: MAX_W }]}>
        {/* Header + search */}
        <View style={styles.section}>
          <Text style={styles.h1}>Explore</Text>

          <View style={styles.searchRow}>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={18} color={GREEN} />
              <TextInput
                placeholder="What are you looking for?"
                placeholderTextColor="#6b8f84"
                style={styles.searchInput}
              />
            </View>
            <Pressable style={styles.filterBtn}>
              <Ionicons name="filter-outline" size={20} color={GREEN} />
            </Pressable>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.h2}>Browse by category</Text>

          <FlatList
            data={CATEGORIES}
            keyExtractor={(it) => it.title}
            renderItem={({ item }) => (
              <View style={[styles.catCard, { width: colW }]}>
                <View style={styles.catImageWrap}>
                  <Image source={{ uri: item.image }} style={styles.catImage} />
                </View>
                <Text style={styles.catTitle}>{item.title}</Text>
              </View>
            )}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: GAP_V, // row gap
            }}
            contentContainerStyle={{ paddingHorizontal: PAD }}
          />
        </View>

        {/* Recently added */}
        <View style={styles.section}>
          <Text style={styles.h2}>Recently added</Text>

          <FlatList
            data={RECENT}
            keyExtractor={(it, i) => it.title + i}
            renderItem={({ item }) => (
              <View style={[styles.itemCard, { width: colW }]}>
                <View style={{ position: "relative" }}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.tag}</Text>
                  </View>
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.distance}>{item.distance}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.leftText}>{item.left}</Text>
                    <View style={styles.snagBtn}>
                      <Text style={styles.snagText}>Snag</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: GAP_V, // row gap
            }}
            contentContainerStyle={{ paddingHorizontal: PAD }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { alignSelf: "center", width: "100%" },

  section: { paddingTop: 18 },
  h1: { fontSize: 28, fontWeight: "700", color: GREEN, marginBottom: 14, paddingHorizontal: 16 },
  h2: { fontSize: 22, fontWeight: "700", color: GREEN, marginBottom: 12, paddingHorizontal: 16 },

  // Search
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 12,
  },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 14, color: GREEN },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  // Category tiles
  catCard: {
    backgroundColor: CARD_BG,
    borderRadius: 28,
    alignItems: "center",
    padding: 14,
  },
  catImageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 22,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  catImage: { width: "100%", height: "100%" },
  catTitle: { marginTop: 8, fontWeight: "700", color: GREEN },

  // Recent item cards
  itemCard: {
    backgroundColor: BG,
    borderRadius: 18,
    overflow: "hidden",
  },
  itemImage: { width: "100%", height: 130 },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, color: "#555" },
  distance: { color: "#6b6b6b", fontSize: 12, marginBottom: 2 },
  itemTitle: { fontSize: 16, fontWeight: "700", color: "#1b1b1b" },
  itemFooter: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftText: { color: "#f97316", fontSize: 12, fontWeight: "600" },
  snagBtn: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  snagText: { color: ORANGE, fontWeight: "700" },
});
