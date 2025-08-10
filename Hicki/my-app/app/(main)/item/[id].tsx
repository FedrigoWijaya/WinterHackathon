// app/(main)/item/[id].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BackHeader from "@/app/components/BackHeader";
import { getItemById } from "../../lib/items";

const GREEN  = "#0F4D3A";
const BEIGE  = "#F4EFE8";
const ORANGE = "#F48C04";
const MAX_W  = 520;

// make a fake thread id from the owner's name
const threadIdForOwner = (name: string) =>
  "u_" + name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = id ? getItemById(id) : undefined;

  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();

  const [qty, setQty] = useState(0);

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: GREEN }}>Item not found</Text>
      </View>
    );
  }

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 460);

  const onSnag = () => {
    if (item.type === "free") {
      const tid = threadIdForOwner(item.owner);
      router.push(`/messages/${tid}`);
      return;
    }
    Alert.alert("Snagged!", "We’ve saved this in your items.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" />

      {/* Top green strip (white chevron only) */}
      <View
        style={{
          backgroundColor: GREEN,
          height: 74,
          paddingTop: inset.top,
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        <BackHeader title="" backTo="/(main)/explore" color="#fff" />
      </View>

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: inset.bottom + 120, // leave room for the tray
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.card, { width: CONTENT_W }]}>
          {/* hero */}
          <View style={s.heroWrap}>
            <Image source={{ uri: item.image }} style={s.heroImg} />
            <View style={[s.chip, s.chipLeft]}>
              <Text style={s.chipText}>{item.category}</Text>
            </View>
            {item.daysLeft && (
              <View style={[s.chip, s.chipRight, { backgroundColor: ORANGE }]}>
                <Text style={[s.chipText, { color: "#fff" }]}>{item.daysLeft}</Text>
              </View>
            )}
          </View>

          {/* title */}
          <View style={s.titleRow}>
            <Text style={s.title}>{item.title}</Text>
            {typeof item.stockLeft === "number" && (
              <Text style={s.stockRightAccent}>{item.stockLeft} left</Text>
            )}
          </View>

          {/* description + meta */}
          <Text style={s.desc}>{item.description}</Text>

          {item.pickupWindow ? (
            <Meta icon="time-outline" text={item.pickupWindow} />
          ) : null}
          <Meta
            icon="location-outline"
            text={`${item.location}  (${item.distanceKm.toFixed(1)} km away)`}
          />
          <View style={s.ownerRow}>
            <Ionicons name="person-circle-outline" size={18} color={GREEN} />
            <Text style={s.ownerText}>{item.owner}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom tray — matches the Figma exactly */}
      <View style={s.bottomTrayWrap}>
        <View style={[s.bottomTray, { paddingBottom: inset.bottom + 10 }]}>
          {item.type === "kerbside" && (
            <>
              <View style={s.rowBetween}>
                {/* ORANGE qty pill with white symbols */}
                <View style={s.qtyWrapOrange}>
                  <Pressable onPress={() => setQty(Math.max(0, qty - 1))} style={s.qtyBtn}>
                    <Text style={s.qtySignWhite}>−</Text>
                  </Pressable>
                  <Text style={s.qtyValueWhite}>{qty}</Text>
                  <Pressable onPress={() => setQty(qty + 1)} style={s.qtyBtn}>
                    <Text style={s.qtySignWhite}>+</Text>
                  </Pressable>
                </View>

                {/* small orange pill button */}
                <Pressable onPress={onSnag} style={s.snagPill}>
                  <Text style={s.snagPillText}>Snag</Text>
                </Pressable>
              </View>

              <Text style={s.footerNote}>Pick up required within 6 hours for kerbside</Text>
            </>
          )}

          {item.type === "free" && (
            <>
              {/* little counter above (Figma) */}
              <View style={s.counterPill}>
                <Text style={s.counterText}>0</Text>
              </View>

              {/* wide beige button with green text */}
              <Pressable onPress={onSnag} style={s.wideBeigeBtn}>
                <Text style={s.wideBeigeText}>Snag and Message</Text>
              </Pressable>

              <Text style={s.footerNote}>Free item requires owner approval</Text>
            </>
          )}

          {item.type === "freeDelayed" && (
            <>
              <View style={[s.counterPill, { backgroundColor: "#E9ECEA" }]}>
                <Text style={[s.counterText, { color: GREEN }]}>0</Text>
              </View>
              <Pressable style={[s.snagPill, { opacity: 0.45 }]} disabled>
                <Text style={s.snagPillText}>Snag</Text>
              </Pressable>
              <Text style={s.footerNote}>
                Pick-up requires owner approval • Starts later today
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

/* ───────────────── helpers ───────────────── */

function Meta({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={s.metaRow}>
      <Ionicons name={icon} size={16} color={GREEN} />
      <Text style={s.metaText}>{text}</Text>
    </View>
  );
}

/* ───────────────── styles ───────────────── */

const PILL_H = 36;

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    gap: 10,
  },

  heroWrap: { borderRadius: 18, overflow: "hidden", position: "relative" },
  heroImg: { width: "100%", height: 240 },

  chip: {
    position: "absolute",
    top: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: BEIGE,
    borderRadius: 999,
  },
  chipLeft: { left: 10 },
  chipRight: { right: 10 },
  chipText: { color: GREEN, fontWeight: "800", fontSize: 12 },

  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { flex: 1, color: GREEN, fontSize: 18, fontWeight: "800" },
  stockRightAccent: { color: ORANGE, fontWeight: "800", fontSize: 12 },

  desc: { color: GREEN, opacity: 0.9, lineHeight: 18 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  metaText: { color: GREEN, fontSize: 12.5 },

  ownerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  ownerText: { color: GREEN, fontSize: 12.5 },

  /* tray */
  bottomTrayWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
  },
  bottomTray: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: BEIGE, // beige panel like Figma
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    gap: 10,
  },
  rowBetween: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* qty pill (ORANGE with white text) */
  qtyWrapOrange: {
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: ORANGE,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  qtySignWhite: { color: "#fff", fontWeight: "900", fontSize: 16, marginTop: -1 },
  qtyValueWhite: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    paddingHorizontal: 10,
    minWidth: 14,
    textAlign: "center",
  },

  /* small orange Snag pill */
  snagPill: {
    width: 112,
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  snagPillText: { color: "#fff", fontWeight: "900" },

  /* wide beige button (free) */
  wideBeigeBtn: {
    width: "100%",
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  wideBeigeText: { color: GREEN, fontWeight: "900" },

  /* tiny counter above free button */
  counterPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  counterText: { color: GREEN, fontWeight: "800", fontSize: 12 },

  footerNote: { color: GREEN, opacity: 0.7, fontSize: 11.5, textAlign: "center" },
});
