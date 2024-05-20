import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Pressable, Text, TouchableOpacity, View} from 'react-native';
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
import {Accelerometer} from "expo-sensors";
import {PermissionStatus} from "expo-modules-core";
import {UserService} from "../../services/user/UserService";
import {RegisterUserDTO} from "../../services/user/dto/UserDTO";
import {OneSignal} from "react-native-onesignal";
import Toast from 'react-native-root-toast';
import {QuakelyStorageKeys} from "../../utils/storage/StorageKeys";

export default function CompleteOnboarding() {
    const insets = useSafeAreaInsets();
    const translateX = useSharedValue(0);

    const [onboarded, setOnboarded] = useRecoilState<boolean>(onboardingAtom);
    const [loading, setLoading] = useState<boolean>(false);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const registerUser = async () => {
        setLoading(true);

        let registerUserDTO = {
            coordinates: [0, 0],
            notification_options: {
                enabled: false,
                token: ""
            }
        } as RegisterUserDTO;

        let location = await Location.getLastKnownPositionAsync({});

        if(location) {
            registerUserDTO.coordinates = [location.coords.longitude, location.coords.latitude];
        }

        const notificationToken =  await OneSignal.User.pushSubscription.getIdAsync();

        if(notificationToken) {
            registerUserDTO.notification_options = {
                enabled: true,
                token: notificationToken
            }
        }

        try {
            const user = await UserService.createUser(registerUserDTO);

            await AsyncStorage.setItem(QuakelyStorageKeys.QUAKELY_USER_KEY, user.data.id);
            setOnboarded(true);
        } catch (e) {
            Toast.show((e as Error).message, {
                duration: Toast.durations.LONG,
            });
        } finally {
            setLoading(false)
        }
    }

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
                        Setup Complete
                    </Text>
                </View>
                <LottieView
                    autoPlay
                    style={{
                        width: 120,
                        height: 120
                    }}
                    source={require("../../assets/animations/complete_onboard.json")}
                />
                <View className={"w-full flex flex-col justify-center"}>
                    <Text className={"text-xl font-Gilroy-Medium"}>
                        Thank you for completing the setup. You are now ready to begin using Quakely! Tap the Proceed button to proceed to the app.
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                    registerUser()
                }} disabled={loading} className={"w-[95%] h-14 flex flex-row justify-center items-center mt-12 bg-accented rounded-full"}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : (
                        <Text className={"text-2xl text-white font-Gilroy-Bold"}>Proceed</Text>
                    )}
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
