// app/(main)/notification.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  ListRenderItemInfo,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const TEXT_MUTE = "#D6EFE7";

const CARD_GAP = 20;
const MAX_W = 520;
const TABBAR_SPACE = 110;

type NAction = "navigate" | "approve" | null;
type NItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  action: NAction;
};

const ITEMS: NItem[] = [
  {
    id: "1",
    icon: "time-outline",
    title: "Pick-up reminder",
    body: "Your reserved sandwiches expire in 45 minutes!\nMoon Cafe - 123 George St",
    action: "navigate",
  },
  {
    id: "2",
    icon: "cube-outline",
    title: "Item picked up",
    body: "Emma S. collected your Tomatoes successfully!\n+50 points earned",
    action: null,
  },
  {
    id: "3",
    icon: "cube-outline",
    title: "Kerbside item picked up",
    body: "Your Wooden chair has been picked up!\n+50 points earned",
    action: null,
  },
  {
    id: "4",
    icon: "mail-outline",
    title: "Approval needed",
    body: "John M. requested your kettle.",
    action: "approve",
  },
];

export default function NotificationScreen() {
  const { width } = useWindowDimensions();
  const [data, setData] = useState<NItem[]>(ITEMS);

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 360);

  const dismiss = (id: string) => setData((prev) => prev.filter((n) => n.id !== id));

  const Header = () => (
    <View style={s.headerWrap}>
      <View style={[s.headerInner, { width: CONTENT_W }]}>
        <Text style={s.h1}>Notifications</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: ListRenderItemInfo<NItem>) => (
    <View style={{ width: CONTENT_W, alignSelf: "center" }}>
      <View style={[s.card, index !== data.length - 1 && { marginBottom: CARD_GAP }]}>
        <View style={s.headerRow}>
          <Ionicons name={item.icon} size={22} color={TEXT_MUTE} />
          <Text style={s.cardTitle}>{item.title}</Text>
        </View>

        <Text style={s.cardBody}>{item.body}</Text>

        {item.action === "navigate" && (
          <View style={s.actionsRow}>
            <Pill
              label="Navigate"
              onPress={() => {
                Alert.alert("Demo", "Pretend we navigated 👍");
                dismiss(item.id);
              }}
            />
          </View>
        )}

        {item.action === "approve" && (
          <View style={[s.actionsRow, { gap: 10 }]}>
            <Pill
              label="Approve"
              onPress={() => {
                Alert.alert("Approved ✅");
                dismiss(item.id);
              }}
            />
            <Pill
              label="Decline"
              variant="outline"
              onPress={() => {
                Alert.alert("Declined ❌");
                dismiss(item.id);
              }}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}            // <- keeps header pinned
      contentContainerStyle={{
        paddingBottom: TABBAR_SPACE,
        alignItems: "center",
        backgroundColor: "#fff",
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function Pill({
  label,
  onPress,
  variant = "solid",
}: {
  label: string;
  onPress: () => void;
  variant?: "solid" | "outline";
}) {
  const solid = variant === "solid";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.pill,
        solid
          ? { backgroundColor: ORANGE }
          : { backgroundColor: "transparent", borderWidth: 2, borderColor: ORANGE },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}
    >
      <Text style={[s.pillText, solid ? { color: "#fff" } : { color: ORANGE }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  headerWrap: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF3F0",
    width: "100%",
    alignItems: "center",
  },
  headerInner: { alignSelf: "center" },
  h1: { fontSize: 24, fontWeight: "700", color: GREEN },

  card: {
    backgroundColor: GREEN,
    borderRadius: 20,
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "800",
    marginLeft: 8,
    flex: 1,
    textAlign: "right",
  },
  cardBody: { color: "#EAF7F2", marginTop: 12, lineHeight: 18 },

  actionsRow: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  pillText: { fontWeight: "800" },
});
