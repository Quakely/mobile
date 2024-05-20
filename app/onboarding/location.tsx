import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import {router, useFocusEffect} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRecoilState} from "recoil";
import {onboardingAtom} from "../../context/atoms/onboarding.atom";
import {Image} from "expo-image";
import LottieView from "lottie-react-native";
import * as Location from "expo-location";
import {LOCATION_TASK_NAME} from "../../utils/global/Constants";

export default function LocationOnboarding() {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(0);

    const [onboarded, setOnboarded] = useRecoilState<boolean>(onboardingAtom);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    const requestForegroundLocationPermission = async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });


    return (
        <Animated.View className="flex-1 flex flex-col items-center justify-center bg-white" style={[animatedStyle]}>
            <View className="w-[90%] flex-1 flex-col bg-white items-center" style={{paddingTop: insets.top + 20}}>
                <View className={"w-full flex flex-row justify-center items-center mt-8"}>
                    <Image source={require('../../assets/icon.png')} style={{width: 128, height: 128}} />
                </View>
                <View className={"w-full flex flex-col justify-center items-center mt-8"}>
                    <Text className={"text-4xl font-Gilroy-Semi-Bold"}>
                        Location
                    </Text>
                    <Text className={"text-2xl color-primary font-Gilroy-Semi-Bold"}>
                        Step 1 of 4
                    </Text>
                </View>
                <LottieView
                    autoPlay
                    style={{
                        width: 200,
                        height: 140
                    }}
                    source={require("../../assets/animations/location_onboard.json")}
                />
                <View className={"w-full flex flex-col justify-center items-center"}>
                    <Text className={"text-xl font-Gilroy-Medium"}>
                        This app uses the location permission to calculate how far away each earthquake is, for alerts about nearby earthquakes, and for analytical purposes.
                    </Text>

                    <Text className={"text-xl font-Gilroy-Medium mt-8"}>
                        You can change this at any time from the Settings app.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    requestForegroundLocationPermission().finally(() => {
                        router.navigate("/onboarding/background-location")
                    })
                }} className={"w-[95%] h-14 flex flex-row justify-center items-center mt-12 bg-accented rounded-full"}>
                    <Text className={"text-2xl text-white font-Gilroy-Bold"}>Next</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
