import React, {useEffect, useState} from 'react';
import {Stack, Tabs} from "expo-router";
import QuakelyHomeIcon from "./QuakelyHomeIcon";
import {Ionicons} from "@expo/vector-icons";
import {useRecoilState} from "recoil";
import {onboardingAtom} from "../../context/atoms/onboarding.atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View} from "react-native";
import {QuakelyStorageKeys} from "../../utils/storage/StorageKeys";
import {appLoadedAtom} from "../../context/atoms/apploaded.atom";

export default function QuakelyNavigationProvider() {
    const [onboarded, setOnboarded] = useRecoilState<boolean>(onboardingAtom);
    const [appLoaded, setAppLoaded] = useRecoilState<boolean>(appLoadedAtom);

    const isOnboarded = async () => {
        try {
            const value = await AsyncStorage.getItem(QuakelyStorageKeys.QUAKELY_USER_KEY);
            return value !== null;
        } catch (e) {
            return false;
        }
    };

    const loadModules = async () => {
        setOnboarded(await isOnboarded());
        console.log("Set onboarded to " + onboarded);
    }

    useEffect(() => {
        loadModules().then(r => {
            setAppLoaded(true)
            console.log("Loaded all modules!");
            console.log("Onboarded: " + onboarded)
        })
    }, []);

    return !onboarded ? (
        <Stack screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name="onboarding"
                options={{
                    title: 'Onboarding',
                }}
            />
        </Stack>
    ) : (
        <Tabs initialRouteName={"Home"} screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <QuakelyHomeIcon width={32} height={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="onboarding"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <Ionicons name="map" size={32} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Ionicons name="settings" size={32} color={color} />,
                }}
            />
        </Tabs>
    );
}

