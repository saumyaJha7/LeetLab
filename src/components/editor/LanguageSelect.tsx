import { Ionicons } from "@expo/vector-icons";
import { Button, Select } from "heroui-native";
import { colors } from "../../theme";

export type LanguageOption = {
  value: string;
  label: string;
};

type LanguageSelectProps = {
  languages: string[];
  selected: LanguageOption | undefined;
  onChange: (next: LanguageOption | undefined) => void;
};

/** Language picker: secondary button trigger + bottom-sheet options. */
export function LanguageSelect({
  languages,
  selected,
  onChange,
}: LanguageSelectProps) {
  return (
    <Select
      value={selected}
      onValueChange={onChange}
      presentation="bottom-sheet"
    >
      <Select.Trigger variant="unstyled" asChild>
        <Button variant="secondary" size="sm">
          <Ionicons name="code-slash" size={15} color={colors.foreground} />
          <Select.Value placeholder="Language" />
          <Select.TriggerIndicator />
        </Button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="bottom-sheet" snapPoints={["40%"]}>
          <Select.ListLabel>Choose language</Select.ListLabel>
          {languages.map((language) => (
            <Select.Item
              key={language}
              value={language}
              label={language}
            />
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
