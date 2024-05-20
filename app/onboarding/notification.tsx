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
import {OneSignal} from "react-native-onesignal";

export default function NotificationOnboarding() {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(0);

    const [onboarded, setOnboarded] = useRecoilState<boolean>(onboardingAtom);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    const requestNotificationPermission = async () => {
        await OneSignal.Notifications.requestPermission(true);
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
                        Notifications
                    </Text>
                    <Text className={"text-2xl color-primary font-Gilroy-Semi-Bold"}>
                        Step 3 of 4
                    </Text>
                </View>
                <LottieView
                    autoPlay
                    style={{
                        width: 200,
                        height: 140
                    }}
                    source={require("../../assets/animations/notification_onboard.json")}
                />
                <View className={"w-full flex flex-col justify-center"}>
                    <Text className={"text-xl font-Gilroy-Medium"}>
                        This app uses the notification permission to alert you about earthquakes which could affect you. Without this permission, you will not be notified.
                    </Text>
                    <Text className={"text-xl font-Gilroy-Medium mt-8"}>
                        Once allowed, your notification token will be saved on our end to potentially alert you afterwards. You can change this at any time from the Settings app.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    requestNotificationPermission().finally(() => {
                        router.navigate("/onboarding/accelerometer")
                    })
                }} className={"w-[95%] h-14 flex flex-row justify-center items-center mt-12 bg-accented rounded-full"}>
                    <Text className={"text-2xl text-white font-Gilroy-Bold"}>Next</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
