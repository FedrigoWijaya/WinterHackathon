// app/(main)/upload.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GREEN = "#0F4D3A";
const ORANGE = "#F48C04";
const BEIGE = "#F4EFE8";

const CATS = ["Kerbside", "Food", "Non-food"] as const;

export default function Upload() {
  const { width, height } = useWindowDimensions();

  const MAX_W = 520;                           // page max width
  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 360); // centered inner column
  const TABBAR_SPACE = 110;                    // space for your rounded tab bar

  const [cat, setCat] = useState<(typeof CATS)[number]>("Kerbside");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [qty, setQty] = useState(0);
  const [imageUri, setImageUri] = useState<string | null>(null);

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={{ paddingBottom: TABBAR_SPACE }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[s.centerWrap, { minHeight: height - TABBAR_SPACE }]}>
        <View style={[s.container, { maxWidth: MAX_W }]}>
          {/* Chips */}
          <View style={[s.col, { width: CONTENT_W }]}>
            <View style={s.chipsRow}>
              {CATS.map((c) => {
                const active = c === cat;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCat(c)}
                    style={[s.chip, { backgroundColor: active ? GREEN : BEIGE }]}
                  >
                    <Text style={{ color: active ? "#fff" : GREEN, fontWeight: "700" }}>
                      {c}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Upload area */}
          <View style={[s.col, { width: CONTENT_W, marginTop: 12 }]}>
            <Pressable
              onPress={() =>
                setImageUri((u) =>
                  u
                    ? null
                    : "https://images.unsplash.com/photo-1616401784845-180882ba9ba4?auto=format&fit=crop&w=1200&q=60"
                )
              }
              style={[s.uploadBox, { height: 280 }]}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={s.uploadImage} />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="cloud-upload-outline" size={28} color={GREEN} />
                  <Text style={{ marginTop: 8, color: GREEN, fontWeight: "700" }}>
                    Upload photo
                  </Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Title + Stock */}
          <View style={[s.col, { width: CONTENT_W, marginTop: 16 }]}>
            <View style={[s.row, { gap: 12 }]}>
              <View style={[s.inputWrap, { flex: 1 }]}>
                <Text style={s.label}>Title</Text>
                <TextInput value={title} onChangeText={setTitle} style={s.input} />
              </View>

              <View style={{ width: 124 }}>
                <Text style={s.label}>Stock</Text>
                <View style={s.stepper}>
                  <Pressable onPress={() => setQty((q) => Math.max(0, q - 1))} style={s.stepperBtn}>
                    <Text style={s.stepperText}>−</Text>
                  </Pressable>
                  <Text style={[s.stepperText, { minWidth: 22, textAlign: "center" }]}>{qty}</Text>
                  <Pressable onPress={() => setQty((q) => q + 1)} style={s.stepperBtn}>
                    <Text style={s.stepperText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={[s.col, { width: CONTENT_W, marginTop: 12 }]}>
            <Text style={s.label}>Description</Text>
            <TextInput value={desc} onChangeText={setDesc} style={[s.input, { height: 44 }]} />
          </View>

          {/* Upload button — wider */}
          <View style={[s.col, { width: CONTENT_W, marginTop: 18 }]}>
            <Pressable
              onPress={() => console.log({ cat, title, desc, qty, imageUri })}
              style={({ pressed }) => [
                s.cta,
                pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
              ]}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>Upload</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
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
  row: { flexDirection: "row", alignItems: "center" },

  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // spread evenly
    gap: 12,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    minWidth: 110,
    alignItems: "center",
  },

  uploadBox: {
    backgroundColor: BEIGE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    width: "100%",
  },
  uploadImage: { width: "100%", height: "100%", borderRadius: 24 },

  label: { color: GREEN, fontSize: 12, fontWeight: "700", marginBottom: 6 },

  inputWrap: {},
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
  stepperText: { color: GREEN, fontWeight: "800", fontSize: 16 },

  // Wider Upload button; set to '100%' if you want full-column width
  cta: {
    height: 48,
    width: 240,                 // <— wider
    backgroundColor: ORANGE,
    borderRadius: 999,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});
