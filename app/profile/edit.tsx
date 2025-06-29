// app/profile/edit.tsx
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    summary: user?.summary || "",
    location: user?.location || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="p-2">
              <Ionicons name="close" size={24} color="#3B82F6" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleSave}
              disabled={isLoading}
              className="p-2"
            >
              <Text
                className={`font-semibold ${
                  isLoading ? "text-gray-400" : "text-blue-600"
                }`}
              >
                {isLoading ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 px-6 py-6">
            {/* Basic Information */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Basic Information
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Enter your full name"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Professional Headline
                </Text>
                <TextInput
                  value={formData.headline}
                  onChangeText={(text) =>
                    setFormData({ ...formData, headline: text })
                  }
                  placeholder="e.g., Senior Software Engineer at Tech Corp"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Summary
                </Text>
                <TextInput
                  value={formData.summary}
                  onChangeText={(text) =>
                    setFormData({ ...formData, summary: text })
                  }
                  placeholder="Tell us about yourself, your experience, and career goals..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 min-h-[100px]"
                />
              </View>
            </View>

            {/* Contact Information */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </Text>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </Text>
                <TextInput
                  value={user.email}
                  editable={false}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-gray-500 bg-gray-50"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </Text>
                <TextInput
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Location
                </Text>
                <TextInput
                  value={formData.location}
                  onChangeText={(text) =>
                    setFormData({ ...formData, location: text })
                  }
                  placeholder="e.g., New York, NY"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Country
                </Text>
                <TextInput
                  value={formData.country}
                  onChangeText={(text) =>
                    setFormData({ ...formData, country: text })
                  }
                  placeholder="e.g., United States"
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>
            </View>

            {/* Save Button */}
            <Button
              onPress={handleSave}
              disabled={isLoading}
              className={`w-full py-4 ${
                isLoading ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? "Saving..." : "Save Changes"}
              </Text>
            </Button>

            {/* Bottom spacing */}
            <View className="h-8" />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
