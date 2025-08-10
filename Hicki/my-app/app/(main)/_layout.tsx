import { Tabs } from "expo-router";
import MobileTabBar from "../components/MobielTabbar";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(p) => <MobileTabBar {...p} />}>
      {/* tabs */}
      <Tabs.Screen name="index"        options={{ title: "Home" }} />
      <Tabs.Screen name="explore"      options={{ title: "Explore" }} />
      <Tabs.Screen name="upload"       options={{ title: "Upload" }} />
      <Tabs.Screen name="notification" options={{ title: "Notifications" }} />
      <Tabs.Screen name="profile"      options={{ title: "Profile" }} />

      {/* non-tab pages (hidden from the tab bar) */}
      <Tabs.Screen name="rewards"  options={{ href: null }} />
      <Tabs.Screen name="messages" options={{ href: null }} />
      <Tabs.Screen name="items"    options={{ href: null }} />
    </Tabs>
  );
}
