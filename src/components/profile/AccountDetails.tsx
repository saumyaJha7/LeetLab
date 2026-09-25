import { Text, View } from "react-native";
import { DetailSection } from "../problems";

function InfoRow({
  label,
  value,
  showDivider,
}: {
  label: string;
  value: string;
  showDivider: boolean;
}) {
  return (
    <View className={`gap-1 py-3 ${showDivider ? "border-b border-border" : ""}`}>
      <Text className="text-muted" style={{ fontSize: 12, fontWeight: "600" }}>
        {label.toUpperCase()}
      </Text>
      <Text className="text-foreground" style={{ fontSize: 15 }}>
        {value}
      </Text>
    </View>
  );
}

type AccountDetailsProps = {
  email: string | null;
  memberSince: string | null;
};

/** Account facts from the Supabase session. */
export function AccountDetails({ email, memberSince }: AccountDetailsProps) {
  const rows = [
    email ? { label: "Email", value: email } : null,
    memberSince ? { label: "Member since", value: memberSince } : null,
  ].filter((row) => row !== null);

  if (rows.length === 0) {
    return null;
  }

  return (
    <DetailSection title="Account">
      {rows.map((row, index) => (
        <InfoRow
          key={row.label}
          label={row.label}
          value={row.value}
          showDivider={index < rows.length - 1}
        />
      ))}
    </DetailSection>
  );
}
