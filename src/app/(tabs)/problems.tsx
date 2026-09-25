import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { Link } from "expo-router";

interface Problem {
  problem_id: number;
  title: string;
  acceptance_rate: number;
  tags?: string[];
}

export default function ProblemsScreen() {
  const insets = useSafeAreaInsets();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('problems')
      .select('problem_id, title, acceptance_rate, tags');
      
    if (error) {
      console.error('Error fetching problems:', error);
    } else {
      setProblems(data || []);
    }
    setLoading(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Problems</Text>
        <Pressable style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
          <Ionicons name="options-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Problem }) => {
    return (
      <Link href={`/(tabs)/problems/${item.problem_id}`} asChild>
        <Pressable style={({ pressed }) => [styles.problemCard, pressed && styles.pressedCard]}>
          <View style={styles.problemInfo}>
            <Text style={styles.problemTitle}>{`${item.problem_id}. ${item.title}`}</Text>
            <View style={styles.problemMeta}>
              <Text style={styles.problemAcceptance}>{item.acceptance_rate}% Acceptance</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color="#8B95A5" />
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#00D09E" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={problems}
          keyExtractor={(item) => item.problem_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  problemCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#1A1D24", 
    marginHorizontal: 24, 
    marginBottom: 12, 
    borderRadius: 20, 
    padding: 16,
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
