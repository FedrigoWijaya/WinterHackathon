import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, Pressable, Image, useWindowDimensions, FlatList,
} from "react-native";
import BackHeader from "../components/BackHeader";
import { pairId } from "../lib/chat";
import { router } from "expo-router";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BEIGE = "#F4EFE8";
const LIGHT_BORDER = "#E7ECE8";
const MAX_W = 520;
const TABBAR_SPACE = 110;

const TABS = ["My items", "Snag items"] as const;
const CURRENT_USER_ID = "u_me";

type MyItem = { id: string; tag: string; title: string; left: number; image: string; ownerId: string; };
type SnagItem = { id: string; tag: string; title: string; distance: string; reminder: string; image: string; ownerId: string; };

const TOMATO = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop";
const KETTLE = "https://images.unsplash.com/photo-1615485737651-cb4f7b14b5f8?q=80&w=1200&auto=format&fit=crop";

const MY_ITEMS: MyItem[] = [
  { id: "m1", tag: "Kerbies", title: "Green kettle", left: 1, image: KETTLE, ownerId: "u_me" },
  { id: "m2", tag: "Food",    title: "Fresh tomatoes", left: 10, image: TOMATO, ownerId: "u_me" },
  { id: "m3", tag: "Kerbies", title: "Green kettle", left: 1, image: KETTLE, ownerId: "u_me" },
  { id: "m4", tag: "Food",    title: "Fresh tomatoes", left: 10, image: TOMATO, ownerId: "u_me" },
];

const SNAG_ITEMS: SnagItem[] = [
  { id: "s1", tag: "Kerbies", title: "Green kettle", distance: "0.6 km away", reminder: "Pick-up reminder · 30 minutes", image: KETTLE, ownerId: "u_otti" },
  { id: "s2", tag: "Food",    title: "Fresh tomatoes", distance: "1 km away",  reminder: "Pick-up reminder · 30 minutes", image: TOMATO, ownerId: "u_figo" },
  { id: "s3", tag: "Kerbies", title: "Green kettle", distance: "0.6 km away", reminder: "Pick-up reminder · 30 minutes", image: KETTLE, ownerId: "u_otti" },
  { id: "s4", tag: "Food",    title: "Fresh tomatoes", distance: "1 km away",  reminder: "Pick-up reminder · 30 minutes", image: TOMATO, ownerId: "u_figo" },
];

export default function ItemsScreen() {
  const { width } = useWindowDimensions();
  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420);

  const [tab, setTab] = useState<(typeof TABS)[number]>("My items");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({ s1: true });

  const data = useMemo(
    () => (tab === "My items" ? MY_ITEMS : SNAG_ITEMS),
    [tab]
  );

  const GUTTER = 12;
  const CARD_W = Math.floor((CONTENT_W - GUTTER) / 2);

  function startChat(ownerId: string) {
    const id = pairId(CURRENT_USER_ID, ownerId);
    router.push(`/messages/${id}`);
  }

  const Header = () => (
    <View style={s.headerWrap}>
      <View style={[s.inner, { width: CONTENT_W }]}>
        <BackHeader title="List of items" backTo="/(main)/profile" />
        <View style={s.tabsRow}>
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[s.tab, active ? { backgroundColor: GREEN } : { backgroundColor: BEIGE }]}
              >
                <Text style={{ color: active ? "#fff" : GREEN, fontWeight: "700" }}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(it) => it.id}
      numColumns={2}
      columnWrapperStyle={{ gap: GUTTER, justifyContent: "center" }}
      renderItem={({ item }) =>
        tab === "My items" ? (
          <MyItemCard data={item as MyItem} width={CARD_W} />
        ) : (
          <SnagItemCard
            data={item as SnagItem}
            width={CARD_W}
            accepted={!!accepted[item.id]}
            onToggleAccept={() =>
              setAccepted((m) => ({ ...m, [item.id]: !m[item.id] }))
            }
            onSendMessage={() => startChat((item as SnagItem).ownerId)}
          />
        )
      }
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{
        paddingBottom: TABBAR_SPACE,
        backgroundColor: "#fff",
        gap: GUTTER,
        paddingHorizontal: (width - CONTENT_W) / 2, // visually center grid
      }}
      scrollIndicatorInsets={{ bottom: TABBAR_SPACE }}
    />
  );
}

function Tag({ text }: { text: string }) {
  return <View style={s.tag}><Text style={s.tagText}>{text}</Text></View>;
}

function MyItemCard({ data, width }: { data: MyItem; width: number }) {
  return (
    <View style={[s.cardBox, { width }]}>
      <View style={{ position: "relative" }}>
        <Image source={{ uri: data.image }} style={s.img} />
        <View style={s.tagWrap}><Tag text={data.tag} /></View>
      </View>

      <View style={s.cardBody}>
        <Text style={s.cardTitle}>{data.title}</Text>
        <View style={s.rowSpace}>
          <Text style={s.mutedSmall}>{data.left} left</Text>
          <Pressable style={[s.smallPill, { backgroundColor: ORANGE }]}>
            <Text style={s.smallPillTextWhite}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function SnagItemCard({
  data, width, accepted, onToggleAccept, onSendMessage,
}: {
  data: SnagItem; width: number; accepted: boolean;
  onToggleAccept: () => void; onSendMessage: () => void;
}) {
  return (
    <View style={[s.cardBox, { width }]}>
      <View style={{ position: "relative" }}>
        <Image source={{ uri: data.image }} style={s.img} />
        <View style={s.tagWrap}><Tag text={data.tag} /></View>
      </View>

      <View style={s.cardBody}>
        <Text style={s.metaSmall}>{data.distance}</Text>
        <Text style={s.metaSmall}>{data.reminder}</Text>

        <View style={{ marginTop: 6, marginBottom: 6 }}>
          <Pressable style={s.msgChip} onPress={onSendMessage}>
            <Text style={s.msgChipText}>Send message</Text>
          </Pressable>
        </View>

        <View style={[s.rowSpace, { gap: 8 }]}>
          <Pressable onPress={onToggleAccept} style={[s.smallPill, { backgroundColor: "#1f8a54" }]}>
            <Text style={s.smallPillTextWhite}>{accepted ? "Accepted" : "Accept"}</Text>
          </Pressable>
          <Pressable onPress={() => {}} style={[s.smallPill, { backgroundColor: ORANGE }]}>
            <Text style={s.smallPillTextWhite}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
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

  tabsRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },

  cardBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LIGHT_BORDER,
    overflow: "hidden",
  },
  img: { width: "100%", height: 140, backgroundColor: "#ddd" },
  tagWrap: { position: "absolute", top: 8, left: 8 },
  tag: { backgroundColor: BEIGE, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { color: GREEN, fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 10 },
  cardTitle: { color: GREEN, fontWeight: "800", fontSize: 14, marginBottom: 4 },
  metaSmall: { color: GREEN, opacity: 0.8, fontSize: 11, marginBottom: 2 },
  mutedSmall: { color: GREEN, opacity: 0.7, fontSize: 12 },
  rowSpace: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  smallPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  smallPillTextWhite: { color: "#fff", fontWeight: "800", fontSize: 12 },
  msgChip: { borderWidth: 1.5, borderColor: GREEN, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start" },
  msgChipText: { color: GREEN, fontWeight: "700", fontSize: 12 },
});
