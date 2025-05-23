import Icon from "@expo/vector-icons/Ionicons";
import { ProfileUnauthedBanner } from "@/components/Screens/profile/ProfileUnauthedBanner";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Avatar,
	Button,
	Image,
	ScrollView,
	Sheet,
	Text,
	XStack,
	YStack,
} from "tamagui";
import AmazonLogo from "@/assets/amazon-logo.png";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import { Pressable } from "react-native";

export default function Profile() {
	const { session } = useAuth();
	const navigation = useNavigation();
	const [sheetOpen, setSheetOpen] = useState(false);

	const onClickAuth = () => router.push("/login");

	const signOut = async () => {
		await supabase.auth.signOut();
		setSheetOpen(false);
		router.replace("/(tabs)");
	};

	useEffect(() => {
		navigation.setOptions({
			headerSearchShown: Boolean(session),
			headerLeft: !session
				? () => <Image source={{ uri: AmazonLogo }} w={100} h={30} />
				: null,
		});
	}, [navigation.setOptions, session]);

	return (
		<>
			<ScrollView bg={"white"}>
				{session ? (
					<XStack jc="space-between" p={20} gap={20}>
						<Pressable
							onPress={() => setSheetOpen((prev) => !prev)}
						>
							<XStack jc="flex-start" ai={"center"} gap={10}>
								<Avatar circular size={30}>
									<Avatar.Fallback bg={"gray"} />
								</Avatar>
								<Text fos={18}>
									Hello, {session?.user.email}
								</Text>
								<Icon name="chevron-down" size={20} />
							</XStack>
						</Pressable>
						<XStack gap={25} jc="flex-end" ai={"center"}>
							<Icon name="settings-outline" size={20} />
							<Icon name="search-sharp" size={20} />
						</XStack>
					</XStack>
				) : (
					<YStack f={1} pt={40} ai={"center"} gap={45}>
						<YStack w={"100%"} jc={"center"} ai={"center"} gap={40}>
							<Text ta={"center"} fos={24}>
								Sign in for the optimal experience
							</Text>
							<YStack w={"90%"} gap={15}>
								<DefaultButton onPress={onClickAuth}>
									Sign In
								</DefaultButton>
								<DefaultButton
									onPress={onClickAuth}
									variant="secondary"
								>
									Create Account
								</DefaultButton>
							</YStack>
						</YStack>
						<ProfileUnauthedBanner />
					</YStack>
				)}
			</ScrollView>

			<Sheet
				open={sheetOpen}
				onOpenChange={(open: boolean) => setSheetOpen(open)}
			>
				<Sheet.Overlay />
				<Sheet.Handle />
				<Sheet.Frame p={20} gap={20}>
					<Text>{session?.user.email}</Text>
					<Button
						textProps={{ fos: 18 }}
						bg="$red5Light"
						onPress={signOut}
					>
						Logout
					</Button>
				</Sheet.Frame>
			</Sheet>
		</>
	);
}
