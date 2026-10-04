import { Text } from "react-native";
import { DetailSection } from "./DetailSection";
import { fontFamily } from "../../theme";

type ProblemDescriptionProps = {
  text: string;
};

/** Description section: muted-body copy inside the standard card. */
export function ProblemDescription({ text }: ProblemDescriptionProps) {
  return (
    <DetailSection title="Description">
      <Text
        className="text-foreground"
        style={{ fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 24 }}
      >
        {text}
      </Text>
    </DetailSection>
  );
}
