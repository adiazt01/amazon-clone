import React, { useCallback, useState } from "react";
import { DeliveryLocation } from "@/components/Shared/DeliveryLocation";
import { HeaderTabsProps } from "@/components/Shared/header/HeaderTabs";
import { HomeCarousel } from "@/components/Screens/home/HomeCarousel";
import { HomeSuggestions } from "@/components/Screens/home/HomeSuggestions";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Alert, FlatList } from "react-native";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";
import { DefaultButton } from "@/components/Shared/DefaultButton";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/supabase";
import { Product } from "@/types/product";
import { ProductDealCard } from "@/components/Screens/home/ProductDealCard";
import { ProductCardResult } from "@/components/Screens/search/ProductCardResult";

export default function Home() {
	const { session } = useAuth();
	const navigation = useNavigation();

	const [deals, setDeals] = useState<Product[]>([]);
	const [allProducts, setAllProducts] = useState<Product[]>([]);

	const onClickAuth = () => router.push("/login");

	const tabs: HeaderTabsProps["tabs"] = [
		{
			active: true,
			title: "Alexa Lists",
			onPress: () => Alert.alert("Alexa Lists"),
		},
		{
			title: "Prime",
			onPress: () => Alert.alert("Prime"),
		},
		{
			title: "Video",
			onPress: () => Alert.alert("Video"),
		},
	];

	const onProductPress = ({ id }: Product) => {
		router.push(`/product/${id}`);
	};

	const getDeals = useCallback(async () => {
		try {
			const { data = [] } = await supabase.from("products").select("*");
			setDeals(data as Product[]);
		} catch (error) {
			console.log("error", error);
		}
	}, []);

	const getAllProducts = useCallback(async () => {
		try {
			const { data = [] } = await supabase.from("products").select("*");
			console.log(data)
			setAllProducts(data as Product[]);
		} catch (error) {
			console.log("error", error);
		}
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerSearchShown: true,
			headerTabsProps: { tabs },
		});

		getDeals();
		getAllProducts();
	}, [navigation.setOptions, getDeals, getAllProducts]);

	return (
		<ScrollView f={1}>
			<DeliveryLocation />
			<HomeCarousel />
			<HomeSuggestions />
			<YStack bg={"white"} w="100%" p={20} gap={20}>
				<Text als={"flex-start"} fos={20} fow={"bold"}>
					{session
						? "Deals for you"
						: "Sign in for your best experience"}
				</Text>
				{session ? (
					<XStack gap={30} jc={"space-between"} fw={"wrap"}>
						{deals.map((product) => (
							<ProductDealCard
								key={product.id}
								product={product}
								onPress={() => onProductPress(product)}
							/>
						))}
					</XStack>
				) : (
					<DefaultButton onPress={onClickAuth}>
						Sign in Securely
					</DefaultButton>
				)}
			</YStack>
			<YStack bg={"white"} w="100%" p={20} gap={20}>
				<Text als={"flex-start"} fos={20} fow={"bold"}>
					All Products
				</Text>
				<FlatList
					data={allProducts}
					keyExtractor={(item) => item.id.toString()}
					ItemSeparatorComponent={() => <YStack h={10} />}
					renderItem={({ item: product }) => (
						<ProductCardResult
							product={product}
							onPress={() => onProductPress(product)}
						/>
					)}
				/>
			</YStack>
		</ScrollView>
	);
}
