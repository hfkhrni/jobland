import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import { ImageBackground, ImageSourcePropType, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useBottomTabOverflow } from "~/components/ui/TabBarBackground";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "./ui/text";

const HEADER_HEIGHT = 250;
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

type Props = PropsWithChildren<{
  /** the source for your parallax image */
  headerBackground: ImageSourcePropType;
  /** any React node you want centered/flexed over the image */
  headerOverlay: ReactElement;
  overlayColor?: string;
}>;

export default function ParallaxScrollView({
  children,
  headerBackground,
  headerOverlay,
  overlayColor = "rgba(0,0,0,0.3)",
}: Props) {
  const { colorScheme } = useColorScheme();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1]
        ),
      },
    ] as const,
  }));
  const renderedChildren = React.Children.map(children, (child: ReactNode) => {
    if (typeof child === "string" || typeof child === "number") {
      return (
        <Text
          className="text-base"
          style={{ color: NAV_THEME[colorScheme].text }}
        >
          {child}
        </Text>
      );
    }
    return child;
  });
  const bg = NAV_THEME[colorScheme].background;

  return (
    <View className="flex-1" style={{ backgroundColor: bg }}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{
          paddingBottom: bottom,
        }}
      >
        <AnimatedImageBackground
          source={headerBackground}
          resizeMode="none"
          className="w-full overflow-hidden"
          style={[{ height: HEADER_HEIGHT }, headerAnimatedStyle]}
        >
          {/* Color overlay */}
          <View
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
          />
          {/* Your flex overlay on top */}
          <View className="absolute inset-0 flex-1 justify-center items-center">
            {headerOverlay}
          </View>
        </AnimatedImageBackground>

        <View className="flex-1" style={{ backgroundColor: bg }}>
          {renderedChildren}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
