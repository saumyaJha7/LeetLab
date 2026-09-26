import { ScrollView } from "react-native";
import { Chip } from "heroui-native";
import * as Haptics from "expo-haptics";

type FilterChipsProps = {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
};

/** Horizontal tag filter: All + one chip per tag. */
export function FilterChips({ tags, active, onChange }: FilterChipsProps) {
  const options: (string | null)[] = [null, ...tags];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingRight: 4 }}
    >
      {options.map((tag) => {
        const isActive = active === tag;
        return (
          <Chip
            key={tag ?? "all"}
            size="sm"
            variant={isActive ? "primary" : "soft"}
            color={isActive ? "accent" : "default"}
            onPress={() => {
              // One light tick per commit, paired with the chip visual.
              void Haptics.selectionAsync();
              onChange(tag);
            }}
          >
            <Chip.Label>{tag ?? "All"}</Chip.Label>
          </Chip>
        );
      })}
    </ScrollView>
  );
}
