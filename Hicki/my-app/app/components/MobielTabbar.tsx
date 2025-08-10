import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BAR_H = 72;

export default function MobielTabbar({ state, navigation }: BottomTabBarProps) {
  const pathname = usePathname();
  const inset = useSafeAreaInsets();

  // Hide on messages list and any chat thread
  // Works whether the route is "/messages" or "/(main)/messages/..."
  const hideOnMessages = /^\/(?:\([^/]+\)\/)?messages(?:\/|$)/.test(pathname);
  if (hideOnMessages) return null;

  const active = state.routes[state.index]?.name;
  const go = (name: string) => navigation.navigate(name as never);

  return (
    <View style={{ backgroundColor: "transparent" }}>
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: inset.bottom + 10,
          height: BAR_H,
          backgroundColor: GREEN,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Slot>
          <IconBtn
            onPress={() => go("index")}
            name="home-outline"
            focused={active === "index"}
          />
        </Slot>

        <Slot>
          <IconBtn
            onPress={() => go("explore")}
            name="search-outline"
            focused={active === "explore"}
          />
        </Slot>

        {/* Center "+" button */}
        <Slot>
          <Pressable
            onPress={() => go("upload")}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: ORANGE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>
        </Slot>

        <Slot>
          <IconBtn
            onPress={() => go("notification")}
            name="notifications-outline"
            focused={active === "notification"}
          />
        </Slot>

        <Slot>
          <IconBtn
            onPress={() => go("profile")}
            name="person-outline"
            focused={active === "profile"}
          />
        </Slot>
      </View>
    </View>
  );
}

function Slot({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {children}
    </View>
  );
}

function IconBtn({
  focused,
  onPress,
  name,
}: {
  focused: boolean;
  onPress: () => void;
  name: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable onPress={onPress} style={{ padding: 12 }}>
      <Ionicons name={name} size={24} color={focused ? "#ffffff" : "#D6EFE7"} />
    </Pressable>
  );
}
