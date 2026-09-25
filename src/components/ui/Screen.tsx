import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { spacing } from "../../theme";

type ScreenProps = {
  children: ReactNode;
  /** Horizontal padding. Turn off for full-bleed content. */
  padded?: boolean;
};

/** App screen container: dark background + safe-area top inset. */
export function Screen({ children, padded = true }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingHorizontal: padded ? spacing.lg : 0,
      }}
    >
      {children}
    </View>
  );
}
