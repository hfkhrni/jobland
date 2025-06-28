// // components/JobDetailsDrawer.tsx
// import { Ionicons } from "@expo/vector-icons";
// import React from "react";
// import { Image, ScrollView, View } from "react-native";
// import { Button } from "~/components/ui/button";
// import { Text } from "~/components/ui/text";

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   location: string;
//   type: string;
//   salary: {
//     min: number;
//     max: number;
//     currency: string;
//   };
//   requirements: string[];
//   benefits: string[];
//   postedBy: string;
//   company?: {
//     name: string;
//     logo?: string;
//   };
// }

// interface JobDetailsDrawerProps {
//   job: Job;
// }

// export default function JobDetailsDrawer({ job }: JobDetailsDrawerProps) {
//   const formatSalary = (salary: Job["salary"]) => {
//     return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()}`;
//   };

//   return (
//     <ScrollView
//       className="flex-1 px-6 pb-8"
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header Section */}
//       <View className="mb-6">
//         <View className="flex-row items-start mb-4">
//           {job.company?.logo ? (
//             <Image
//               source={{ uri: job.company.logo }}
//               className="w-16 h-16 rounded-lg bg-gray-200"
//             />
//           ) : (
//             <View className="w-16 h-16 rounded-lg bg-gray-200 items-center justify-center">
//               <Ionicons name="business" size={24} color="#6B7280" />
//             </View>
//           )}
//           <View className="flex-1 ml-4">
//             <Text className="text-2xl font-bold text-gray-900 mb-1">
//               {job.title}
//             </Text>
//             <Text className="text-lg text-blue-600 font-medium mb-1">
//               {job.company?.name || "Company Name"}
//             </Text>
//             <View className="flex-row items-center mb-2">
//               <Ionicons name="location-outline" size={16} color="#6B7280" />
//               <Text className="text-gray-600 ml-1">{job.location}</Text>
//               <Text className="text-gray-400 mx-2">•</Text>
//               <Text className="text-gray-600">{job.type}</Text>
//             </View>
//             <Text className="text-green-600 font-semibold">
//               {formatSalary(job.salary)}
//             </Text>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View className="flex-row gap-3 mb-6">
//           <Button className="flex-1 bg-blue-600">
//             <Text className="text-white font-semibold">Apply Now</Text>
//           </Button>
//           <Button variant="outline" className="px-4">
//             <Ionicons name="bookmark-outline" size={20} color="#3B82F6" />
//           </Button>
//           <Button variant="outline" className="px-4">
//             <Ionicons name="share-outline" size={20} color="#3B82F6" />
//           </Button>
//         </View>
//       </View>

//       {/* Job Description */}
//       <View className="mb-6">
//         <Text className="text-xl font-bold text-gray-900 mb-3">
//           About this job
//         </Text>
//         <Text className="text-gray-700 leading-6">{job.description}</Text>
//       </View>

//       {/* Requirements */}
//       {job.requirements.length > 0 && (
//         <View className="mb-6">
//           <Text className="text-xl font-bold text-gray-900 mb-3">
//             Requirements
//           </Text>
//           {job.requirements.map((requirement, index) => (
//             <View key={index} className="flex-row items-start mb-2">
//               <View className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3" />
//               <Text className="text-gray-700 flex-1">{requirement}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* Benefits */}
//       {job.benefits.length > 0 && (
//         <View className="mb-6">
//           <Text className="text-xl font-bold text-gray-900 mb-3">Benefits</Text>
//           {job.benefits.map((benefit, index) => (
//             <View key={index} className="flex-row items-start mb-2">
//               <Ionicons
//                 name="checkmark-circle"
//                 size={20}
//                 color="#10B981"
//                 style={{ marginTop: 2, marginRight: 12 }}
//               />
//               <Text className="text-gray-700 flex-1">{benefit}</Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* Posted By */}
//       <View className="mb-6">
//         <Text className="text-xl font-bold text-gray-900 mb-3">Posted by</Text>
//         <View className="flex-row items-center">
//           <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
//             <Ionicons name="person" size={20} color="#3B82F6" />
//           </View>
//           <View className="ml-3">
//             <Text className="text-gray-900 font-medium">{job.postedBy}</Text>
//             <Text className="text-gray-600 text-sm">Recruiter</Text>
//           </View>
//         </View>
//       </View>

//       {/* Bottom Action */}
//       <View className="pt-4 border-t border-gray-200">
//         <Button className="w-full bg-blue-600 py-4">
//           <Text className="text-white font-semibold text-lg">Apply Now</Text>
//         </Button>
//       </View>
//     </ScrollView>
//   );
// }
