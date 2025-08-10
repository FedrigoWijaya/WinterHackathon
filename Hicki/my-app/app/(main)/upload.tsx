import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addItem, type Category, type ItemType } from "../lib/items";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BEIGE = "#F4EFE8";
const MAX_W = 520;
const TABBAR_SPACE = 110;

const CATS: Category[] = ["Kerbside", "Food", "Non-food"];

export default function Upload() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const containerW = Math.min(width, MAX_W);

  const [cat, setCat] = useState<Category>("Kerbside");
  const [type, setType] = useState<ItemType>("free"); // you can expose a switch if needed
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState(0);
  const [uri, setUri] = useState<string | null>(null);

  async function pickImage() {
    // ask once (no-op on web)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted" && status !== "limited") {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!res.canceled && res.assets?.length) {
      setUri(res.assets[0].uri);
    }
  }

  async function onUpload() {
    if (!uri) return Alert.alert("Add photo", "Please choose a photo first.");
    if (!title.trim()) return Alert.alert("Missing title", "Please add a title.");

    const id = await addItem({
      type,
      category: cat,
      title: title.trim(),
      description: desc.trim(),
      image: uri,
      stockLeft: stock,
    });

    Alert.alert("Uploaded!", "Your item has been added.", [
      { text: "OK", onPress: () => router.push("/(main)/items") },
    ]);
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ paddingBottom: TABBAR_SPACE }}>
      <View style={[s.container, { maxWidth: MAX_W }]}>
        {/* Category chips */}
        <View style={[s.row, { paddingHorizontal: 16, paddingTop: 10 }]}>
          {CATS.map((c) => {
            const active = c === cat;
            return (
              <Pressable
                key={c}
                onPress={() => setCat(c)}
                style={[s.chip, { backgroundColor: active ? GREEN : BEIGE }]}
              >
                <Text style={{ color: active ? "#fff" : GREEN, fontWeight: "800" }}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Upload box */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Pressable
            onPress={pickImage}
            style={[
              s.uploadBox,
              { width: containerW - 32, height: 280, borderRadius: 24 },
            ]}
          >
            {uri ? (
              <Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: 24 }} />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: GREEN, fontWeight: "800" }}>Upload photo</Text>
                <Text style={{ color: GREEN, opacity: 0.75, marginTop: 6 }}>
                  Tap to choose from your library
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Title + Stock */}
        <View style={[s.rowWrap, { paddingHorizontal: 16, marginTop: 16 }]}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={s.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder=""
              style={s.input}
              placeholderTextColor="#7c9c92"
            />
          </View>

          <View style={{ width: 120 }}>
            <Text style={s.label}>Stock</Text>
            <View style={s.stepper}>
              <Pressable onPress={() => setStock((n) => Math.max(0, n - 1))} style={s.stepperBtn}>
                <Text style={s.stepperText}>−</Text>
              </Pressable>
              <Text style={[s.stepperText, { minWidth: 22, textAlign: "center" }]}>{stock}</Text>
              <Pressable onPress={() => setStock((n) => n + 1)} style={s.stepperBtn}>
                <Text style={s.stepperText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={s.label}>Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder=""
            style={[s.input, { height: 44 }]}
            placeholderTextColor="#7c9c92"
          />
        </View>

        {/* Upload button */}
        <View style={{ paddingHorizontal: 16, marginTop: 18, marginBottom: 10 }}>
          <Pressable onPress={onUpload} style={({ pressed }) => [s.cta, pressed && { opacity: 0.9 }]}>
            <Text style={{ color: "#fff", fontWeight: "900" }}>Upload</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { alignSelf: "center", width: "100%" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowWrap: { flexDirection: "row", alignItems: "center" },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 12,
  },

  uploadBox: {
    backgroundColor: BEIGE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: GREEN,
  },

  label: {
    color: GREEN,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 12,
    color: GREEN,
  },

  stepper: {
    height: 44,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BEIGE,
  },
  stepperText: { color: GREEN, fontWeight: "900", fontSize: 16 },

  cta: {
    height: 48,
    backgroundColor: ORANGE,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
