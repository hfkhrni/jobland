// app/profile/saved-jobs.tsx
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function SavedJobsScreen() {
  const savedJobs = useQuery(api.users.getUserSavedJobs);

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not specified";
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  const renderJobItem = ({ item: job }: { item: any }) => (
    <Link href={`/(job)/${job._id}`} asChild>
      <Pressable className="bg-white mx-4 mb-4 rounded-lg border border-gray-200 p-4">
        <View className="flex-row items-start">
          <View className="w-12 h-12 rounded-lg items-center justify-center mr-4">
            {job.company?.logo ? (
              <View className="flex w-12 h-12">
                <Image
                  contentFit="contain"
                  source={{ uri: job.company.logo }}
                  style={{
                    width: "100%",
                    flex: 1,
                  }}
                />
              </View>
            ) : (
              <Ionicons name="business" size={24} color="#6B7280" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              {job.title}
            </Text>
            <Text className="text-blue-600 font-medium mb-2">
              {job.company?.name || "Company"}
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-1 mr-3">{job.location}</Text>
              <Text className="text-gray-400">•</Text>
              <Text className="text-gray-600 ml-3">{job.type}</Text>
            </View>
            {job.salary && (
              <Text className="text-green-600 font-semibold mb-2">
                {formatSalary(job.salary)}
              </Text>
            )}
            <Text className="text-gray-500 text-sm">
              Saved {new Date(job.savedAt).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons name="bookmark" size={20} color="#10B981" />
        </View>
      </Pressable>
    </Link>
  );

  if (!savedJobs) {
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
          title: "Saved Jobs",
          headerBackTitle: "Profile",
        }}
      />
      <SafeAreaView
        className="flex-1 bg-gray-50"
        edges={{ top: "off", bottom: "additive" }}
      >
        {savedJobs.length === 0 ? (
          <View className="flex-1 justify-center items-center px-6">
            <Ionicons name="bookmark-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              No Saved Jobs
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Start saving jobs you're interested in to view them here.
            </Text>
            <Link href="/(tabs)" asChild>
              <Pressable className="bg-blue-600 px-6 py-3 rounded-lg">
                <Text className="text-white font-semibold">Browse Jobs</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <FlatList
            data={savedJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}
