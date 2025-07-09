import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { cn } from "~/lib/utils";

const ComplaintSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  employerDetails: z.string().min(2, "Employer details are required"),
  companyName: z.string().min(2, "Company name is required"),
  companyAddress: z.string().min(5, "Company address is required"),
  companyContact: z.string().optional(),
  evidenceDescription: z
    .string()
    .min(10, "Evidence description must be at least 10 characters"),
  complaintDescription: z
    .string()
    .min(20, "Complaint description must be at least 20 characters"),
});

type ComplaintFormType = z.infer<typeof ComplaintSchema>;
type ComplaintFormErrors = {
  [K in keyof ComplaintFormType]?: string;
};

interface UploadedFile {
  id: string;
  name: string;
  type: "image" | "document";
  uri: string;
  size?: number;
  uploading?: boolean;
  storageId?: Id<"_storage">;
}

export default function ComplaintForm() {
  const [form, setForm] = useState<Partial<ComplaintFormType>>({
    fullName: "",
    email: "",
    phoneNumber: "",
    employerDetails: "",
    companyName: "",
    companyAddress: "",
    companyContact: "",
    evidenceDescription: "",
    complaintDescription: "",
  });

  const [errors, setErrors] = useState<ComplaintFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Convex mutations
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const submitComplaint = useMutation(api.complaints.submitComplaint);

  const fieldSchemas = {
    fullName: ComplaintSchema.shape.fullName,
    email: ComplaintSchema.shape.email,
    phoneNumber: ComplaintSchema.shape.phoneNumber,
    employerDetails: ComplaintSchema.shape.employerDetails,
    companyName: ComplaintSchema.shape.companyName,
    companyAddress: ComplaintSchema.shape.companyAddress,
    companyContact: ComplaintSchema.shape.companyContact,
    evidenceDescription: ComplaintSchema.shape.evidenceDescription,
    complaintDescription: ComplaintSchema.shape.complaintDescription,
  };

  const validateField = (key: keyof ComplaintFormType, value: string) => {
    try {
      fieldSchemas[key].parse(value);
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        [key]: err.errors?.[0]?.message || "Invalid",
      }));
    }
  };

  const handleChange = (key: keyof ComplaintFormType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  // File upload helper function
  const uploadFileToConvex = async (
    file: UploadedFile
  ): Promise<Id<"_storage">> => {
    try {
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Read file as blob for React Native
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Upload to Convex
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": blob.type || "application/octet-stream",
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const result = await uploadResponse.json();
      return result.storageId as Id<"_storage">; // Cast to proper type
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("Failed to upload file");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
          id: `img_${Date.now()}_${index}`,
          name: asset.fileName || `image_${Date.now()}_${index}.jpg`,
          type: "image" as const,
          uri: asset.uri,
          size: asset.fileSize,
          uploading: false,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Upload files immediately after selection
        uploadFilesInBackground(newFiles);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
      });

      if (!result.canceled) {
        const newFiles: UploadedFile[] = result.assets.map((asset, index) => ({
          id: `doc_${Date.now()}_${index}`,
          name: asset.name,
          type: "document" as const,
          uri: asset.uri,
          size: asset.size,
          uploading: false,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);

        // Upload files immediately after selection
        uploadFilesInBackground(newFiles);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // Upload files in background
  const uploadFilesInBackground = async (files: UploadedFile[]) => {
    for (const file of files) {
      try {
        // Mark file as uploading
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, uploading: true } : f))
        );

        // Upload file - this now returns Id<"_storage">
        const storageId = await uploadFileToConvex(file);

        // Update file with storage ID
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, uploading: false, storageId } : f
          )
        );
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);

        // Mark upload as failed
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, uploading: false } : f))
        );

        Alert.alert(
          "Upload Failed",
          `Failed to upload ${file.name}. Please try again.`
        );
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const requiredFields: (keyof ComplaintFormType)[] = [
    "fullName",
    "email",
    "phoneNumber",
    "employerDetails",
    "companyName",
    "companyAddress",
    "evidenceDescription",
    "complaintDescription",
  ];
  const hasEmptyRequired = requiredFields.some((key) => !form[key]?.trim());
  const hasUploadingFiles = uploadedFiles.some((file) => file.uploading);
  const disableSubmit =
    hasErrors || hasEmptyRequired || submitting || hasUploadingFiles;

  const handleSubmit = async () => {
    const result = ComplaintSchema.safeParse(form);
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

    // Check if any files failed to upload
    const failedUploads = uploadedFiles.filter(
      (file) => !file.uploading && !file.storageId
    );
    if (failedUploads.length > 0) {
      Alert.alert(
        "Upload Error",
        "Some files failed to upload. Please remove them or try uploading again."
      );
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      // Prepare attachments with storage IDs
      const attachments = uploadedFiles
        .filter((file) => file.storageId)
        .map((file) => ({
          id: file.id,
          name: file.name,
          type: file.type,
          storageId: file.storageId!,
          size: file.size,
        }));

      // Submit complaint
      const complaintId = await submitComplaint({
        fullName: result.data.fullName,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber,
        employerDetails: result.data.employerDetails,
        companyName: result.data.companyName,
        companyAddress: result.data.companyAddress,
        companyContact: result.data.companyContact,
        complaintDescription: result.data.complaintDescription,
        evidenceDescription: result.data.evidenceDescription,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      Alert.alert("Success", "Complaint submitted successfully!");

      // Reset form
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        employerDetails: "",
        companyName: "",
        companyAddress: "",
        companyContact: "",
        evidenceDescription: "",
        complaintDescription: "",
      });
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Complaints",
          headerLargeTitle: true,
        }}
      />
      <SafeAreaView
        className="flex-1 bg-gray-50"
        edges={{ bottom: "additive" }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View className="bg-white px-6 py-6 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Submit Complaint
                </Text>
                <Text className="text-gray-600">
                  Please provide detailed information about your complaint
                </Text>
              </View>

              <View className="px-4 py-6">
                {/* Personal Information Section */}
                <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Personal Information
                  </Text>

                  <Label className="text-gray-700 font-medium mb-2">
                    Full Name *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    )}
                    value={form.fullName}
                    onChangeText={(v) => handleChange("fullName", v)}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.fullName}
                    </Text>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Email Address *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.email ? "border-red-500" : "border-gray-200"
                    )}
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    value={form.email}
                    onChangeText={(v) => handleChange("email", v)}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.email}
                    </Text>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Phone Number *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.phoneNumber ? "border-red-500" : "border-gray-200"
                    )}
                    keyboardType="phone-pad"
                    value={form.phoneNumber}
                    onChangeText={(v) => handleChange("phoneNumber", v)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.phoneNumber}
                    </Text>
                  )}
                </View>

                {/* Company Information Section */}
                <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Company Information
                  </Text>

                  <Label className="text-gray-700 font-medium mb-2">
                    Your Role/Position *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.employerDetails
                        ? "border-red-500"
                        : "border-gray-200"
                    )}
                    value={form.employerDetails}
                    onChangeText={(v) => handleChange("employerDetails", v)}
                    placeholder="e.g., Software Engineer, Manager, etc."
                  />
                  {errors.employerDetails && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.employerDetails}
                    </Text>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Company Name *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.companyName ? "border-red-500" : "border-gray-200"
                    )}
                    value={form.companyName}
                    onChangeText={(v) => handleChange("companyName", v)}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.companyName}
                    </Text>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Company Address *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.companyAddress
                        ? "border-red-500"
                        : "border-gray-200"
                    )}
                    value={form.companyAddress}
                    onChangeText={(v) => handleChange("companyAddress", v)}
                    placeholder="Enter complete company address"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                  {errors.companyAddress && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.companyAddress}
                    </Text>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Company Contact (Optional)
                  </Label>
                  <Input
                    className="border rounded-xl px-4 py-3 mb-1 bg-gray-50 border-gray-200"
                    value={form.companyContact}
                    onChangeText={(v) => handleChange("companyContact", v)}
                    placeholder="HR contact, supervisor, etc."
                  />
                </View>

                {/* Supporting Evidence Section */}
                <View className="bg-white rounded-xl p-6 mb-4 border border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Supporting Evidence
                  </Text>

                  <View className="flex-row gap-3 mb-4">
                    <Button
                      onPress={pickImage}
                      className="flex-1 bg-blue-50 border border-blue-200 py-3 rounded-xl"
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons
                          name="image-outline"
                          size={20}
                          color="#2563eb"
                        />
                        <Text className="text-blue-600 font-medium ml-2">
                          Add Images
                        </Text>
                      </View>
                    </Button>

                    <Button
                      onPress={pickDocument}
                      className="flex-1 bg-green-50 border border-green-200 py-3 rounded-xl"
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons
                          name="document-outline"
                          size={20}
                          color="#059669"
                        />
                        <Text className="text-green-600 font-medium ml-2">
                          Add Files
                        </Text>
                      </View>
                    </Button>
                  </View>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded Files ({uploadedFiles.length})
                      </Text>
                      {uploadedFiles.map((file) => (
                        <View
                          key={file.id}
                          className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3 mb-2"
                        >
                          <View className="flex-row items-center flex-1">
                            <Ionicons
                              name={
                                file.type === "image"
                                  ? "image-outline"
                                  : "document-outline"
                              }
                              size={20}
                              color="#6B7280"
                            />
                            <View className="ml-3 flex-1">
                              <Text
                                className="text-sm font-medium text-gray-900"
                                numberOfLines={1}
                              >
                                {file.name}
                              </Text>
                              <View className="flex-row items-center">
                                {file.size && (
                                  <Text className="text-xs text-gray-500">
                                    {formatFileSize(file.size)}
                                  </Text>
                                )}
                                {file.uploading && (
                                  <Text className="text-xs text-blue-500 ml-2">
                                    Uploading...
                                  </Text>
                                )}
                                {!file.uploading && file.storageId && (
                                  <Text className="text-xs text-green-500 ml-2">
                                    ✓ Uploaded
                                  </Text>
                                )}
                                {!file.uploading && !file.storageId && (
                                  <Text className="text-xs text-red-500 ml-2">
                                    ✗ Failed
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                          <View className="flex-row items-center">
                            {file.uploading && (
                              <ActivityIndicator
                                size="small"
                                color="#2563eb"
                                style={{ marginRight: 8 }}
                              />
                            )}
                            <TouchableOpacity
                              onPress={() => removeFile(file.id)}
                              className="p-1"
                            >
                              <Ionicons
                                name="close-circle"
                                size={20}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  <Label className="text-gray-700 font-medium mb-2">
                    Evidence Description *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50",
                      errors.evidenceDescription
                        ? "border-red-500"
                        : "border-gray-200"
                    )}
                    value={form.evidenceDescription}
                    onChangeText={(v) => handleChange("evidenceDescription", v)}
                    placeholder="Describe the evidence you've provided..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  {errors.evidenceDescription && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.evidenceDescription}
                    </Text>
                  )}
                </View>

                {/* Complaint Details Section */}
                <View className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Complaint Details
                  </Text>

                  <Label className="text-gray-700 font-medium mb-2">
                    Detailed Description *
                  </Label>
                  <Input
                    className={cn(
                      "border rounded-xl px-4 py-3 mb-1 bg-gray-50 h-20",
                      errors.complaintDescription
                        ? "border-red-500"
                        : "border-gray-200"
                    )}
                    value={form.complaintDescription}
                    onChangeText={(v) =>
                      handleChange("complaintDescription", v)
                    }
                    placeholder="Please provide a detailed description of your complaint, including dates, incidents, and any relevant context..."
                    multiline
                    numberOfLines={16}
                    textAlignVertical="top"
                  />
                  {errors.complaintDescription && (
                    <Text className="text-xs text-red-500 mb-3">
                      {errors.complaintDescription}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <Button
                  className={cn(
                    "py-4 rounded-xl mb-4",
                    disableSubmit ? "bg-gray-300" : "bg-blue-600"
                  )}
                  onPress={handleSubmit}
                  disabled={disableSubmit}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-center font-semibold text-lg">
                      {hasUploadingFiles
                        ? "Uploading Files..."
                        : "Submit Complaint"}
                    </Text>
                  )}
                </Button>

                <Text className="text-xs text-gray-500 text-center leading-4">
                  By submitting this complaint, you confirm that the information
                  provided is accurate and complete to the best of your
                  knowledge.
                </Text>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
