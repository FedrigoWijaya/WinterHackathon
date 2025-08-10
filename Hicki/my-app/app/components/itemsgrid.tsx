// app/components/ItemsGrid.tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Item, listItems } from "../lib/items";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BEIGE = "#F4EFE8";

export default function ItemsGrid() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const pad = 16;
  const cardW = (width - pad * 3) / 2; // 2 columns with side & middle gaps

  useFocusEffect(
    useCallback(() => {
      setItems(listItems());
      return () => {};
    }, [])
  );

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable
      onPress={() => router.push(`/item/${encodeURIComponent(item.id)}`)}
      style={[s.card, { width: cardW }]}
    >
      <Image source={{ uri: item.image }} style={s.img} />
      <Text style={s.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={s.loc} numberOfLines={1}>
        {item.distanceKm.toFixed(1)} km away
      </Text>

      <View style={s.footerRow}>
        {typeof item.stockLeft === "number" ? (
          <Text style={s.leftText}>{item.stockLeft} left</Text>
        ) : <View />}

        <View style={s.snagPill}>
          <Text style={s.snagText}>Snag</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{ gap: pad }}
      contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: 120, gap: pad }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF3F0",
    overflow: "hidden",
  },
  img: { width: "100%", height: 120 },
  title: { color: GREEN, fontWeight: "800", fontSize: 13, marginTop: 8, marginHorizontal: 10 },
  loc: { color: GREEN, opacity: 0.8, fontSize: 11, marginTop: 2, marginHorizontal: 10 },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  leftText: { color: ORANGE, fontWeight: "800", fontSize: 12 },
  snagPill: {
    backgroundColor: BEIGE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  snagText: { color: GREEN, fontWeight: "800", fontSize: 12 },
});
