import { Ionicons } from "@expo/vector-icons";
import { Button, Select } from "heroui-native";
import { colors } from "../../theme";

const ALL_VALUE = "__all__";

export type TagCount = {
  tag: string;
  count: number;
};

type TagFilterSelectProps = {
  tags: TagCount[];
  active: string | null;
  onChange: (tag: string | null) => void;
};

/** Tag filter: full-width button opening a bottom sheet with
 * "All" + one row per tag (with counts). Single-select, like the chips. */
export function TagFilterSelect({ tags, active, onChange }: TagFilterSelectProps) {
  return (
    <Select
      value={
        active
          ? { value: active, label: active }
          : { value: ALL_VALUE, label: "All" }
      }
      onValueChange={(next) => {
        onChange(!next || next.value === ALL_VALUE ? null : next.value);
      }}
      presentation="bottom-sheet"
    >
      <Select.Trigger variant="unstyled" asChild>
        <Button variant="secondary" size="lg" className="w-full rounded-2xl">
          <Ionicons name="funnel-outline" size={16} color={colors.foreground} />
          <Select.Value placeholder="All" />
          <Select.TriggerIndicator />
        </Button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Overlay />
        <Select.Content presentation="bottom-sheet" snapPoints={["50%"]}>
          <Select.ListLabel>Filter by tag</Select.ListLabel>
          <Select.Item value={ALL_VALUE} label="All" />
          {tags.map(({ tag, count }) => (
            <Select.Item
              key={tag}
              value={tag}
              label={`${tag} · ${count}`}
            />
          ))}
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}
