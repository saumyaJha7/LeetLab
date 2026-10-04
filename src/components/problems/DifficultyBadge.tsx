import { Text, View } from "react-native";
import { difficultyFor, type Difficulty } from "../../lib/difficulty";
import { colors } from "../../theme";

const difficultyColor: Record<Difficulty, string> = {
  Easy: colors.easy,
  Medium: colors.medium,
  Hard: colors.hard,
};

type DifficultyBadgeProps = {
  acceptanceRate: number;
};

/** Small-caps difficulty pill, tinted from the acceptance rate. */
export function DifficultyBadge({ acceptanceRate }: DifficultyBadgeProps) {
  const level = difficultyFor(acceptanceRate);
  const color = difficultyColor[level];

  return (
    <View
      className="self-start rounded-md px-2 py-1"
      style={{ backgroundColor: `${color}1F` }}
    >
      <Text
        style={{
          color,
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 0.8,
        }}
      >
        {level.toUpperCase()}
      </Text>
    </View>
  );
}
