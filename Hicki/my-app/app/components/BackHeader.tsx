import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const GREEN = "#0F4D3A";

export default function BackHeader({
  title,
  backTo,
  replace = false,
}: {
  title: string;
  backTo?: string;     // e.g. "/(main)/profile"
  replace?: boolean;   // use router.replace instead of push
}) {
  const router = useRouter();

  const onBack = () => {
    if (backTo) {
      replace ? router.replace(backTo as any) : router.push(backTo as any);
    } else {
      router.back();
    }
  };

  return (
    <View style={s.row}>
      <Pressable onPress={onBack} style={s.btn} hitSlop={10}>
        <Ionicons name="chevron-back" size={24} color={GREEN} />
      </Pressable>
      <Text style={s.title}>{title}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 12 },
  btn: { paddingRight: 6, paddingVertical: 2 },
  title: { color: GREEN, fontSize: 24, fontWeight: "700" },
});
