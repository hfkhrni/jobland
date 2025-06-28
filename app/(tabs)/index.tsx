import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ParallaxScrollView from "~/components/ParallaxScrollView";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { JobCard } from "./jobs";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const {
    results: jobs,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.jobs.getJobs,
    { paginationOpts: { limit: 5 } }, // Show fewer jobs on home screen
    { initialNumItems: 5 }
  );

  const theme = NAV_THEME[colorScheme];
  const bg = theme.background;
  const cardBg = theme.card;
  const primary = theme.primary;
  const textColor = theme.text;

  const handleJobPress = (jobId: string) => {
    router.navigate({
      pathname: "/(job)/[id]",
      params: { id: jobId },
    });
  };

  const handleViewAllJobs = () => {
    router.navigate("/(tabs)/jobs");
  };

  const formatSalary = (salary: any) => {
    if (!salary) return null;
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={{ bottom: "off", top: "additive", left: "off", right: "off" }}
    >
      <ParallaxScrollView
        headerBackground={require("~/assets/images/image.png")}
        headerOverlay={
          <View style={{ padding: 16 }}>
            <Button>
              <Text>Submit a complaint</Text>
            </Button>
          </View>
        }
      >
        <View className="w-full flex-col px-4">
          {/* Jobs Section Header */}
          <View className="flex-row items-center justify-between mb-6 mt-4">
            <Text className="text-3xl font-bold text-gray-900">
              Recent Jobs
            </Text>
            <Pressable
              onPress={handleViewAllJobs}
              className="flex-row items-center px-4 py-2 bg-blue-50 rounded-full"
            >
              <Text className="text-blue-600 font-semibold mr-1">View All</Text>
              <Ionicons name="arrow-forward" size={16} color="#2563EB" />
            </Pressable>
          </View>

          {/* Jobs List */}
          <View className="space-y-4">
            {jobs?.map((job, index) => (
              <JobCard job={job} key={index} formatSalary={formatSalary} />
            ))}
          </View>
          {/* 
          <Pressable className="p-2 -mr-2 -mt-2">
                    <Ionicons
                      name="bookmark-outline"
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable> */}
          {/* Load More Button */}
          {status === "CanLoadMore" && (
            <View className="mt-6 mb-4">
              <Pressable
                onPress={() => loadMore(5)}
                className="py-4 px-6 rounded-xl bg-gray-50 border border-gray-200"
              >
                <Text className="text-center text-gray-700 font-semibold">
                  Load More Jobs
                </Text>
              </Pressable>
            </View>
          )}

          {/* View All Jobs Button */}
          <View className="mt-6 mb-8">
            <Button
              onPress={handleViewAllJobs}
              className="w-full bg-blue-600 py-4 rounded-xl"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-semibold text-lg mr-2">
                  Browse All Jobs
                </Text>
                <Ionicons name="briefcase-outline" size={20} color="white" />
              </View>
            </Button>
          </View>

          {/* Quick Stats */}
          <View className="bg-blue-50 rounded-xl p-6 mb-8">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {jobs?.length || 0}+
                </Text>
                <Text className="text-gray-600">Jobs Available</Text>
              </View>
              <View className="bg-blue-100 p-3 rounded-full">
                <Ionicons name="trending-up" size={24} color="#2563EB" />
              </View>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  jobCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
