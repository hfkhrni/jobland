import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { SignUpForm } from "~/components/SignUpForm";

export const options = {
  headerShown: false,
};

export default function SignUp() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <SignUpForm />;
}
