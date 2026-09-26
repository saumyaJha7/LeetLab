import { useMemo, type ReactNode } from "react";
import { type ViewStyle } from "react-native";
import Animated, {
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";
import { DURATION, EASE_OUT } from "../../lib/motion";

type EnteringViewProps = {
  children: ReactNode;
  /** Stagger index — delay = index * 50ms, capped. Keep 30-60ms per item. */
  index?: number;
  style?: ViewStyle | ViewStyle[];
  className?: string;
};

/**
 * Subtle mount entrance for containers only (never FlatList rows).
 * Fade + 12px rise, 250ms ease-out. Reduced motion → no translation.
 */
export function EnteringView({
  children,
  index = 0,
  style,
  className,
}: EnteringViewProps) {
  const reduced = useReducedMotion();

  const entering = useMemo(() => {
    if (reduced) return undefined;
    const delay = Math.min(index, 4) * 50;
    return FadeInDown.duration(DURATION.enter)
      .delay(delay)
      .easing(EASE_OUT);
  }, [reduced, index]);

  return (
    <Animated.View entering={entering} style={style} className={className}>
      {children}
    </Animated.View>
  );
}
