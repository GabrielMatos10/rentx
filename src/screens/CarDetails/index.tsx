import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "styled-components";

import Animated, {
	useAnimatedScrollHandler,
	useSharedValue,
	useAnimatedStyle,
	interpolate,
	Extrapolate,
} from "react-native-reanimated";

import { Acessory } from "../../components/Acessory";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";

import { getAccessoryIcon } from "../../utils/getAccessoryIcon";

import {
	Container,
	Header,
	CarImages,
	Details,
	Description,
	Brand,
	Name,
	Rent,
	Period,
	Price,
	About,
	Accessories,
	Footer,
} from "./styles";

interface Params {
	car: CarDTO;
}

import { Button } from "../../components/Button";
import { CarDTO } from "../../dtos/CarDTO";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { StatusBar, StyleSheet } from "react-native";


export function CarDetails() {
	const navigation = useNavigation();
	const route = useRoute();
	const { car } = route.params as Params;

	const theme = useTheme()

	function handleBack() {
		navigation.goBack();
	}

	const scrollY = useSharedValue(0);
	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const headerStyleAnimation = useAnimatedStyle(() => {
		return {
			height: interpolate(
				scrollY.value,
				[0, 200],
				[200, 70],
				Extrapolate.CLAMP
			),
		};
	});

	const sliderCarsStyleAnimation = useAnimatedStyle(() => {
		return{
			opacity: interpolate(
				scrollY.value,
				[0, 150],
				[1, 0],
				Extrapolate.CLAMP
			)
		}
	})

	function handleConfirmRental() {
		navigation.navigate("Scheduling", { car });
	}



	return (
		<Container>
			<StatusBar
				barStyle="dark-content"
				backgroundColor="transparent"
				translucent
			/>

			<Animated.View
			style={[
				headerStyleAnimation, 
				styles.header,
				{backgroundColor: theme.colors.background_secondary}
			]}
			>
				<Animated.View style={sliderCarsStyleAnimation}>
				<Header>
					<BackButton onPress={handleBack} />
				</Header>
					<CarImages>
						<ImageSlider 
							imageUrl={car.photos} 
						/>
					</CarImages>	
				</Animated.View>
			</Animated.View>

			<Animated.ScrollView
				contentContainerStyle={{
					padding: 24,
					paddingTop: getStatusBarHeight() + 160,
				}}
				showsVerticalScrollIndicator={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
			>
				<Details>
					<Description>
						<Brand>{car.brand}</Brand>
						<Name>{car.name}</Name>
					</Description>
					<Rent>
						<Period>{car.rent.period}</Period>
						<Price>R$ {car.rent.price}</Price>
					</Rent>
				</Details>

				<Accessories>
					{car.accessories.map((accessory) => (
						<Acessory
							key={accessory.type}
							name={accessory.name}
							icon={getAccessoryIcon(accessory.type)}
						/>
					))}
				</Accessories>

				<About>
					{car.about}
				</About>
			</Animated.ScrollView>

			<Footer>
				<Button
					title="Escolher período do aluguel"
					onPress={handleConfirmRental}
				/>
			</Footer>
		</Container>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		overflow: 'hidden',
		zIndex: 1,
	}
})