// app/(main)/notification.tsx
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const TEXT_MUTE = "#D6EFE7";

// spacing constants
const CARD_GAP = 20;     // gap between cards
const MAX_W = 520;       // page max width on web
const TABBAR_SPACE = 110;

type NAction = "navigate" | "approve" | null;

const ITEMS: {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  action: NAction;
}[] = [
  {
    id: "1",
    icon: "time-outline",
    title: "Pick-up reminder",
    body:
      "Your reserved sandwiches expire in 45 minutes!\nMoon Cafe - 123 George St",
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
  const { width, height } = useWindowDimensions();

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 360); // centered inner column

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: TABBAR_SPACE }}
    >
      {/* vertically center when content is short */}
      <View style={[styles.centerWrap, { minHeight: height - TABBAR_SPACE }]}>
        <View style={[styles.container, { maxWidth: MAX_W }]}>
          <Text style={styles.h1}>Notifications</Text>

          {/* centered inner column */}
          <View style={[styles.col, { width: CONTENT_W }]}>
            {ITEMS.map((n, i) => (
              <View
                key={n.id}
                style={[
                  styles.card,
                  i !== ITEMS.length - 1 && { marginBottom: CARD_GAP },
                ]}
              >
                <View style={styles.headerRow}>
                  <Ionicons name={n.icon} size={22} color={TEXT_MUTE} />
                  <Text style={styles.cardTitle}>{n.title}</Text>
                </View>

                <Text style={styles.cardBody}>{n.body}</Text>

                {n.action === "navigate" && (
                  <View style={styles.actionsRow}>
                    <Pill label="Navigate" onPress={() => {}} />
                  </View>
                )}

                {n.action === "approve" && (
                  <View style={[styles.actionsRow, { gap: 10 }]}>
                    <Pill label="Approve" onPress={() => {}} />
                    <Pill label="Decline" variant="outline" onPress={() => {}} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
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
        styles.pill,
        solid
          ? { backgroundColor: ORANGE }
          : { backgroundColor: "transparent", borderWidth: 2, borderColor: ORANGE },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
      ]}
    >
      <Text style={[styles.pillText, solid ? { color: "#fff" } : { color: ORANGE }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  centerWrap: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },

  container: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
  },

  col: { alignSelf: "center" },

  h1: { fontSize: 24, fontWeight: "700", color: GREEN, marginBottom: 14 },

  card: {
    backgroundColor: GREEN,
    borderRadius: 20,
    padding: 18, // a bit more inner padding
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
    marginTop: 14, // extra space above buttons
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  pillText: { fontWeight: "800" },
});
