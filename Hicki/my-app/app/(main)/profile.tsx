// app/(main)/profile.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GREEN = "#0F4D3A";
const BEIGE = "#F4EFE8";
const GOLD = "#F3D079";

const MAX_W = 520;
const TABBAR_SPACE = 110;

export default function ProfileScreen() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420); // wider inner column

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: TABBAR_SPACE }}>
      <View style={[s.centerWrap, { minHeight: height - TABBAR_SPACE }]}>
        <View style={[s.container, { maxWidth: MAX_W }]}>
          <View style={[s.col, { width: CONTENT_W }]}>
            <Text style={s.h1Left}>Profile</Text>
          </View>

          <View style={[s.col, { width: CONTENT_W }]}>
            {/* avatar + info */}
            <View style={{ alignItems: "center", paddingTop: 6 }}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
                }}
                style={s.avatar}
              />
              <Text style={s.name}>Saffa</Text>

              <View style={{ alignItems: "center", gap: 6, marginTop: 2 }}>
                <Inline icon="call-outline" text="0434313750" />
                <Inline icon="location-outline" text="86 Brodie Street" />
                <Inline icon="pin-outline" text="Holland Park West, Qld 4121" />
              </View>
            </View>

            <View style={s.hr} />

            {/* points */}
            <Text style={s.sectionLabel}>Your Points</Text>
            <View style={s.pointsWrap}>
              <Text style={s.pointsValue}>1,000</Text>
              <Text style={s.pointsCaption}>Total Points Earned</Text>
            </View>

            {/* BIGGER rows */}
            <View style={{ marginTop: 18 }}>
              <RowLink
                iconBg
                icon="gift-outline"
                title="Rewards"
                subtitle="Redeem Your Points"
                onPress={() => router.push("/rewards")}
              />
              <RowLink
                iconBg
                icon="chatbubble-ellipses-outline"
                title="Messages"
                subtitle="Chat with other users"
                onPress={() => router.push("/messages")}
              />
              <RowLink
                iconBg
                icon="list-outline"
                title="List of items"
                subtitle="View your items"
                onPress={() => router.push("/items")}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Inline({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Ionicons name={icon} size={14} color={GREEN} />
      <Text style={{ color: GREEN, fontSize: 12 }}>{text}</Text>
    </View>
  );
}

function RowLink({
  icon,
  title,
  subtitle,
  onPress,
  iconBg = true,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  iconBg?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.rowBox, pressed && { opacity: 0.96 }]}
    >
      <View style={[s.rowIcon, iconBg && { backgroundColor: BEIGE }]}>
        <Ionicons name={icon} size={22} color={GREEN} /> {/* bigger icon */}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={GREEN} />
    </Pressable>
  );
}

const s = StyleSheet.create({
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

  h1Left: {
    color: GREEN,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    alignSelf: "flex-start",
  },

  avatar: { width: 76, height: 76, borderRadius: 38, marginBottom: 8 },
  name: { color: GREEN, fontWeight: "800", fontSize: 16 },

  hr: { height: 1, backgroundColor: "#E8EFEA", marginVertical: 12 },

  sectionLabel: { color: GREEN, fontSize: 12, fontWeight: "700", marginBottom: 8 },

  pointsWrap: {
    backgroundColor: GOLD,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  pointsValue: { color: "#7A4600", fontWeight: "900", fontSize: 26, marginBottom: 2 },
  pointsCaption: { color: "#7A4600", fontSize: 12, opacity: 0.9 },

  // >>> bigger rows <<<
  rowBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,       // wider
    paddingVertical: 18,         // taller
    borderRadius: 18,            // rounder
    borderWidth: 1,
    borderColor: "#EEF3F0",
    marginBottom: 14,
    minHeight: 76,               // enforce height bump
  },
  rowIcon: {
    width: 44,                   // bigger icon container
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowTitle: { color: GREEN, fontWeight: "800", fontSize: 16 },  // bigger text
  rowSub: { color: GREEN, opacity: 0.8, fontSize: 12.5, marginTop: 2 },
});
