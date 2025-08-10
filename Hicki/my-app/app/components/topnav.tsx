import { Link, usePathname } from "expo-router";
import { View, Text, Pressable } from "react-native";

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const path = usePathname();
  const active = path === href;
  return (
    <Link href={href} asChild>
      <Pressable style={{ padding: 12 }}>
        <Text style={{ fontWeight: active ? "700" : "400" }}>{label}</Text>
      </Pressable>
    </Link>
  );
};

export default function TopNav() {
  return (
    <View style={{ height: 56, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 16 }}>
      <Text style={{ fontWeight: "700", fontSize: 18, marginRight: 24 }}>MyApp</Text>
     <NavLink href="/(main)" label="Home" />
     <NavLink href="/(main)/explore" label="Explore" />
     <NavLink href="/(main)/profile" label="Profile" />

    </View>
  );
}
