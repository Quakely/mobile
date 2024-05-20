import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import {useFocusEffect} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRecoilState} from "recoil";
import {onboardingAtom} from "../../context/atoms/onboarding.atom";
import {Image} from "expo-image";
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

export default function MainOnboarding() {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(0);

    const [onboarded, setOnboarded] = useRecoilState<boolean>(onboardingAtom);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });


    return (
        <Animated.View className="w-screen flex-1 flex flex-col items-center justify-center bg-white" style={[animatedStyle]}>
            <View className="w-[90%] flex-1 flex-col bg-white items-center" style={{paddingTop: insets.top + 20}}>
                <View className={"w-full flex flex-row justify-center items-center mt-8"}>
                    <Image source={require('../../assets/icon.png')} style={{width: 128, height: 128}} />
                </View>
                <View className={"w-full flex flex-col justify-center items-center mt-8"}>
                    <Text className={"text-4xl font-Gilroy-Semi-Bold"}>
                        Welcome
                    </Text>
                    <Text className={"text-2xl color-primary font-Gilroy-Semi-Bold"}>
                        Quakely
                    </Text>
                </View>
                <View className={"w-full flex flex-col justify-center items-center mt-8"}>
                    <Text className={"text-xl font-Gilroy-Medium"}>
                        Welcome to <Text className={"color-primary"}>Quakely</Text>! In order for the app to work optimally, the app has to request some permissions.
                        You can find more information in our <Text className={"underline"}>Privacy Policy</Text>.
                    </Text>

                    <Text className={"text-xl font-Gilroy-Medium mt-8"}>
                      This process should only take a minute. To proceed, please tap on the Next button shown below.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => router.navigate("/onboarding/location")} className={"w-[95%] h-14 flex flex-row justify-center items-center mt-12 bg-accented rounded-full"}>
                    <Text className={"text-2xl text-white font-Gilroy-Bold"}>Next</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
