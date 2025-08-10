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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackHeader from "../../components/BackHeader";
import { CURRENT_USER_ID, threadTitleFromId } from "../../lib/chat";

const GREEN = "#0F4D3A";
const MAX_W = 520;

type Msg = { id: string; from: string; text: string };

const SAMPLE: Msg[] = [
  { id: "1", from: "u_otti", text: "Hi there!" },
  { id: "2", from: CURRENT_USER_ID, text: "Hello! How can I help?" },
];

export default function ChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();

  const containerW = Math.min(width, MAX_W);
  const CONTENT_W = Math.min(containerW - 32, 420);

  const title = useMemo(
    () => threadTitleFromId(id ?? "", CURRENT_USER_ID),
    [id]
  );

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

  // iOS will lift the bottom bar from the safe-area bottom
  const KEYBOARD_OFFSET = inset.bottom;

  // Height of the compact input row
  const INPUT_H = 44;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={{ flex: 1, backgroundColor: "#fff", alignItems: "center" }}
      keyboardVerticalOffset={KEYBOARD_OFFSET}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        {/* Header */}
        <View style={s.headerWrap}>
          <View style={[s.inner, { width: CONTENT_W }]}>
            <BackHeader title={title} backTo="/(main)/messages" />
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingTop: 8,
            // Leave space for the compact input + safe area
            paddingBottom: inset.bottom + INPUT_H + 12,
            alignItems: "center",
          }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
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

        {/* Bottom input (compact with inline send), pinned to safe-area bottom */}
        <View
          style={[
            s.toolbar,
            Platform.OS === "web" && { position: "fixed", left: 0, right: 0 }, // keep flush on web
            { paddingBottom: inset.bottom },
          ]}
        >
          <View style={[s.inner, { width: CONTENT_W }]}>
            <View style={s.inputInlineWrap}>
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor="#7c9c92"
                style={s.inputInline}
                value={text}
                onChangeText={setText}
                returnKeyType="send"
                onSubmitEditing={onSend}
              />
              <Pressable onPress={onSend} style={s.inlineSend}>
                <Ionicons name="send" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  headerWrap: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  inner: { alignSelf: "center" },

  // message bubbles
  bubble: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 16, maxWidth: "80%" },
  me: { backgroundColor: GREEN },
  them: { backgroundColor: "#EAF5F0" },
  text: { color: GREEN },

  // bottom bar container
  toolbar: {
    position: "absolute", // becomes 'fixed' on web via JSX
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEF1EE",
    paddingTop: 8,
    // no fixed height; the compact input dictates the height
  },

  // compact inline input + send button
  inputInlineWrap: {
    position: "relative",
    height: 44,
    justifyContent: "center",
  },
  inputInline: {
    height: 44,
    borderWidth: 2,
    borderColor: GREEN,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 48, // room for send button
    color: GREEN,
    backgroundColor: "#fff",
  },
  inlineSend: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
});
