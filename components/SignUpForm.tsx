import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { cn } from "~/lib/utils";

// Types
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface Industry {
  _id: Id<"industries">;
  name: string;
  description?: string;
}

interface Skill {
  _id: Id<"skills">;
  name: string;
  description?: string;
}

type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  birthday: string;
  type: string;
  country?: string;
  industries?: string[];
  skills?: string[];
};

type SignUpFormErrors = {
  [K in keyof SignUpFormType]?: string;
};

// Static country data
const COUNTRIES: Country[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
];

// Component Props Types
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface CountryPickerProps {
  selectedCountry: Country | undefined;
  onSelect: (country: Country) => void;
}

interface PhoneCountryInputProps {
  phone: string | undefined;
  country: string | undefined;
  onPhoneChange: (phone: string) => void;
  onCountryChange: (country: string) => void;
  error?: string;
}

interface BirthdayPickerProps {
  value: string | undefined;
  onChange: (date: string) => void;
}

interface IndustriesSelectorProps {
  selectedIndustries: string[];
  onSelectionChange: (industries: string[]) => void;
}

interface SkillsSelectorProps {
  selectedSkills: string[];
  onSelectionChange: (skills: string[]) => void;
}

interface BasicInfoStepProps {
  form: Partial<SignUpFormType>;
  errors: SignUpFormErrors;
  handleChange: (key: keyof SignUpFormType, value: any) => void;
}

interface ContactInfoStepProps {
  form: Partial<SignUpFormType>;
  errors: SignUpFormErrors;
  handleChange: (key: keyof SignUpFormType, value: any) => void;
}

interface ProfessionalProfileStepProps {
  form: Partial<SignUpFormType>;
  handleChange: (key: keyof SignUpFormType, value: any) => void;
}

interface ReviewStepProps {
  form: Partial<SignUpFormType>;
}

// Step Progress Indicator
function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="flex-row justify-center items-center mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              index < currentStep
                ? "bg-blue-600"
                : index === currentStep
                  ? "bg-blue-600"
                  : "bg-gray-300"
            }`}
          >
            {index < currentStep ? (
              <Ionicons name="checkmark" size={16} color="white" />
            ) : (
              <Text
                className={`text-sm font-semibold ${
                  index === currentStep ? "text-white" : "text-gray-600"
                }`}
              >
                {index + 1}
              </Text>
            )}
          </View>
          {index < totalSteps - 1 && (
            <View
              className={`w-8 h-0.5 ${
                index < currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

function CountryPicker({ selectedCountry, onSelect }: CountryPickerProps) {
  const [show, setShow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery)
  );

  const handleSelect = (country: Country): void => {
    onSelect(country);
    setShow(false);
    setSearchQuery("");
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 9999,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          minWidth: 80,
        }}
      >
        <Text style={{ fontSize: 16 }}>
          {selectedCountry?.flag || "🌍"} {selectedCountry?.dialCode || "+1"}
        </Text>
      </TouchableOpacity>

      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              width: "90%",
              maxWidth: 400,
              maxHeight: "80%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Select Country
            </Text>

            <Input
              className="border rounded-full px-3 py-2 mb-4"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search countries..."
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f4f6",
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 12 }}>
                    {item.flag}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      {item.name}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: "#6b7280" }}>
                    {item.dialCode}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />

            <Button
              className="mt-4 bg-blue-600 py-2 rounded-full"
              onPress={() => setShow(false)}
            >
              <Label className="text-white text-center font-semibold">
                Close
              </Label>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

function PhoneCountryInput({
  phone,
  country,
  onPhoneChange,
  onCountryChange,
  error,
}: PhoneCountryInputProps) {
  const selectedCountry =
    COUNTRIES.find((c) => c.code === country) || COUNTRIES[0];

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <CountryPicker
          selectedCountry={selectedCountry}
          onSelect={(country: Country) => onCountryChange(country.code)}
        />
        <Input
          className={cn(
            "border rounded-full px-3 py-2 flex-1",
            error ? "border-red-500" : ""
          )}
          keyboardType="phone-pad"
          value={phone || ""}
          onChangeText={onPhoneChange}
          placeholder="Phone number"
        />
      </View>
      {error && <Text className="text-xs text-red-500 mb-2">{error}</Text>}
    </View>
  );
}

function BirthdayPicker({ value, onChange }: BirthdayPickerProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Input
          className="border rounded-full px-3 py-2 mb-4"
          value={value || ""}
          placeholder="YYYY-MM-DD"
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Calendar
              current={value || "1990-01-01"}
              onDayPress={(day) => {
                onChange(day.dateString);
                setShow(false);
              }}
              maxDate={new Date().toISOString().split("T")[0]}
              markedDates={
                value
                  ? { [value]: { selected: true, selectedColor: "#2563eb" } }
                  : {}
              }
            />
            <Button
              className="mt-4 bg-blue-600 py-2 rounded-full"
              onPress={() => setShow(false)}
            >
              <Label className="text-white text-center font-semibold">
                Close
              </Label>
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

function IndustriesSelector({
  selectedIndustries,
  onSelectionChange,
}: IndustriesSelectorProps) {
  const [show, setShow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const allIndustries = useQuery(api.industries.getIndustries);

  const filteredIndustries = allIndustries?.filter((industry: Industry) =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleIndustry = (industryId: string): void => {
    const isSelected = selectedIndustries.includes(industryId);
    if (isSelected) {
      onSelectionChange(selectedIndustries.filter((id) => id !== industryId));
    } else {
      onSelectionChange([...selectedIndustries, industryId]);
    }
  };

  const renderIndustryItem = ({ item: industry }: { item: Industry }) => {
    const isSelected = selectedIndustries.includes(industry._id);

    return (
      <Pressable
        className="flex-row items-center justify-between p-4 border-b border-gray-200"
        onPress={() => handleToggleIndustry(industry._id)}
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
            isSelected
              ? "bg-gray-600 border-gray-800"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 9999,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: "white",
          minHeight: 48,
        }}
      >
        <Text style={{ fontSize: 16, color: "#6b7280" }}>
          {selectedIndustries.length > 0
            ? `${selectedIndustries.length} industries selected`
            : "Select industries"}
        </Text>
      </TouchableOpacity>

      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              width: "95%",
              maxWidth: 400,
              maxHeight: "95%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Select Industries
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#6B7280" />
              <Input
                className="flex-1 ml-3 text-gray-900 border-0 bg-transparent"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search industries..."
              />
            </View>

            <View className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg mb-4">
              <Text className="text-purple-800 font-medium">
                {selectedIndustries.length} industries selected
              </Text>
            </View>

            <FlatList
              data={filteredIndustries}
              keyExtractor={(item) => item._id}
              renderItem={renderIndustryItem}
              style={{ maxHeight: 600 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-12">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-4 text-center">
                    {allIndustries
                      ? `No industries found matching "${searchQuery}"`
                      : "Loading industries..."}
                  </Text>
                </View>
              }
            />

            <View className="flex-row gap-2 mt-4">
              <Button
                className="flex-1 bg-gray-200 py-2 rounded-full"
                onPress={() => {
                  setShow(false);
                  setSearchQuery("");
                }}
              >
                <Text className="text-gray-800 text-center font-semibold">
                  Cancel
                </Text>
              </Button>
              <Button
                className="flex-1 bg-blue-600 py-2 rounded-full"
                onPress={() => {
                  setShow(false);
                  setSearchQuery("");
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Done
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function SkillsSelector({
  selectedSkills,
  onSelectionChange,
}: SkillsSelectorProps) {
  const [show, setShow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const allSkills = useQuery(api.skills.getSkills);

  const filteredSkills = allSkills?.filter((skill: Skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleSkill = (skillId: string): void => {
    const isSelected = selectedSkills.includes(skillId);
    if (isSelected) {
      onSelectionChange(selectedSkills.filter((id) => id !== skillId));
    } else {
      onSelectionChange([...selectedSkills, skillId]);
    }
  };

  const renderSkillItem = ({ item: skill }: { item: Skill }) => {
    const isSelected = selectedSkills.includes(skill._id);

    return (
      <Pressable
        className="flex-row items-center justify-between p-4 border-b border-gray-200"
        onPress={() => handleToggleSkill(skill._id)}
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
            isSelected
              ? "bg-green-600 border-green-600"
              : "border-gray-300 bg-white"
          }`}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 9999,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: "white",
          minHeight: 48,
        }}
      >
        <Text style={{ fontSize: 16, color: "#6b7280" }}>
          {selectedSkills.length > 0
            ? `${selectedSkills.length} skills selected`
            : "Select skills"}
        </Text>
      </TouchableOpacity>

      <Modal visible={show} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              width: "95%",
              maxWidth: 400,
              maxHeight: "95%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Select Skills
            </Text>

            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#6B7280" />
              <Input
                className="flex-1 ml-3 text-gray-900 border-0 bg-transparent"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search skills..."
              />
            </View>

            <View className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <Text className="text-green-800 font-medium">
                {selectedSkills.length} skills selected
              </Text>
            </View>

            <FlatList
              data={filteredSkills}
              keyExtractor={(item) => item._id}
              renderItem={renderSkillItem}
              style={{ maxHeight: 600 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-12">
                  <Ionicons name="search" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-4 text-center">
                    {allSkills
                      ? `No skills found matching "${searchQuery}"`
                      : "Loading skills..."}
                  </Text>
                </View>
              }
            />

            <View className="flex-row gap-2 mt-4">
              <Button
                className="flex-1 bg-gray-200 py-2 rounded-full"
                onPress={() => {
                  setShow(false);
                  setSearchQuery("");
                }}
              >
                <Text className="text-gray-800 text-center font-semibold">
                  Cancel
                </Text>
              </Button>
              <Button
                className="flex-1 bg-blue-600 py-2 rounded-full"
                onPress={() => {
                  setShow(false);
                  setSearchQuery("");
                }}
              >
                <Text className="text-white text-center font-semibold">
                  Done
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// Step 1: Basic Information
function BasicInfoStep({ form, errors, handleChange }: BasicInfoStepProps) {
  return (
    <View>
      <Text className="text-2xl font-bold mb-2 text-center">
        Basic Information
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        Let's start with your basic details
      </Text>

      <Label className="mb-2">Name</Label>
      <Input
        className={cn(
          "border rounded-full px-3 py-2 mb-4",
          errors.name ? "border-red-500" : ""
        )}
        value={form.name || ""}
        onChangeText={(v) => handleChange("name", v)}
        placeholder="Your full name"
      />
      {errors.name && (
        <Text className="text-xs text-red-500 mb-2">{errors.name}</Text>
      )}

      <Label className="mb-2">Email</Label>
      <Input
        className={cn(
          "border rounded-full px-3 py-2 mb-4",
          errors.email ? "border-red-500" : ""
        )}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={form.email || ""}
        onChangeText={(v) => handleChange("email", v)}
        placeholder="Enter your email"
      />
      {errors.email && (
        <Text className="text-xs text-red-500 mb-2">{errors.email}</Text>
      )}

      <Label className="mb-2">Password</Label>
      <Input
        className={cn(
          "border rounded-full px-3 py-2 mb-4",
          errors.password ? "border-red-500" : ""
        )}
        secureTextEntry
        autoComplete="new-password"
        value={form.password || ""}
        onChangeText={(v) => handleChange("password", v)}
        placeholder="Create a secure password"
      />
      {errors.password && (
        <Text className="text-xs text-red-500 mb-2">{errors.password}</Text>
      )}
    </View>
  );
}

// Step 2: Contact Information
function ContactInfoStep({ form, errors, handleChange }: ContactInfoStepProps) {
  return (
    <View>
      <Text className="text-2xl font-bold mb-2 text-center">
        Contact Information
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        How can people reach you?
      </Text>

      <Label className="mb-2">Phone Number</Label>
      <PhoneCountryInput
        phone={form.phone}
        country={form.country}
        onPhoneChange={(phone) => handleChange("phone", phone)}
        onCountryChange={(country) => handleChange("country", country)}
        error={errors.phone}
      />

      <Label className="mb-2">Birthday</Label>
      <BirthdayPicker
        value={form.birthday}
        onChange={(date) => handleChange("birthday", date)}
      />
    </View>
  );
}

// Step 3: Professional Profile
function ProfessionalProfileStep({
  form,
  handleChange,
}: ProfessionalProfileStepProps) {
  return (
    <View>
      <Text className="text-2xl font-bold mb-2 text-center">
        Professional Profile
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        Tell us about your professional interests
      </Text>

      <Label className="mb-2">Industries</Label>
      <Text className="text-sm text-gray-600 mb-2">
        Select the industries you're interested in or work with
      </Text>
      <IndustriesSelector
        selectedIndustries={form.industries || []}
        onSelectionChange={(industries) =>
          handleChange("industries", industries)
        }
      />
      <View className="mb-6" />

      <Label className="mb-2">Skills</Label>
      <Text className="text-sm text-gray-600 mb-2">
        What skills do you have or want to develop?
      </Text>
      <SkillsSelector
        selectedSkills={form.skills || []}
        onSelectionChange={(skills) => handleChange("skills", skills)}
      />
    </View>
  );
}

// Step 4: Review & Confirm
function ReviewStep({ form }: ReviewStepProps) {
  const allIndustries = useQuery(api.industries.getIndustries);
  const allSkills = useQuery(api.skills.getSkills);

  const selectedIndustryNames =
    allIndustries
      ?.filter((industry: Industry) => form.industries?.includes(industry._id))
      .map((industry: Industry) => industry.name) || [];

  const selectedSkillNames =
    allSkills
      ?.filter((skill: Skill) => form.skills?.includes(skill._id))
      .map((skill: Skill) => skill.name) || [];

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <View>
      <Text className="text-2xl font-bold mb-2 text-center">
        Review & Confirm
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        Please review your information before creating your account
      </Text>

      <View className="bg-gray-50 rounded-2xl p-4 mb-6">
        <Text className="text-lg font-semibold mb-4">Personal Information</Text>

        <View className="mb-3">
          <Text className="text-sm text-gray-600">Name</Text>
          <Text className="text-base font-medium">{form.name}</Text>
        </View>

        <View className="mb-3">
          <Text className="text-sm text-gray-600">Email</Text>
          <Text className="text-base font-medium">{form.email}</Text>
        </View>

        {form.phone && (
          <View className="mb-3">
            <Text className="text-sm text-gray-600">Phone</Text>
            <Text className="text-base font-medium">
              {selectedCountry?.dialCode} {form.phone}
            </Text>
          </View>
        )}

        <View className="mb-3">
          <Text className="text-sm text-gray-600">Birthday</Text>
          <Text className="text-base font-medium">{form.birthday}</Text>
        </View>
      </View>

      {(selectedIndustryNames.length > 0 || selectedSkillNames.length > 0) && (
        <View className="bg-blue-50 rounded-2xl p-4">
          <Text className="text-lg font-semibold mb-4">
            Professional Profile
          </Text>

          {selectedIndustryNames.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Industries</Text>
              <Text className="text-base font-medium">
                {selectedIndustryNames.join(", ")}
              </Text>
            </View>
          )}

          {selectedSkillNames.length > 0 && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Skills</Text>
              <Text className="text-base font-medium">
                {selectedSkillNames.join(", ")}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export function SignUpForm() {
  const { signIn, signOut } = useAuthActions();
  const addUserIndustry = useMutation(api.users.addUserIndustry);
  const addUserSkill = useMutation(api.users.addUserSkill);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = 4;

  const SignUpSchema = z.object({
    name: z.string().min(2, "Name is required (min 2 characters)"),
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z
      .string()
      .min(7, "Phone number is required (min 10 digits)")
      .regex(/^\d+$/, "Phone must contain only digits"),
    birthday: z.string().min(1, "Birthday is required"),
    type: z.string().min(1, "Type is required"),
    country: z.string().optional(),
    industries: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
  });

  const stepSchemas = [
    // Step 1: Basic Info
    z.object({
      name: SignUpSchema.shape.name,
      email: SignUpSchema.shape.email,
      password: SignUpSchema.shape.password,
    }),
    // Step 2: Contact Info
    z.object({
      phone: SignUpSchema.shape.phone,
      birthday: SignUpSchema.shape.birthday,
      country: SignUpSchema.shape.country,
    }),
    // Step 3: Professional Profile (optional)
    z.object({
      industries: SignUpSchema.shape.industries,
      skills: SignUpSchema.shape.skills,
    }),
    // Step 4: Review (no validation needed)
    z.object({}),
  ];

  const fieldSchemas = {
    name: SignUpSchema.shape.name,
    email: SignUpSchema.shape.email,
    password: SignUpSchema.shape.password,
    phone: SignUpSchema.shape.phone,
    birthday: SignUpSchema.shape.birthday,
    type: SignUpSchema.shape.type,
    country: SignUpSchema.shape.country,
    industries: SignUpSchema.shape.industries,
    skills: SignUpSchema.shape.skills,
  };

  const [form, setForm] = useState<Partial<SignUpFormType>>({
    name: undefined,
    email: undefined,
    password: undefined,
    phone: undefined,
    birthday: undefined,
    type: "individual",
    country: "EG",
    industries: [],
    skills: [],
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const validateField = (key: keyof SignUpFormType, value: any): void => {
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

  const handleChange = (key: keyof SignUpFormType, value: any): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  const validateCurrentStep = (): boolean => {
    const currentStepData = getCurrentStepData();
    const result = stepSchemas[currentStep].safeParse(currentStepData);

    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0],
        ])
      );
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      return false;
    }

    // Clear errors for current step
    const currentStepFields = Object.keys(currentStepData);
    setErrors((prev) => {
      const newErrors = { ...prev };
      currentStepFields.forEach((field) => {
        delete newErrors[field as keyof SignUpFormErrors];
      });
      return newErrors;
    });

    return true;
  };

  const getCurrentStepData = (): Record<string, any> => {
    switch (currentStep) {
      case 0:
        return { name: form.name, email: form.email, password: form.password };
      case 1:
        return {
          phone: form.phone,
          birthday: form.birthday,
          country: form.country,
        };
      case 2:
        return { industries: form.industries, skills: form.skills };
      default:
        return {};
    }
  };

  const handleNext = (): void => {
    if (currentStep < 2 && !validateCurrentStep()) {
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const result = SignUpSchema.safeParse(form);
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

    setErrors({});
    setSubmitting(true);

    try {
      await signIn("password", {
        ...form,
        flow: "signUp",
      });
      await signIn("password", {
        ...form,
        flow: "signIn",
      });
      if (form.industries && form.industries.length > 0) {
        for (const industryId of form.industries) {
          await addUserIndustry({ industryId: industryId as Id<"industries"> });
        }
      }

      if (form.skills && form.skills.length > 0) {
        for (const skillId of form.skills) {
          await addUserSkill({ skillId: skillId as Id<"skills"> });
        }
      }
      Toast.show({
        type: "success",
        text1: "Account created successfully!",
        text2: "Please sign in to continue",
      });
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: "Try to sign up again",
      });
    }

    setSubmitting(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <ContactInfoStep
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <ProfessionalProfileStep form={form} handleChange={handleChange} />
        );
      case 3:
        return <ReviewStep form={form} />;
      default:
        return null;
    }
  };

  const getStepButtonText = (): string => {
    switch (currentStep) {
      case 0:
        return "Continue";
      case 1:
        return "Continue";
      case 2:
        return "Review";
      case 3:
        return submitting ? "Creating Account..." : "Create Account";
      default:
        return "Continue";
    }
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return !!(
          form.name?.trim() &&
          form.email?.trim() &&
          form.password?.trim() &&
          !errors.name &&
          !errors.email &&
          !errors.password
        );
      case 1:
        return !!(
          form.phone?.trim() &&
          form.birthday?.trim() &&
          !errors.phone &&
          !errors.birthday
        );
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1 px-6 bg-white"
            contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

            {renderCurrentStep()}

            <View className="flex-row gap-3 mt-8">
              {currentStep > 0 && (
                <Button
                  className="flex-1 bg-gray-200 py-3 rounded-full"
                  onPress={handlePrevious}
                >
                  <Text className="text-gray-800 text-center font-semibold">
                    Back
                  </Text>
                </Button>
              )}

              <Button
                className={cn(
                  "py-3 rounded-full",
                  currentStep === 0 ? "flex-1" : "flex-1",
                  currentStep === 3 ? "bg-green-600" : "bg-blue-600"
                )}
                onPress={currentStep === 3 ? handleSubmit : handleNext}
                disabled={!isStepValid() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    {getStepButtonText()}
                  </Text>
                )}
              </Button>
            </View>

            {currentStep === 0 && (
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/sign-in")}
                className="mt-4"
              >
                <Text className="text-blue-600 text-center pb-10">
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
