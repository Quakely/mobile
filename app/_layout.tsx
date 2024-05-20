import {
    SplashScreen,
    Slot, Stack, Tabs, router,
} from 'expo-router';
import {
    useFonts,
    Inter_500Medium,
    Inter_800ExtraBold,
    Inter_700Bold,
    Inter_600SemiBold
} from '@expo-google-fonts/inter';
import React, {useEffect, useState} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import AnimatedQuakelyIcon from "../components/root/AnimatedQuakelyIcon";
import AnimatedQuakelyScreen from "../screens/root/AnimatedQuakelyScreen";
import {Ionicons} from "@expo/vector-icons";
import QuakelyHomeIcon from "../components/root/QuakelyHomeIcon";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {load} from "@expo/env";
import {RecoilRoot, useRecoilState} from "recoil";
import {onboardingAtom} from "../context/atoms/onboarding.atom";
import QuakelyNavigationProvider from "../components/root/QuakelyNavigationProvider";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {cssInterop} from 'nativewind'
import { Image } from 'expo-image';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {PortalProvider} from "@gorhom/portal";
import { RootSiblingParent } from 'react-native-root-siblings';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import * as Notifications from 'expo-notifications';

cssInterop(Image, { className: "style" });
cssInterop(ShimmerPlaceholder, {className: "style"})

SplashScreen.preventAutoHideAsync();

function useNotificationObserver() {
    useEffect(() => {
        let isMounted = true;

        function redirect(notification: Notifications.Notification) {
            const url = notification.request.content.data?.url;
            if (url) {
                router.push(url);
            }
        }

        Notifications.getLastNotificationResponseAsync()
            .then(response => {
                if (!isMounted || !response?.notification) {
                    return;
                }
                redirect(response?.notification);
            });

        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            redirect(response.notification);
        });

        return () => {
            isMounted = false;
            subscription.remove();
        };
    }, []);
}

export default function RootLayout() {
    useNotificationObserver();

    const [fontsLoaded, fontError] = useFonts({
        'Gilroy-Bold': require('../assets/fonts/gilroy_bold.ttf'),
        'Gilroy-Extra-Bold': require('../assets/fonts/gilroy_extra_bold.ttf'),
        'Gilroy-Light': require('../assets/fonts/gilroy_light.ttf'),
        'Gilroy-Medium': require('../assets/fonts/gilroy_medium.ttf'),
        'Gilroy-Regular': require('../assets/fonts/gilroy_regular.ttf'),
        'Gilroy-Semi-Bold': require('../assets/fonts/gilroy_semi_bold.ttf'),
        'Honk-Sans-Regular': require('../assets/fonts/honk_sans_regular.otf'),
        'Sharp-Grotesk-Medium-25': require('../assets/fonts/sharp_grotesk_medium_25.otf'),
        'Sharp-Grotesk-Semi-Bold-25': require('../assets/fonts/sharp_grotesk_semi_bold_25.otf')
    });

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
            setReady(true);
        }
    }, [fontsLoaded, fontError]);

    if (!ready) {
        return <SafeAreaProvider>
            <AnimatedQuakelyScreen/>
        </SafeAreaProvider>;
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <RootSiblingParent>
                    <RecoilRoot>
                        <PortalProvider>
                            <QuakelyNavigationProvider/>
                        </PortalProvider>
                    </RecoilRoot>
                </RootSiblingParent>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}
