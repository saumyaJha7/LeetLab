import { Stack } from "expo-router";

export default function AuthLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				// Login <-> signup are peers, not hierarchy — subtle fade, never slide.
				animation: "fade",
			}}
		/>
	);
}
