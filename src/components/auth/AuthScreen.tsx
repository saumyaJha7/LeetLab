import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import { fontFamily } from "../../theme";
import { PressableScale } from "../ui";
import { AuthMessageBanner } from "./AuthMessageBanner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import type { AuthMessage } from "./authTypes";

export type { AuthMessage } from "./authTypes";

type AuthScreenProps = {
  heading: string;
  message: AuthMessage;
  isGoogleLoading: boolean;
  onGooglePress: () => void;
  footerPrompt: string;
  footerActionLabel: string;
  onFooterPress: () => void;
};

/** Pale-mint topographic header taken from the sign-in mock. */
function TopoHeader() {
  return (
    <Svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 400 360"
      preserveAspectRatio="xMidYMid slice"
    >
      <Path
        d="M-20 20 C60 40 120 10 200 30 C280 50 340 20 420 40"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.7}
      />
      <Path
        d="M40 150 C40 80 110 30 200 30 C290 30 360 80 360 150 C360 220 290 270 200 270 C110 270 40 220 40 150 Z"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.8}
      />
      <Path
        d="M80 150 C80 100 135 60 200 60 C265 60 320 100 320 150 C320 200 265 240 200 240 C135 240 80 200 80 150 Z"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.8}
      />
      <Path
        d="M115 150 C115 115 155 90 200 90 C245 90 285 115 285 150 C285 185 245 210 200 210 C155 210 115 185 115 150 Z"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.8}
      />
      <Path
        d="M145 150 C145 130 170 112 200 112 C230 112 255 130 255 150 C255 170 230 188 200 188 C170 188 145 170 145 150 Z"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.8}
      />
      <Path
        d="M-20 320 C80 300 160 330 240 310 C320 290 360 320 420 300"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.7}
      />
      <Path
        d="M300 296 C330 286 365 296 365 321 C365 346 330 356 300 346 C275 338 278 304 300 296 Z"
        fill="none"
        stroke="#7FB8BE"
        strokeWidth={1.5}
        opacity={0.8}
      />
    </Svg>
  );
}

/**
 * Google-only auth shell matching the sign-in mock: mint topo header
 * with the LeetLab wordmark, white sheet with a wave edge, navy
 * heading with mint underline, pill Google button and bottom footer.
 * Login + signup only provide the heading, handler and footer copy.
 */
export function AuthScreen({
  heading,
  message,
  isGoogleLoading,
  onGooglePress,
  footerPrompt,
  footerActionLabel,
  onFooterPress,
}: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#C9E9E9" }}>
      <StatusBar style="dark" />

      {/* Mint header with topo pattern + wordmark */}
      <View style={{ height: 300 }}>
        <TopoHeader />
        <View
          style={{
            paddingTop: Math.max(insets.top, 20) + 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 13,
              letterSpacing: 5,
              color: "#23365C",
            }}
          >
            LEETLAB
          </Text>
        </View>
      </View>

      {/* Wave edge into the white sheet */}
      <Svg
        style={{ width: "100%", height: 64, marginTop: -64 }}
        viewBox="0 0 400 64"
        preserveAspectRatio="none"
      >
        <Path
          d="M0 34 C70 34 120 6 200 10 C280 14 320 40 400 30 L400 64 L0 64 Z"
          fill="#FFFFFF"
        />
      </Svg>

      {/* White sheet */}
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", marginTop: -1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 24),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontFamily: fontFamily.extraBold,
              fontSize: 34,
              color: "#23365C",
            }}
          >
            {heading}
          </Text>
          <View
            style={{
              width: 150,
              height: 6,
              borderRadius: 999,
              backgroundColor: "#C9E9E9",
              marginTop: 6,
            }}
          />

          <View style={{ marginTop: 28 }}>
            <GoogleSignInButton
              busy={isGoogleLoading}
              isGoogleLoading={isGoogleLoading}
              onPress={onGooglePress}
            />
          </View>

          <AuthMessageBanner message={message} />

          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: 12,
              lineHeight: 17,
              color: "#8B93A5",
              textAlign: "center",
              marginTop: 16,
              paddingHorizontal: 24,
            }}
          >
            By continuing you agree to LeetLab&apos;s Terms &amp; Privacy
            Policy.
          </Text>

          <View style={{ flex: 1 }} />

          <View style={{ marginTop: 32, alignItems: "center" }}>
            <PressableScale onPress={onFooterPress} hitSlop={8}>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  fontSize: 14,
                  color: "#23365C",
                  textAlign: "center",
                }}
              >
                {footerPrompt}{" "}
                <Text style={{ color: "#3D8B96", fontFamily: fontFamily.bold }}>
                  {footerActionLabel}
                </Text>
              </Text>
            </PressableScale>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
