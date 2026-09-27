import { Easing, FadeInDown, LinearTransition } from "react-native-reanimated";

/** Shared subtle-motion constants. transform + opacity only, always <300ms. */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

export const DURATION = {
  press: 120,
  toggle: 180,
  enter: 250,
  reflow: 200,
} as const;

/**
 * Subtle entrance for containers (never virtualized rows).
 * Currently unused — entering animations crashed on Android Fabric
 * (IllegalViewOperationException via PreAllocateView), so this stays
 * parked until verified on a release build.
 */
export const ENTER_SUBTLE = FadeInDown.duration(DURATION.enter).easing(
  EASE_OUT
);

/** List reflow when filters change. Module scope — builders rebuilt in render cost. */
export const REFLOW_SUBTLE = LinearTransition.duration(DURATION.reflow).easing(
  EASE_OUT
);
