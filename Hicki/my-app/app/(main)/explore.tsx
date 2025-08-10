// app/(main)/explore.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import ItemsGrid from "../components/itemsgrid";
import { hydrateItems } from "../lib/items";

const GREEN = "#0F4D3A";

export default function Explore() {
  // restore any persisted items once
  useEffect(() => {
    hydrateItems();
  }, []);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.h1}>Explore</Text>
        <View style={s.searchWrap}>
          <TextInput
            placeholder="What are you looking for?"
            placeholderTextColor="#7c9c92"
            style={s.search}
          />
        </View>
      </View>

      {/* your 2×2 grid fed by real items */}
      <ItemsGrid />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  h1: { color: GREEN, fontSize: 24, fontWeight: "800", marginBottom: 10 },
  searchWrap: {
    height: 44,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  search: { color: GREEN, paddingVertical: 0 },
});
