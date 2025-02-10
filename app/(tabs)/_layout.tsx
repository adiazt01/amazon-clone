import { Header } from "@/components/Shared/header/Header";
import { useCart } from "@/context/CartProvider";
import MCIcon from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { Text, XStack, YStack } from "tamagui";

interface Tab {
	name: string;
	icon: "home-outline" | "account-outline" | "cart-check";
}

export default function TabLayout() {
	const { items } = useCart();

	const tabs: Tab[] = [
		{
			name: "index",
			icon: "home-outline",
		},
		{
			name: "profile",
			icon: "account-outline",
		},
		{
			name: "cart",
			icon: "cart-check",
		},
	];

	return (
		<Tabs>
			{tabs.map((tab) => (
				<Tabs.Screen
					key={tab.name}
					name={tab.name}
					options={{
						tabBarStyle: {
							borderTopWidth: 1,
							borderTopColor: "lightgray",
						},
						header: (props) => <Header {...props} />,
						tabBarLabel: () => null,
						tabBarIcon: ({ focused }) => (
							<YStack
								f={1}
								mt={-5}
								gap={10}
								jc={"space-between"}
								ai={"center"}
							>
								<XStack
									w={50}
									h={4}
									br={20}
									bg={
										focused
											? "#238db0"
											: "$colorTransparent"
									}
								/>
								<MCIcon
									name={tab.icon}
									size={30}
									color={focused ? "#238db0" : "black"}
								/>
								{tab.name === "cart" && (
									<Text
										px={4}
										br={10}
										pos="absolute"
										top={11}
										bg={"white"}
										fow={"bold"}
										fos={12}
										color={focused ? "#238db0" : "black"}
									>
										{items.length}
									</Text>
								)}
							</YStack>
						),
					}}
				/>
			))}
		</Tabs>
	);
}
