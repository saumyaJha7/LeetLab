import { type ReactNode } from "react";
import { View, type ViewStyle } from "react-native";

type EnteringViewProps = {
  children: ReactNode;
  /** Stagger index — reserved for future motion, currently unused. */
  index?: number;
  style?: ViewStyle | ViewStyle[];
  className?: string;
};

/**
 * Mount wrapper for containers only (never FlatList rows).
 *
 * ANDROID FABRIC SAFETY: Reanimated entering/layout animations crash
 * Android builds with `IllegalViewOperationException` (PreAllocateView →
 * scheduleMountItem ← NativeProxy.performOperations ← worklets runloop).
 * This component therefore renders a plain View on all platforms until
 * entrance motion is re-verified on a release build.
 */
export function EnteringView({
  children,
  style,
  className,
}: EnteringViewProps) {
  return (
    <View style={style} className={className}>
      {children}
    </View>
  );
}
