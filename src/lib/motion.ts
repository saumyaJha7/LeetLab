/** Shared subtle-motion constants. transform + opacity only, always <300ms. */
export const EASE_OUT_VALUES: [number, number, number, number] = [
  0.23, 1, 0.32, 1,
];
export const EASE_IN_OUT_VALUES: [number, number, number, number] = [
  0.77, 0, 0.175, 1,
];

export const DURATION = {
  press: 120,
  toggle: 180,
  enter: 250,
  reflow: 200,
} as const;

// NOTE: Do NOT create FadeInDown / LinearTransition builders at module scope.
// On Android Fabric (RN 0.83 + Reanimated 4), constructing or attaching
// entering/layout animations triggers:
//   IllegalViewOperationException via PreAllocateView
//   (see FabricUIManager.scheduleMountItem <- NativeProxy.performOperations).
// Keep this file free of `react-native-reanimated` imports so merely
// importing motion tokens never starts the worklets UI runtime.
// If you need entrance motion later, build it lazily inside a
// `Platform.OS !== 'android'` branch and verify on a release build first.
