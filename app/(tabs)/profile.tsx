// app/(tabs)/profile.tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { signOut } = useAuthActions();

  // Fetch user data
  const user = useQuery(api.users.getCurrentUser);
  const savedJobs = useQuery(api.users.getUserSavedJobs);
  const userComplaints = useQuery(api.users.getUserComplaints);
  const userSkills = useQuery(api.users.getUserSkills);
  const userIndustries = useQuery(api.users.getUserIndustries);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not specified";
    return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
          headerRight: () => (
            <Link href="/profile/edit" asChild>
              <Pressable className="p-2">
                <Ionicons name="create-outline" size={24} color="#3B82F6" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <SafeAreaView
        className="flex-1 bg-gray-50"
        edges={{ top: "additive", bottom: "off" }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header Section */}
          <View className="bg-white px-6 py-8">
            <View className="items-center mb-6">
              {user.image ? (
                <Image
                  source={{ uri: user.image }}
                  className="w-24 h-24 rounded-full bg-gray-200"
                />
              ) : (
                <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center">
                  <Ionicons name="person" size={48} color="#3B82F6" />
                </View>
              )}
              <Text className="text-2xl font-bold text-gray-900 mt-4">
                {user.name}
              </Text>
              {user.headline && (
                <Text className="text-lg text-gray-600 mt-1 text-center">
                  {user.headline}
                </Text>
              )}
              {user.location && (
                <View className="flex-row items-center mt-2">
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text className="text-gray-600 ml-1">{user.location}</Text>
                </View>
              )}
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-around py-4 border-t border-gray-200">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600">
                  {savedJobs?.length || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Saved Jobs</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {userSkills?.length || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Skills</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-purple-600">
                  {userIndustries?.length || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Industries</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600">
                  {userComplaints?.length || 0}
                </Text>
                <Text className="text-gray-600 text-sm">Complaints</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          {user.summary && (
            <View className="bg-white mt-4 px-6 py-6">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                About
              </Text>
              <Text className="text-gray-700 leading-6">{user.summary}</Text>
            </View>
          )}

          {/* Contact Information */}
          <View className="bg-white mt-4 px-6 py-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Contact Information
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <Text className="text-gray-700 ml-3">{user.email}</Text>
              </View>
              {user.phone && (
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">{user.phone}</Text>
                </View>
              )}
              {user.country && (
                <View className="flex-row items-center">
                  <Ionicons name="flag-outline" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-3">{user.country}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Industries Section */}
          <View className="bg-white mt-4 px-6 py-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">
                Industries
              </Text>
              <Link href="/profile/industries" asChild>
                <Pressable>
                  <Text className="text-blue-600 font-medium">Manage</Text>
                </Pressable>
              </Link>
            </View>
            {userIndustries && userIndustries.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {userIndustries.map((industry, index) => (
                  <View
                    key={index}
                    className="bg-purple-100 px-3 py-2 rounded-full"
                  >
                    <Text className="text-purple-800 font-medium">
                      {industry.name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons name="business-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No industries added</Text>
                <Link href="/profile/industries" asChild>
                  <Pressable className="mt-2">
                    <Text className="text-blue-600 font-medium">
                      Add Industries
                    </Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </View>

          {/* Skills Section */}
          <View className="bg-white mt-4 px-6 py-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-900">Skills</Text>
              <Link href="/profile/skills" asChild>
                <Pressable>
                  <Text className="text-blue-600 font-medium">Manage</Text>
                </Pressable>
              </Link>
            </View>
            {userSkills && userSkills.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {userSkills.map((skill, index) => (
                  <View
                    key={index}
                    className="bg-green-100 px-3 py-2 rounded-full"
                  >
                    <Text className="text-green-800 font-medium">
                      {skill.name}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-8">
                <Ionicons name="construct-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No skills added</Text>
                <Link href="/profile/skills" asChild>
                  <Pressable className="mt-2">
                    <Text className="text-blue-600 font-medium">
                      Add Skills
                    </Text>
                  </Pressable>
                </Link>
              </View>
            )}
          </View>

          {/* Saved Jobs Section */}
          {savedJobs && savedJobs.length > 0 && (
            <View className="bg-white mt-4 px-6 py-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">
                  Saved Jobs ({savedJobs.length})
                </Text>
                <Link href="/profile/saved-jobs" asChild>
                  <Pressable>
                    <Text className="text-blue-600 font-medium">View All</Text>
                  </Pressable>
                </Link>
              </View>
              <View className="space-y-4">
                {savedJobs.slice(0, 3).map((job) => (
                  <Link key={job._id} href={`/(job)/${job._id}`} asChild>
                    <Pressable className="border border-gray-200 rounded-lg p-4">
                      <View className="flex-row items-start">
                        <View className="w-12 h-12 rounded-lg items-center justify-center mr-3">
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
                            <Ionicons
                              name="business"
                              size={20}
                              color="#6B7280"
                            />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="font-semibold text-gray-900 mb-1">
                            {job.title}
                          </Text>
                          <Text className="text-gray-600 mb-1">
                            {job.company?.name || "Company"}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {job.location} • {job.type}
                          </Text>
                          {job.salary && (
                            <Text className="text-sm text-green-600 font-medium mt-1">
                              {formatSalary(job.salary)}
                            </Text>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  </Link>
                ))}
              </View>
            </View>
          )}

          {/* Complaints Section */}
          {userComplaints && userComplaints.length > 0 && (
            <View className="bg-white mt-4 px-6 py-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">
                  My Complaints ({userComplaints.length})
                </Text>
                {/* <Link href="/profile/complaints" asChild>
                  <Pressable>
                    <Text className="text-blue-600 font-medium">View All</Text>
                  </Pressable>
                </Link> */}
              </View>
              <View className="space-y-3">
                {userComplaints.slice(0, 3).map((complaint) => (
                  <View
                    key={complaint._id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="font-semibold text-gray-900 flex-1">
                        {complaint.companyName}
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${
                          complaint.status === "pending"
                            ? "bg-yellow-100"
                            : complaint.status === "investigating"
                              ? "bg-blue-100"
                              : complaint.status === "resolved"
                                ? "bg-green-100"
                                : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            complaint.status === "pending"
                              ? "text-yellow-800"
                              : complaint.status === "investigating"
                                ? "text-blue-800"
                                : complaint.status === "resolved"
                                  ? "text-green-800"
                                  : "text-red-800"
                          }`}
                        >
                          {complaint.status.charAt(0).toUpperCase() +
                            complaint.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-600 text-sm" numberOfLines={2}>
                      {complaint.complaintDescription}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-2">
                      Submitted{" "}
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="px-6 py-6">
            <Link href="/profile/edit" asChild>
              <Button className="w-full bg-blue-600 py-4 mb-4">
                <Text className="text-white font-semibold text-lg">
                  Edit Profile
                </Text>
              </Button>
            </Link>

            <Button
              className="w-full bg-orange-600 py-4"
              onPress={() => signOut()}
            >
              <Text className="text-white font-semibold text-lg">Sign Out</Text>
            </Button>
          </View>

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
