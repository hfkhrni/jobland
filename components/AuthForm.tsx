// components/AuthForm.tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Input } from "./ui/input";

export function AuthForm({ mode }: { mode: "signIn" | "signUp" }) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signIn("password", { email, password, flow: mode });
      // Navigate to your main app screen after auth
      // router.replace("/(protected)/home");
    } catch (error: any) {
      const showToast = () => {
        Toast.show({
          type: "error",
          text1:
            mode === "signIn"
              ? "Sign in failed. Did you mean to sign up?"
              : "Sign up failed. Did you mean to sign in?",
          // text2: "This is some something 👋",
        });
      };
    }
    setSubmitting(false);
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </Text>
      <Text className="mb-2">Email</Text>
      <Input
        className="border rounded px-3 py-2 mb-4"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
      />
      <Text className="mb-2">Password</Text>
      <Input
        className="border rounded px-3 py-2 mb-4"
        secureTextEntry
        autoComplete={mode === "signIn" ? "password" : "new-password"}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
      />
      {mode === "signUp" && (
        <Text className="text-xs text-gray-500 mb-4">
          Password must be at least 8 characters.
        </Text>
      )}
      <Button
        className="bg-blue-600 py-3 rounded mb-4"
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">
            {mode === "signIn" ? "Sign In" : "Sign Up"}
          </Text>
        )}
      </Button>
      {mode === "signIn" ? (
        // <TouchableOpacity onPress={() => router.replace("/signup")}>
        <TouchableOpacity>
          <Text className="text-blue-600 text-center">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      ) : (
        // <TouchableOpacity onPress={() => router.replace("/signin")}>
        <TouchableOpacity>
          <Text className="text-blue-600 text-center">
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
