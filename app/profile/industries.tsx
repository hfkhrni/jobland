// app/profile/industries.tsx
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function IndustriesScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const allIndustries = useQuery(api.industries.getIndustries);
  const userIndustries = useQuery(api.users.getUserIndustries);
  const addUserIndustry = useMutation(api.users.addUserIndustry);
  const removeUserIndustry = useMutation(api.users.removeUserIndustry);

  const userIndustryIds = userIndustries?.map((industry) => industry._id) || [];

  const filteredIndustries = allIndustries?.filter((industry) =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleIndustry = async (industryId: string, isAdded: boolean) => {
    try {
      if (isAdded) {
        await removeUserIndustry({ industryId: industryId as any });
      } else {
        await addUserIndustry({ industryId: industryId as any });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update industry"
      );
    }
  };

  const renderIndustryItem = ({ item: industry }: { item: any }) => {
    const isAdded = userIndustryIds.includes(industry._id);

    return (
      <Pressable
        className="flex-row items-center justify-between p-4 border-b border-gray-200"
        onPress={() => handleToggleIndustry(industry._id, isAdded)}
      >
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-900">
            {industry.name}
          </Text>
          {industry.description && (
            <Text className="text-gray-600 mt-1">{industry.description}</Text>
          )}
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isAdded ? "bg-gray-600 border-gray-800" : "border-gray-300 bg-white"
          }`}
        >
          {isAdded && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </Pressable>
    );
  };

  if (!allIndustries || !userIndustries) {
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
          title: "Manage Industries",
          headerBackTitle: "Profile",
        }}
      />
      <SafeAreaView
        className="flex-1 bg-white"
        edges={{ top: "off", bottom: "additive" }}
      >
        {/* Search Bar */}
        <View className="px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search industries..."
              className="flex-1 ml-3 text-gray-900"
            />
          </View>
        </View>

        {/* Selected Industries Count */}
        <View className="px-4 py-3 bg-purple-50 border-b border-purple-200">
          <Text className="text-purple-800 font-medium">
            {userIndustries.length} industries selected
          </Text>
        </View>

        {/* Industries List */}
        <FlatList
          data={filteredIndustries}
          renderItem={renderIndustryItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">
                No industries found matching "{searchQuery}"
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}
