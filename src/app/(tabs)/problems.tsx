import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { Link, useRouter } from "expo-router";

interface Problem {
  problem_id: number;
  title: string;
  acceptance_rate: number;
  tags?: string[];
}

export default function ProblemsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="#FF6B6B" />
      </Pressable>
      <Text style={styles.headerTitle}>Prblm Screen</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Problem }) => {
    return (
      <Link href={`/(tabs)/problems/${item.problem_id}`} asChild>
        <Pressable style={({ pressed }) => [styles.problemCard, pressed && styles.pressedCard]}>
          <Text style={styles.problemTitle}>{item.title}</Text>
          <View style={styles.tagsContainer}>
            {item.tags && item.tags.length > 0 ? (
              item.tags.map((tag, index) => (
                <Text key={index} style={styles.problemTag}>{tag}</Text>
              ))
            ) : (
              <Text style={styles.problemTag}>No tags</Text>
            )}
          </View>
        </Pressable>
      </Link>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#4DABF7" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={problems}
          keyExtractor={(item) => item.problem_id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No problems found. (If you just inserted data, check if RLS policies are blocking reads!)
            </Text>
          }
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
    backgroundColor: "#121212", // Dark background
  },
  listContent: { 
    paddingBottom: 100,
  },
  headerContainer: { 
    paddingHorizontal: 24, 
    paddingTop: 16, 
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: { 
    position: 'absolute',
    left: 24,
    top: 16,
    width: 48, 
    height: 36, 
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: "#FF6B6B", 
    justifyContent: "center", 
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FFFFFF", 
  },
  problemCard: { 
    backgroundColor: "transparent", 
    marginHorizontal: 24, 
    marginBottom: 16, 
    borderRadius: 16, 
    borderWidth: 1.5,
    borderColor: "#4DABF7", // Blue border
    padding: 20,
  },
  problemTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#4DABF7", // Blue text
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  problemTag: { 
    fontSize: 14, 
    color: "#51CF66", // Green text
    fontWeight: "500",
  },
  pressedCard: { 
    opacity: 0.7,
  },
  emptyText: {
    color: '#8B95A5',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 32,
    lineHeight: 24,
  }
});
