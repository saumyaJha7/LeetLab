import { ScrollView, View } from "react-native";
import { ProblemTags } from "../problems";
import { LanguageSelect, type LanguageOption } from "./LanguageSelect";

type EditorToolbarProps = {
  languages: string[];
  selected: LanguageOption | undefined;
  onLanguageChange: (next: LanguageOption | undefined) => void;
  tags: string[];
};

/** Toolbar row: language picker + horizontally scrolling tag chips. */
export function EditorToolbar({
  languages,
  selected,
  onLanguageChange,
  tags,
}: EditorToolbarProps) {
  return (
    <View className="mb-3 flex-row items-center gap-2.5">
      <LanguageSelect
        languages={languages}
        selected={selected}
        onChange={onLanguageChange}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 4 }}
        style={{ flex: 1 }}
      >
        <ProblemTags tags={tags} />
      </ScrollView>
    </View>
  );
}
