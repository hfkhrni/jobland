import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  return (
    // <Button
    //   className="bg-blue-600 mt-12"
    //   onPress={() => {
    //     signOut();
    //     router.replace("/(auth)/sign-in");
    //   }}
    //   variant="default"
    // >
    //   <Text className="text-blue-100 dark:text-black">signout</Text>
    // </Button>
    <Button
      className="w-14"
      onPress={() => {
        signOut();
        router.replace("/(auth)/sign-in");
      }}
      variant="default"
    >
      <Text className="text-blue-100 dark:text-black">signout</Text>
    </Button>
  );
}
