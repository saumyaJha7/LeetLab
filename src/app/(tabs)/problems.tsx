import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

// --- Types ---
type Difficulty = "EASY" | "MEDIUM" | "HARD";
type Status = "unsolved" | "attempted" | "solved";

interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  acceptance: string;
  status: Status;
}

// --- Dummy Data ---
const CATEGORIES = ["All", "Array", "String", "DP", "Tree", "Graph", "Math", "Sorting"];

const PROBLEMS: Problem[] = [
  { id: 146, title: "LRU Cache", difficulty: "MEDIUM", acceptance: "40%", status: "unsolved" },
  { id: 4, title: "Median of Arrays", difficulty: "HARD", acceptance: "36%", status: "attempted" },
  { id: 20, title: "Valid Parentheses", difficulty: "EASY", acceptance: "41%", status: "solved" },
  { id: 3, title: "Longest Substring", difficulty: "MEDIUM", acceptance: "34%", status: "solved" },
  { id: 15, title: "3Sum", difficulty: "MEDIUM", acceptance: "32%", status: "unsolved" },
  { id: 1, title: "Two Sum", difficulty: "EASY", acceptance: "50%", status: "solved" },
  { id: 42, title: "Trapping Rain Water", difficulty: "HARD", acceptance: "37%", status: "unsolved" },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "MEDIUM", acceptance: "32%", status: "unsolved" },
  { id: 206, title: "Reverse Linked List", difficulty: "EASY", acceptance: "74%", status: "solved" },
  { id: 23, title: "Merge k Sorted Lists", difficulty: "HARD", acceptance: "51%", status: "attempted" },
];

const DIFFICULTY_COLORS = {
  EASY: "#00D09E",
  MEDIUM: "#FFB800",
  HARD: "#FF4D4D",
};

export default function ProblemsScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("All");

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Problems</Text>
        <Pressable style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8B95A5" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor="#8B95A5"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={({ pressed }) => [
                styles.categoryChip,
                isActive && styles.categoryChipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: Problem }) => {
    let StatusIcon;
    let statusStyle;
    let cardStyle: any = [styles.problemCard];

    if (item.status === "solved") {
      StatusIcon = <Feather name="check-circle" size={20} color="#00D09E" />;
      statusStyle = styles.statusSolved;
    } else if (item.status === "attempted") {
      StatusIcon = <Feather name="clock" size={20} color="#FF4D4D" />;
      statusStyle = styles.statusAttempted;
      // The design has a subtle red left highlight for attempted problems
      cardStyle.push({ borderLeftWidth: 3, borderLeftColor: "#FF4D4D" });
    } else {
      StatusIcon = <View style={styles.statusUnsolvedInner} />;
      statusStyle = styles.statusUnsolved;
    }

    return (
      <Pressable style={({ pressed }) => [...cardStyle, pressed && styles.pressedCard]}>
        <View style={[styles.statusIconContainer, statusStyle]}>
          {StatusIcon}
        </View>

        <View style={styles.problemInfo}>
          <Text style={styles.problemTitle}>{`${item.id}. ${item.title}`}</Text>
          <View style={styles.problemMeta}>
            <Text style={[styles.problemDifficulty, { color: DIFFICULTY_COLORS[item.difficulty] }]}>
              {item.difficulty}
            </Text>
            <Text style={styles.problemAcceptance}> • {item.acceptance} Acceptance</Text>
          </View>
        </View>

        <Feather name="chevron-right" size={20} color="#8B95A5" />
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={PROBLEMS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0F1115",
  },
  listContent: { 
    paddingBottom: 100, // accommodate bottom tab bar
  },
  headerContainer: { 
    paddingHorizontal: 24, 
    paddingTop: 16, 
    paddingBottom: 8,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 24,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
    letterSpacing: -0.5,
  },
  filterButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: "#1A1D24", 
    justifyContent: "center", 
    alignItems: "center",
  },
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#1A1D24", 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    height: 52, 
    marginBottom: 24,
  },
  searchIcon: { 
    marginRight: 12,
  },
  searchInput: { 
    flex: 1, 
    color: "#FFFFFF", 
    fontSize: 15,
  },
  categoriesScroll: { 
    marginBottom: 16,
  },
  categoriesContainer: { 
    gap: 12, 
    paddingRight: 24,
  },
  categoryChip: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: "#1A1D24",
  },
  categoryChipActive: { 
    backgroundColor: "#00D09E",
  },
  categoryText: { 
    color: "#8B95A5", 
    fontSize: 14, 
    fontWeight: "600",
  },
  categoryTextActive: { 
    color: "#0F1115", // In design, active text on green is dark
    fontWeight: "bold",
  },
  problemCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#1A1D24", 
    marginHorizontal: 24, 
    marginBottom: 12, 
    borderRadius: 20, 
    padding: 16,
    // Add default invisible border to prevent layout shift when attempted border is added
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  statusIconContainer: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 16,
  },
  statusSolved: { 
    backgroundColor: "rgba(0, 208, 158, 0.1)",
  },
  statusAttempted: { 
    backgroundColor: "rgba(255, 77, 77, 0.1)",
  },
  statusUnsolved: { 
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  statusUnsolvedInner: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: "#4A5263",
  },
  problemInfo: { 
    flex: 1,
  },
  problemTitle: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
    marginBottom: 6,
  },
  problemMeta: { 
    flexDirection: "row", 
    alignItems: "center",
  },
  problemDifficulty: { 
    fontSize: 11, 
    fontWeight: "800", 
    letterSpacing: 0.5,
  },
  problemAcceptance: { 
    fontSize: 12, 
    color: "#8B95A5", 
    fontWeight: "500",
  },
  pressed: { 
    opacity: 0.7, 
  },
  pressedCard: { 
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});
