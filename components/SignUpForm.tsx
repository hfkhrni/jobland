import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

function BirthdayPicker({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Input
          className="border rounded-full px-3 py-2 mb-4"
          value={value}
          placeholder="YYYY-MM-DD"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Calendar
              current={value || "1990-01-01"}
              onDayPress={(day) => {
                onChange(day.dateString);
                setShow(false);
              }}
              maxDate={new Date().toISOString().split("T")[0]}
              markedDates={
                value
                  ? { [value]: { selected: true, selectedColor: "#2563eb" } }
                  : {}
              }
            />
            <Button
              className="mt-4 bg-blue-600 py-2 rounded-full"
              onPress={() => setShow(false)}
            >
              <Label className="text-white text-center font-semibold">
                Close
              </Label>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

export function SignUpForm() {
  const { signIn } = useAuthActions();

  const router = useRouter();

  const SignUpSchema = z.object({
    name: z.string().min(2, "Name is required (min 2 characters)"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || (/^\d+$/.test(val) && val.length >= 7),
        "Phone must be at least 7 digits"
      ),
    birthday: z.string().min(1, "Birthday is required"),
    type: z.string().min(1, "Type is required"),
    country: z.string().optional(),
  });

  const fieldSchemas = {
    name: SignUpSchema.shape.name,
    email: SignUpSchema.shape.email,
    password: SignUpSchema.shape.password,
    phone: SignUpSchema.shape.phone,
    birthday: SignUpSchema.shape.birthday,
    type: SignUpSchema.shape.type,
    country: SignUpSchema.shape.country,
  };

  // Infer the form type from the schema
  type SignUpFormType = z.infer<typeof SignUpSchema>;

  // Define the error type: each field can be a string or undefined
  type SignUpFormErrors = {
    [K in keyof SignUpFormType]?: string;
  };
  const [form, setForm] = useState<Partial<SignUpFormType>>({
    name: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
    birthday: undefined,
    type: "individual",
    country: undefined,
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const hasErrors = Object.values(errors).some(Boolean);
  const hasEmptyRequired = [
    "name",
    "email",
    "password",
    "birthday",
    "type",
  ].some((key) => !form[key]);
  const disableSubmit = hasErrors || hasEmptyRequired || submitting;

  const validateField = (key, value) => {
    try {
      fieldSchemas[key].parse(value);
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [key]: err.errors?.[0]?.message || "Invalid",
      }));
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  //   const handleChange = (key: string, value: string) => {
  //     setForm((prev) => ({ ...prev, [key]: value }));
  //   };

  // On submit, validate the whole form
  const handleSubmit = async () => {
    const result = SignUpSchema.safeParse(form);
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
        ...form,
        flow: "signUp",
      });
      Toast.show({
        type: "success",
        text1: "Account created successfully!",
      });
      // router.replace("/(protected)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign up failed. Did you mean to sign in?",
      });
    }
    setSubmitting(false);
  };

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
            <Text className="text-3xl font-bold mb-6 text-center">Sign Up</Text>

            <Label className="mb-2">Name</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.name ? "border-red-500" : ""
              )}
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
              placeholder="Your name"
            />
            {errors.name && (
              <Text className="text-xs text-red-500 mb-2">{errors.name}</Text>
            )}

            <Label className="mb-2">Email</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.email ? "border-red-500" : ""
              )}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              placeholder="Enter your email"
            />
            {errors.email && (
              <Text className="text-xs text-red-500 mb-2">{errors.email}</Text>
            )}

            <Label className="mb-2">Password</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.password ? "border-red-500" : ""
              )}
              secureTextEntry
              autoComplete="new-password"
              value={form.password}
              onChangeText={(v) => handleChange("password", v)}
              placeholder="Create a password"
            />
            {/* <Label className="text-xs text-gray-500 mb-1">
              Password must be at least 8 characters.
            </Label> */}
            {errors.password && (
              <Text className="text-xs text-red-500 mb-2">
                {errors.password}
              </Text>
            )}

            <Label className="mb-2">Phone</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.phone ? "border-red-500" : ""
              )}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => handleChange("phone", v)}
              placeholder="Your phone number"
            />
            {errors.phone && (
              <Text className="text-xs text-red-500 mb-2">{errors.phone}</Text>
            )}

            <Label className="mb-2">Birthday</Label>
            <BirthdayPicker
              value={form.birthday}
              onChange={(date) => handleChange("birthday", date)}
              // error={errors.birthday}
            />

            {/* <Label className="mb-2">Type</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.type ? "border-red-500" : ""
              )}
              value={form.type}
              onChangeText={(v) => handleChange("type", v)}
              placeholder="User type"
            /> */}

            <Label className="mb-2">Country (optional)</Label>
            <Input
              className={cn(
                "border rounded-full px-3 py-2 mb-4",
                errors.country ? "border-red-500" : ""
              )}
              value={form.country}
              onChangeText={(v) => handleChange("country", v)}
              placeholder="Country"
            />

            <Button
              className="bg-blue-600 py-3 rounded-full mb-4"
              onPress={handleSubmit}
              disabled={submitting || disableSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Label className="text-white text-center font-semibold">
                  Sign Up
                </Label>
              )}
            </Button>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
              <Label className="text-blue-600 text-center pb-10">
                Already have an account? Sign in
              </Label>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
