// app/job/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch the specific job by ID
  const job = useQuery(api.jobs.getJobById, { jobId: id as any });

  if (!job) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const formatSalary = (salary: typeof job.salary) => {
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: job.title,
          headerBackTitle: "Jobs",
        }}
      />
      <SafeAreaView
        className="flex-1 bg-white"
        edges={{ top: "off", bottom: "additive" }}
      >
        <ScrollView
          className="flex-1 pb-6 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="py-6">
            <View className="flex-row items-start mb-6">
              <View className="w-20">
                {job.company?.logo ? (
                  <Image
                    contentFit="contain"
                    source={{ uri: job.company.logo }}
                    // source="https://picsum.photos/seed/696/3000/2000"
                    // className="rounded-xl bg-gray-200"
                    style={{
                      width: "100%",
                      flex: 1,
                      //   backgroundColor: "#0553",
                      // padding: 4,
                    }}
                  />
                ) : (
                  <View className="w-20 h-20 rounded-xl bg-gray-200 items-center justify-center">
                    <Ionicons name="business" size={32} color="#6B7280" />
                  </View>
                )}
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {job.title}
                </Text>
                <Text className="text-xl text-blue-600 font-semibold mb-2">
                  {job.company?.name || "Company Name"}
                </Text>
                <View className="flex-row items-center mb-3">
                  <Ionicons name="location-outline" size={18} color="#6B7280" />
                  <Text className="text-gray-600 ml-2 text-base">
                    {job.location}
                  </Text>
                  <Text className="text-gray-400 mx-3">•</Text>
                  <Text className="text-gray-600 text-base">{job.type}</Text>
                </View>
                <Text className="text-green-600 font-bold text-lg">
                  {formatSalary(job.salary)}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3 mb-8">
              <Button className="flex-1 bg-blue-600 py-4">
                <Text className="text-white font-semibold text-lg">
                  Apply Now
                </Text>
              </Button>
              <Pressable className="px-4 py-4 border border-gray-300 rounded-lg items-center justify-center">
                <Ionicons name="bookmark-outline" size={24} color="#3B82F6" />
              </Pressable>
              <Pressable className="px-4 py-4 border border-gray-300 rounded-lg items-center justify-center">
                <Ionicons name="share-outline" size={24} color="#3B82F6" />
              </Pressable>
            </View>
          </View>

          {/* Job Description */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              About this job
            </Text>
            <Text className="text-gray-700 leading-7 text-base">
              {job.description}
            </Text>
          </View>

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-4">
                Requirements
              </Text>
              {job.requirements.map((requirement, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <View className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4" />
                  <Text className="text-gray-700 flex-1 text-base leading-6">
                    {requirement}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-4">
                Benefits
              </Text>
              {job.benefits.map((benefit, index) => (
                <View key={index} className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#10B981"
                    style={{ marginTop: 2, marginRight: 16 }}
                  />
                  <Text className="text-gray-700 flex-1 text-base leading-6">
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {job.company && (
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-4">
                About {job.company.name}
              </Text>
              <View className="bg-gray-50 rounded-xl p-6">
                <View className="flex-row items-center mb-4">
                  {job.company.logo ? (
                    <Image
                      source={{ uri: job.company.logo }}
                      className="w-16 h-16 rounded-xl bg-gray-200"
                    />
                  ) : (
                    <View className="w-16 h-16 rounded-xl bg-blue-100 items-center justify-center">
                      <Ionicons name="business" size={32} color="#3B82F6" />
                    </View>
                  )}
                  <View className="ml-4 flex-1">
                    <Text className="text-xl font-bold text-gray-900 mb-1">
                      {job.company.name}
                    </Text>
                    {job.company.industry && (
                      <Text className="text-gray-600 mb-1">
                        {job.company.industry}
                      </Text>
                    )}
                    {job.company.size && (
                      <Text className="text-gray-600">
                        {job.company.size} employees
                      </Text>
                    )}
                  </View>
                </View>

                {job.company.description && (
                  <Text className="text-gray-700 leading-6 mb-4">
                    {job.company.description}
                  </Text>
                )}

                {job.company.website && (
                  <Pressable className="flex-row items-center">
                    <Ionicons name="globe-outline" size={20} color="#3B82F6" />
                    <Text className="text-blue-600 ml-2 font-medium">
                      Visit Company Website
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* Posted By */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              Posted by
            </Text>
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
                <Ionicons name="person" size={24} color="#3B82F6" />
              </View>
              <View className="ml-4">
                <Text className="text-gray-900 font-semibold text-lg">
                  {job.postedBy}
                </Text>
                <Text className="text-gray-600">Recruiter</Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View className="h-20" />
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View className="px-6 py-4 bg-white border-t border-gray-200">
          <Button className="w-full bg-blue-600 py-4">
            <Text className="text-white font-semibold text-lg">Apply Now</Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
}
