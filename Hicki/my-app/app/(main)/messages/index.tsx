import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, Pressable,
  useWindowDimensions, FlatList, ListRenderItemInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BackHeader from "../../components/BackHeader";
import { seedThreadsFor, CURRENT_USER_ID } from "../../lib/chat";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#0F4D3A";
const MAX_W = 520;

type Row = ReturnType<typeof seedThreadsFor>[number];

export default function MessagesScreen() {
  const inset = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420);
  const BOTTOM_PAD = inset.bottom + 16;

  const [q, setQ] = useState("");

  const threads = useMemo(() => {
    const rows = seedThreadsFor(CURRENT_USER_ID);
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter(
      (r) => r.name.toLowerCase().includes(s) || r.last.toLowerCase().includes(s)
    );
  }, [q]);

  const Header = () => (
    <View style={s.headerWrap}>
      <View style={[s.inner, { width: CONTENT_W }]}>
        <BackHeader title="Messages" backTo="/(main)/profile" />
        <View style={s.searchWrap}>
          <Ionicons name="search" size={18} color={GREEN} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search"
            placeholderTextColor="#7c9c92"
            style={s.searchInput}
            returnKeyType="search"
          />
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: ListRenderItemInfo<Row>) => (
    <View style={[s.inner, { width: CONTENT_W }]}>
      <Pressable style={s.row} onPress={() => router.push(`/messages/${item.id}`)}>
        <View style={[s.avatar, { backgroundColor: item.color }]} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.last}>{item.last}</Text>
        </View>
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={threads}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: BOTTOM_PAD, backgroundColor: "#fff" }}
      scrollIndicatorInsets={{ bottom: BOTTOM_PAD }}
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
    height: 42,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: GREEN,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: { flex: 1, marginLeft: 8, color: GREEN, paddingVertical: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#fff",
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  name: { color: GREEN, fontWeight: "800", fontSize: 13 },
  last: { color: GREEN, opacity: 0.8, fontSize: 12, marginTop: 2 },
});
