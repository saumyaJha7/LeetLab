import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
} from "react-native";
import { DURATION } from "../../lib/motion";

type PressableScaleProps = {
  children: ReactNode | ((pressed: boolean) => ReactNode);
  onPress?: () => void;
  accessibilityRole?: "button" | "link";
  accessibilityLabel?: string;
  hitSlop?: number;
};

/**
 * Near-imperceptible press feedback for high-frequency touches.
 * scale 0.97 in 120ms via RN Animated, native driver, transform-only.
 * Deliberately NOT Reanimated: CSS/entering animations crashed this
 * app's Android Fabric build, so press feedback stays on the legacy
 * path until Reanimated is verified on a release build.
 */
export function PressableScale({
  children,
  onPress,
  accessibilityRole = "button",
  accessibilityLabel,
  hitSlop = 12,
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setReduced).catch(() => {});
  }, []);

  const animateTo = (to: number) => {
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.timing(scale, {
      toValue: to,
      duration: DURATION.press,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => animateTo(0.97)}
      onPressOut={() => animateTo(1)}
      hitSlop={hitSlop}
      pressRetentionOffset={16}
    >
      {({ pressed }) => (
        <Animated.View style={{ transform: [{ scale }] }}>
          {typeof children === "function" ? children(pressed) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
