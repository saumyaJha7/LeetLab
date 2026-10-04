import { Text, View } from "react-native";
import { SearchField } from "heroui-native";
import { TagFilterSelect, type TagCount } from "./TagFilterSelect";

type ProblemsHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  tags: TagCount[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  /** Pill text, e.g. "12 total" or "3 of 12". */
  countLabel: string;
};

/** Problems tab header: title + count pill, search field
 * and a full-width filter button opening a bottom sheet. */
export function ProblemsHeader({
  query,
  onQueryChange,
  tags,
  activeTag,
  onTagChange,
  countLabel,
}: ProblemsHeaderProps) {
  return (
    <View className="pb-3">
      <View className="mb-4 flex-row items-center justify-between">
        <Text
          className="text-foreground"
          style={{ fontSize: 24, fontWeight: "800" }}
        >
          Coding Problems
        </Text>
        <View className="rounded-full border border-border bg-surface px-3 py-1.5">
          <Text
            className="text-accent"
            style={{ fontSize: 12, fontWeight: "800" }}
          >
            {countLabel}
          </Text>
        </View>
      </View>
      <SearchField value={query} onChange={onQueryChange} className="mb-3">
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search problems…" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <TagFilterSelect tags={tags} active={activeTag} onChange={onTagChange} />
    </View>
  );
}
