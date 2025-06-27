import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "./ui/input";
import { Text } from "./ui/text";

// Zod schema for sign in
const SignInSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormType = z.infer<typeof SignInSchema>;
type SignInFormErrors = {
  [K in keyof SignInFormType]?: string;
};

export function SignInForm() {
  const { signIn, signOut } = useAuthActions();
  const [form, setForm] = useState<Partial<SignInFormType>>({
    email: undefined,
    password: undefined,
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Validate a single field on change
  const validateField = (key: keyof SignInFormType, value: any) => {
    try {
      if (value === undefined) throw new Error("This field is required");
      SignInSchema.shape[key].parse(value);
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        [key]: err.errors?.[0]?.message || err.message || "Invalid",
      }));
    }
  };

  const handleChange = (key: keyof SignInFormType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  // On submit, validate the whole form
  const handleSubmit = async () => {
    const result = SignInSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0],
        ])
      );
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await signIn("password", {
        email: form.email,
        password: form.password,
        flow: "signIn",
      });
      router.replace("/");
      Toast.show({
        type: "success",
        text1: "Signed in successfully!",
      });
      // router.replace("/(protected)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign in failed. Please check your credentials.",
      });
    }
    setSubmitting(false);
  };

  // Disable submit if errors or required fields are empty/undefined
  const hasErrors = Object.values(errors).some(Boolean);
  const hasEmptyRequired = ["email", "password"].some((key) => !form[key]);
  const disableSubmit = hasErrors || hasEmptyRequired || submitting;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 px-6 bg-white"
            contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Label className="text-2xl font-bold mb-6 text-center">
              Sign In
            </Label>

            <Label className="mb-2">Email</Label>
            <Input
              className={`border rounded-full px-3 py-2 mb-1 ${
                errors.email ? "border-red-500" : ""
              }`}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              placeholder="Enter your email"
            />
            {errors.email && (
              <Label className="text-xs text-red-500 mb-2">
                {errors.email}
              </Label>
            )}

            <Label className="mb-2">Password</Label>
            <Input
              className={`border rounded-full px-3 py-2 mb-1 ${
                errors.password ? "border-red-500" : ""
              }`}
              secureTextEntry
              autoComplete="current-password"
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              placeholder="Your password"
            />
            <Label className="text-xs text-gray-500 mb-2">
              Password must be at least 8 characters.
            </Label>
            {errors.password && (
              <Label className="text-xs text-red-500 mb-2">
                {errors.password}
              </Label>
            )}

            <Button
              className="bg-blue-600 py-3 rounded-full mb-4"
              onPress={handleSubmit}
              disabled={disableSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Label className="text-white text-center font-semibold">
                  Sign In
                </Label>
              )}
            </Button>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-blue-600 text-center pb-10">
                Don't have an account? Sign up
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
