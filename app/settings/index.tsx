import React, {useEffect, useState} from 'react';
import {Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PermissionStatus, Subscription} from 'expo-modules-core';
import {Accelerometer} from 'expo-sensors';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useFocusEffect} from 'expo-router';
import {AndroidImportance, setNotificationChannelAsync} from 'expo-notifications';
import {Listener} from 'expo-sensors/src/DeviceSensor';
import {AccelerometerMeasurement} from 'expo-sensors/src/Accelerometer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from 'victory-native';
import {RealTimeAlertSettingsComponent} from "../../components/settings/RealTimeAlertSettingsComponent";
import {SeismicNotificationsSettingsComponent} from "../../components/settings/SeismicNotificationsSettingsComponent";
import {HelpSettingsComponent} from "../../components/settings/HelpSettingsComponent";
import {PrivacySettingsComponent} from "../../components/settings/PrivacySettingsComponent";
import {TermsSettingsComponent} from "../../components/settings/TermsSettingsComponent";
import {AccelerometerSensorComponent} from "../../components/settings/AccelerometerSensorComponent";

export default function Settings() {
    const insets = useSafeAreaInsets();

    return (
        <Animated.View className={"flex flex-grow"} style={{ paddingTop: insets.top }}>
            <ScrollView className={"h-screen w-screen flex flex-grow bg-white"} stickyHeaderIndices={[0]}>
                <View className="flex-row items-center justify-start bg-white w-full h-32">
                    <Text className="ml-7 font-Gilroy-Extra-Bold text-4xl">
                        Settings
                    </Text>
                </View>
                <AccelerometerSensorComponent/>
                <View className="flex flex-col items-start justify-between w-full ml-7">
                    <Text className="font-Gilroy-Semi-Bold text-2xl">
                        Additional Settings
                    </Text>

                    <RealTimeAlertSettingsComponent/>
                    <SeismicNotificationsSettingsComponent/>
                    <HelpSettingsComponent/>
                    <PrivacySettingsComponent/>
                    <TermsSettingsComponent/>
                </View>

                <View className={"flex flex-col w-full h-20"}/>
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    permissionBox: {
        flex: 1,
        flexDirection: 'row',
        width: 52,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#bfbfb9',
    },
});
