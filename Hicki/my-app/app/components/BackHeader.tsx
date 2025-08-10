// app/components/BackHeader.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GREEN = "#0F4D3A";

export default function BackHeader({
  title,
  backTo,
  color = GREEN,
}: {
  title: string;
  backTo?: string;
  color?: string;
}) {
  const router = useRouter();
  return (
    <View style={s.row}>
      <Pressable
        onPress={() => (backTo ? router.replace(backTo) : router.back())}
        style={s.btn}
        hitSlop={10}
      >
        <Ionicons name="chevron-back" size={24} color={color} />
      </Pressable>
      {!!title && <Text style={[s.title, { color }]}>{title}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  row: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 12 },
  btn: { paddingRight: 6, paddingVertical: 2 },
  title: { fontSize: 24, fontWeight: "700" },
});
