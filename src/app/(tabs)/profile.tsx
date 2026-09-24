import React from "react";
import { ScrollView, Text, View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// --- Static Data ---
const STATS = [
  { label: "RANK", value: "1.2k" },
  { label: "PERCENTILE", value: "98%" },
  { label: "STREAK", value: "12" },
];

const METRICS = [
  {
    icon: "lightning-bolt",
    color: "#00D09E",
    value: "142",
    label: "SOLVED",
  },
  {
    icon: "chart-bell-curve-cumulative",
    color: "#FFB800",
    value: "74.2%",
    label: "SUCCESS RATE",
  },
] as const;

const PROGRESS_DATA = [
  { label: "Easy", color: "#00D09E", current: 84, total: 450, percentage: "18.6%" },
  { label: "Medium", color: "#FFB800", current: 42, total: 900, percentage: "4.6%" },
  { label: "Hard", color: "#FF4D4D", current: 16, total: 300, percentage: "5.3%" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.headerSubtitle}>Manage your progress</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
              <Ionicons name="settings-outline" size={22} color="#8B95A5" />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.iconButton, styles.logoutButton, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="logout" size={22} color="#FF4D4D" />
            </Pressable>
          </View>
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Alex&backgroundColor=b6e3f4" }} 
              style={styles.avatar} 
            />
            <Pressable style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
              <Feather name="edit-2" size={14} color="#FFF" />
            </Pressable>
          </View>
          <Text style={styles.name}>Alex Rivers</Text>
          <Text style={styles.username}>@arivers_codes</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {index < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Metric Cards Row */}
        <View style={styles.metricsRow}>
          {METRICS.map((metric) => (
            <View key={metric.label} style={styles.metricCard}>
              <MaterialCommunityIcons 
                name={metric.icon} 
                size={32} 
                color={metric.color} 
                style={styles.metricIcon} 
              />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        {/* Solved Problems Section */}
        <View style={styles.problemsSection}>
          <Text style={styles.sectionTitle}>Solved Problems</Text>
          
          <View style={styles.problemsCard}>
            {PROGRESS_DATA.map((item, index) => (
              <View key={item.label} style={[styles.progressRow, index === PROGRESS_DATA.length - 1 && { marginBottom: 0 }]}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.difficultyLabel, { color: item.color }]}>{item.label}</Text>
                  <Text style={styles.progressText}>
                    <Text style={styles.progressCurrent}>{item.current} </Text>
                    <Text style={styles.progressTotal}>/ {item.total}</Text>
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: item.percentage as any, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Joined August 2023 • Premium Member</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1115",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // padding for hypothetical bottom tab bar
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  subtitleContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  headerSubtitle: {
    color: "#8B95A5",
    fontSize: 13,
    fontWeight: "500",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E2128",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 77, 77, 0.1)",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00D09E",
    backgroundColor: "#1E2128",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00D09E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F1115",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    color: "#8B95A5",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#8B95A5",
    fontWeight: "600",
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#2A2E39",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#1A1D24",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  metricIcon: {
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: "#8B95A5",
    fontWeight: "600",
    letterSpacing: 1,
  },
  problemsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  problemsCard: {
    backgroundColor: "#1A1D24",
    borderRadius: 24,
    padding: 24,
  },
  progressRow: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  difficultyLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressText: {
    fontSize: 14,
  },
  progressCurrent: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  progressTotal: {
    color: "#8B95A5",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#2A2E39",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    color: "#4A5263",
    fontSize: 13,
    fontWeight: "500",
  }
});
