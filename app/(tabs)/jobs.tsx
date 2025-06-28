// app/(jobs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export const JobCard = ({
  job,
  formatSalary,
}: {
  job: any;
  formatSalary: (salary: any) => string;
}) => (
  <Link href={`/(job)/${job.id}`} asChild>
    <Pressable className="bg-white rounded-xl p-6 mb-2 border border-gray-200 active:bg-gray-50">
      <View className="flex-row items-start">
        <View className="w-12 h-12 mr-4">
          {job.company?.logo ? (
            <Image
              source={{ uri: job.company.logo }}
              className="w-full h-full rounded-xl bg-gray-200"
              contentFit="contain"
              style={{
                width: "100%",
                flex: 1,
                //   backgroundColor: "#0553",
                // padding: 4,
              }}
            />
          ) : (
            <View className="w-full h-full rounded-xl bg-gray-200 items-center justify-center">
              <Ionicons name="business" size={24} color="#6B7280" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {job.title}
          </Text>
          <Text className="text-blue-600 font-semibold mb-2">
            {job.company?.name || "Company Name"}
          </Text>

          <View className="flex-row items-center mb-3">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-1 text-sm">{job.location}</Text>
            <Text className="text-gray-400 mx-2">•</Text>
            <Text className="text-gray-600 text-sm">{job.type}</Text>
          </View>

          <Text className="text-green-600 font-bold text-base">
            {formatSalary(job.salary)}
          </Text>

          {job.company?.industry && (
            <View className="mt-2">
              <Badge className="self-start">
                <Text className="text-xs">{job.company.industry}</Text>
              </Badge>
            </View>
          )}
        </View>

        <View className="ml-2">
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </View>
      </View>
    </Pressable>
  </Link>
);

export default function JobsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Fetch jobs with pagination - provide default empty array
  const {
    results: allJobs = [],
    status,
    loadMore,
  } = usePaginatedQuery(
    api.jobs.getJobs,
    { paginationOpts: { limit: 20 } },
    { initialNumItems: 20 }
  );

  // Fetch industries with default empty array
  const industriesData = useQuery(api.industries.getIndustries) ?? [];

  // Create industry options with names
  const industries = useMemo(() => {
    try {
      if (!industriesData.length) {
        return ["All"];
      }
      const industryNames = industriesData
        .map((industry) => industry.name)
        .filter(Boolean);
      return ["All", ...industryNames.sort()];
    } catch (error) {
      console.error("Error processing industries:", error);
      return ["All"];
    }
  }, [industriesData]);

  // Create a map for quick industry lookup
  const industryMap = useMemo(() => {
    const map = new Map();
    try {
      industriesData.forEach((industry) => {
        if (industry._id && industry.name) {
          map.set(industry._id, industry.name);
        }
      });
    } catch (error) {
      console.error("Error creating industry map:", error);
    }
    return map;
  }, [industriesData]);

  // Filter jobs based on search query and selected industry
  const filteredJobs = useMemo(() => {
    try {
      return allJobs.filter((job) => {
        const matchesSearch =
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchQuery.toLowerCase());

        // Get the industry name from the industryId
        const jobIndustryName = job.company?.industryId
          ? industryMap.get(job.company.industryId)
          : null;

        const matchesIndustry =
          selectedIndustry === "All" || jobIndustryName === selectedIndustry;

        return matchesSearch && matchesIndustry;
      });
    } catch (error) {
      console.error("Error filtering jobs:", error);
      return [];
    }
  }, [allJobs, searchQuery, selectedIndustry, industryMap]);

  const formatSalary = (salary: any) => {
    try {
      return `$${salary?.min?.toLocaleString() || 0} - $${salary?.max?.toLocaleString() || 0}`;
    } catch (error) {
      return "Salary not specified";
    }
  };

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  };

  // Debug logs
  console.log("Debug info:");
  console.log("Selected industry:", selectedIndustry);
  console.log("Sample job company:", allJobs[0]?.company);
  console.log("All jobs count:", allJobs.length);
  console.log("Filtered jobs count:", filteredJobs.length);

  // Let's also see what industry names we're trying to match
  if (selectedIndustry !== "All") {
    console.log("Looking for jobs in industry:", selectedIndustry);
    allJobs.forEach((job, index) => {
      const jobIndustryName = job.company?.industryId
        ? industryMap.get(job.company.industryId)
        : null;
      console.log(
        `Job ${index}: ${job.title} - Industry: ${jobIndustryName} - Matches: ${jobIndustryName === selectedIndustry}`
      );
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Jobs",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        className="flex-1 bg-gray-50"
        //  edges={{ top: "off" }}
      >
        <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-200">
          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-900"
              placeholder="Search jobs, companies, or locations..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </Pressable>
            )}
          </View>

          {/* Industry Filter Badges */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            <View className="flex-row gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry}
                  onPress={() => {
                    console.log("Pressed industry:", industry);
                    setSelectedIndustry(industry);
                  }}
                  className={
                    selectedIndustry === industry
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }
                  size="sm"
                >
                  <Text
                    className={
                      selectedIndustry === industry
                        ? "text-white"
                        : "text-gray-700"
                    }
                  >
                    {industry}
                  </Text>
                </Button>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Results Header */}
        <View className="px-6 py-3 bg-white">
          <Text className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
            found
            {selectedIndustry !== "All" && ` in ${selectedIndustry}`}
            {searchQuery && ` for "${searchQuery}"`}
          </Text>
        </View>

        {/* Jobs List */}
        <FlatList
          data={filteredJobs}
          renderItem={({ item }) => (
            <JobCard job={item} formatSalary={formatSalary} />
          )}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{
            padding: 12,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            status === "LoadingMore" ? (
              <View className="py-4 items-center">
                <Text className="text-gray-500">Loading more jobs...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-lg font-medium mt-4 mb-2">
                {status === "LoadingFirstPage"
                  ? "Loading jobs..."
                  : "No jobs found"}
              </Text>
              <Text className="text-gray-400 text-center">
                {status === "LoadingFirstPage"
                  ? "Please wait while we fetch the latest jobs"
                  : "Try adjusting your search or filter criteria"}
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}
