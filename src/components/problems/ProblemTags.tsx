import { View } from "react-native";
import { Chip } from "heroui-native";

type ProblemTagsProps = {
  tags: string[];
  size?: "sm" | "md" | "lg";
};

/** Soft neutral tag chips row. */
export function ProblemTags({ tags, size = "sm" }: ProblemTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <Chip key={tag} size={size} variant="soft" color="default">
          <Chip.Label>{tag}</Chip.Label>
        </Chip>
      ))}
    </View>
  );
}
