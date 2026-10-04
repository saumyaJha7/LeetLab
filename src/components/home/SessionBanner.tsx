import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "heroui-native";
import { fontFamily, colors } from "../../theme";

/** Session banner: accent-tinted card confirming the user is live. */
export function SessionBanner() {
  return (
    <Card className="mb-6" style={{ backgroundColor: `${colors.primary}14` }}>
      <Card.Body>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 gap-1">
            <Text
              className="text-foreground"
              style={{ fontFamily: fontFamily.semiBold, fontSize: 15 }}
            >
              Ready to practice
            </Text>
            <Text
              className="text-muted"
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              Your session is live. Jump into a problem and keep the streak
              going.
            </Text>
          </View>
          <Ionicons
            name="shield-checkmark"
            size={22}
            color={colors.primary}
          />
        </View>
      </Card.Body>
    </Card>
  );
}
