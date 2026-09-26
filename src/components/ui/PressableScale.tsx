import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";
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
 * scale 0.97 in 120ms, opacity to 0.7 — CSS transition, no shared value,
 * fires setState twice per press (never per frame).
 */
export function PressableScale({
  children,
  onPress,
  accessibilityRole = "button",
  accessibilityLabel,
  hitSlop = 12,
}: PressableScaleProps) {
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      hitSlop={hitSlop}
      pressRetentionOffset={16}
    >
      <Animated.View
        style={[styles.box, pressed && !reduced && styles.pressed]}
      >
        {typeof children === "function" ? children(pressed) : children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    transform: [{ scale: 1 }],
    transitionProperty: "transform",
    transitionDuration: `${DURATION.press}ms`,
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.85,
  },
});
