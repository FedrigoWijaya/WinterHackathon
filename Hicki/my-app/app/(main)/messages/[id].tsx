// app/(main)/messages/[id].tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BackHeader from "../../components/BackHeader";
import { useLocalSearchParams } from "expo-router";
import { CURRENT_USER_ID, threadTitleFromId } from "../../lib/chat";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GREEN = "#0F4D3A";
const MAX_W = 520;
const TOOLBAR_H = 58;

type Msg = { id: string; from: string; text: string };

const SAMPLE: Msg[] = [
  { id: "1", from: "u_otti_cafe", text: "Hi there!" },
  { id: "2", from: CURRENT_USER_ID, text: "Hello! How can I help?" },
];

export default function ChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420);

  const title = useMemo(() => threadTitleFromId(id ?? "", CURRENT_USER_ID), [id]);

  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(SAMPLE);
  const scrollRef = useRef<ScrollView>(null);

  const onSend = () => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: String(m.length + 1), from: CURRENT_USER_ID, text: t }]);
    setText("");
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      // offset by top inset so the header doesn't get pushed too much on iOS
      keyboardVerticalOffset={inset.top}
      style={s.screen}
    >
      {/* IMPORTANT: this wrapper must be flex:1 so the toolbar anchors to the screen bottom */}
      <View style={s.root}>
        {/* Header */}
        <View style={s.headerWrap}>
          <View style={[s.inner, { width: CONTENT_W }]}>
            <BackHeader title={title} backTo="/(main)/messages" />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={s.scroller}
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 8,
            // leave space so last bubble isn't hidden under the toolbar
            paddingBottom: inset.bottom + TOOLBAR_H + 8,
          }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.inner, { width: CONTENT_W }]}>
            <View style={{ gap: 10 }}>
              {msgs.map((m) => {
                const fromMe = m.from === CURRENT_USER_ID;
                return (
                  <View
                    key={m.id}
                    style={[
                      s.bubble,
                      fromMe ? s.me : s.them,
                      { alignSelf: fromMe ? "flex-end" : "flex-start" },
                    ]}
                  >
                    <Text style={[s.text, fromMe && { color: "#fff" }]}>{m.text}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Composer pinned at the very bottom */}
        <View style={[s.toolbar, { paddingBottom: inset.bottom }]}>
          <View style={[s.inner, { width: CONTENT_W, flexDirection: "row", gap: 10 }]}>
            <View style={s.inputWrap}>
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor="#7c9c92"
                style={s.input}
                value={text}
                onChangeText={setText}
                returnKeyType="send"
                onSubmitEditing={onSend}
              />
            </View>
            <Pressable onPress={onSend} style={s.sendFab}>
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  // fills screen → absolute toolbar uses this as anchor
  root: { flex: 1, width: "100%", alignItems: "center" },

  headerWrap: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    width: "100%",
    alignItems: "center",
  },
  scroller: { flex: 1, width: "100%" },

  inner: { alignSelf: "center" },

  bubble: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, maxWidth: "80%" },
  me: { backgroundColor: GREEN },
  them: { backgroundColor: "#EAF5F0" },
  text: { color: GREEN },

  toolbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEF1EE",
    paddingTop: 8,
    height: TOOLBAR_H,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: { color: GREEN, paddingVertical: 0 },
  sendFab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
});
