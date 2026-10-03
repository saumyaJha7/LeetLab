import { View } from "react-native";
import { SearchField } from "heroui-native";
import { ScreenHeader } from "../ui";
import { FilterChips } from "./FilterChips";

type ProblemsHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  subtitle: string;
};

/** List header for the Problems tab: shared title + count,
 * search field and tag filter chips. Pure UI — filtering
 * logic stays in the screen. */
export function ProblemsHeader({
  query,
  onQueryChange,
  tags,
  activeTag,
  onTagChange,
  subtitle,
}: ProblemsHeaderProps) {
  return (
    <View className="pb-2">
      <ScreenHeader title="Problems" subtitle={subtitle} />
      <View className="-mt-2">
        <SearchField value={query} onChange={onQueryChange} className="mb-4">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search problems…" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        {tags.length > 0 ? (
          <View className="mb-2">
            <FilterChips tags={tags} active={activeTag} onChange={onTagChange} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
