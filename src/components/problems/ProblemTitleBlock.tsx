import { Text, View } from "react-native";
import { ProblemTags } from "./ProblemTags";

type ProblemTitleBlockProps = {
  title: string;
  tags: string[];
  acceptanceRate: number | null | undefined;
};

/** Title block: problem title + tag chips + acceptance line. */
export function ProblemTitleBlock({
  title,
  tags,
  acceptanceRate,
}: ProblemTitleBlockProps) {
  return (
    <View className="mb-5 gap-3">
      <Text
        className="text-foreground"
        style={{ fontSize: 24, fontWeight: "800", lineHeight: 30 }}
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap items-center gap-2">
        <ProblemTags tags={tags} />
        <Text className="text-muted" style={{ fontSize: 13 }}>
          {acceptanceRate}% acceptance
        </Text>
      </View>
    </View>
  );
}
