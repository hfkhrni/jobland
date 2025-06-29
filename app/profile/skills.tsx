// app/profile/skills.tsx
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Stack } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function SkillsScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const allSkills = useQuery(api.skills.getSkills);
  const userSkills = useQuery(api.users.getUserSkills);
  const addUserSkill = useMutation(api.users.addUserSkill);
  const removeUserSkill = useMutation(api.users.removeUserSkill);

  const userSkillIds = userSkills?.map((skill) => skill._id) || [];

  const filteredSkills = allSkills?.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSkill = async (skillId: string, isAdded: boolean) => {
    try {
      if (isAdded) {
        await removeUserSkill({ skillId: skillId as any });
      } else {
        await addUserSkill({ skillId: skillId as any });
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update skill"
      );
    }
  };

  const renderSkillItem = ({ item: skill }: { item: any }) => {
    const isAdded = userSkillIds.includes(skill._id);

    return (
      <Pressable
        className="flex-row items-center justify-between p-4 border-b border-gray-200"
        onPress={() => handleToggleSkill(skill._id, isAdded)}
      >
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-900">
            {skill.name}
          </Text>
          {skill.description && (
            <Text className="text-gray-600 mt-1">{skill.description}</Text>
          )}
        </View>
        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isAdded
              ? "bg-green-600 border-green-600"
              : "border-gray-300 bg-white"
          }`}
        >
          {isAdded && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </Pressable>
    );
  };

  if (!allSkills || !userSkills) {
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
          title: "Manage Skills",
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
              placeholder="Search skills..."
              className="flex-1 ml-3 text-gray-900"
            />
          </View>
        </View>

        {/* Selected Skills Count */}
        <View className="px-4 py-3 bg-green-50 border-b border-green-200">
          <Text className="text-green-800 font-medium">
            {userSkills.length} skills selected
          </Text>
        </View>

        {/* Skills List */}
        <FlatList
          data={filteredSkills}
          renderItem={renderSkillItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-4 text-center">
                No skills found matching "{searchQuery}"
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}
