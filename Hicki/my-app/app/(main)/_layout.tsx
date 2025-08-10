import { Tabs } from "expo-router";
import MobileTabBar from "../components/MobielTabbar";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(p) => <MobileTabBar {...p} />}
    >
      {/* visible tabs */}
      <Tabs.Screen name="index"        options={{ title: "Home" }} />
      <Tabs.Screen name="explore"      options={{ title: "Explore" }} />
      <Tabs.Screen name="upload"       options={{ title: "Upload" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
      <Tabs.Screen name="profile"      options={{ title: "Profile" }} />

      {/* hidden (not in tab bar) */}
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="rewards"  options={{ href: null }} />
      <Tabs.Screen name="items"    options={{ href: null }} />
      {/* detail route group for /item/[id] */}
      <Tabs.Screen name="item"     options={{ href: null }} />
    </Tabs>
  );
}
