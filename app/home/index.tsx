import {useSafeAreaInsets} from "react-native-safe-area-context";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {Redirect, useFocusEffect} from "expo-router";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import {LocationGeocodedAddress, LocationObject} from "expo-location";
import {generateRandomEarthquakeData} from "../../utils/global/Randomizer";
import * as Location from "expo-location";
import {ScrollView, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {OneSignal} from "react-native-onesignal";
import {RecentEarthquakesComponent} from "../../components/home/RecentEarthquakesComponent";
import {PredictedEarthquakesComponent} from "../../components/home/PredictedEarthquakesComponent";
import {FeltEarthquakeComponent} from "../../components/home/FeltEarthquakeComponent";

export default function Home() {
    const insets = useSafeAreaInsets();

    const translateX = useSharedValue(0);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const sheetRef = useRef<BottomSheet>(null);

    const [location, setLocation] = useState<LocationObject | null>(null);
    const [geoLocation, setGeoLocation] = useState<LocationGeocodedAddress[] | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [earthquakes, setEarthquakes] = useState<any[]>(generateRandomEarthquakeData(100));
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [statusBarColor, setStatusBarColor] = useState('transparent');
    const [selectedOption, setSelectedOption] = useState<string>("time");

    const snapPoints = useMemo(() => ["25%", "50%", "95%"], []);

    const handleSheetChange = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);
    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    useEffect(() => {
        (async () => {
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const geoCodedLocation = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            setGeoLocation(geoCodedLocation);
        })();
    }, []);

    return (
        <Animated.View className="flex-1 flex flex-col items-center justify-center bg-white" style={[animatedStyle]}>
            <View className="w-[90%] flex-1 flex-col bg-white" style={{paddingTop: insets.top + 20}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className={"w-full flex flex-row justify-between items-center mb-1"}>
                        <Text className={"text-4xl font-Gilroy-Semi-Bold"}>Home</Text>
                        <Ionicons name="notifications" size={25} color="black"/>
                    </View>
                    {geoLocation && <View className={"w-full flex flex-row items-center gap-1"}>
                        <Ionicons name="location" size={20} color="black" onPress={async () => {
                            const deviceState = await OneSignal.User.getOnesignalId();
                            console.log(deviceState);

                            const notificationToken = await OneSignal.User.pushSubscription.getTokenAsync();

                            console.log("NT: " + notificationToken);
                            const asdsa = await OneSignal.User.pushSubscription.getIdAsync();

                            console.log("NTID: " + asdsa);

                            await OneSignal.setConsentGiven(true);
                            const dadwad = await OneSignal.User.getExternalId();
                            console.log(dadwad);
                        }}/>
                        <Text className={"text-lg font-Gilroy-Regular"}>{geoLocation[0].city + ", " + geoLocation[0].country}</Text>
                    </View>}
                    <View className={"flex items-center justify-center w-full bg-accented h-48 rounded-3xl mt-8"}>
                        <View className={"flex items-center justify-center w-[90%]"}>
                            <Text className={"text-center text-lg text-white font-Sharp-Grotesk-Medium-25"}>No earthquakes recorded today in your area</Text>
                        </View>
                    </View>

                    <RecentEarthquakesComponent/>
                    <PredictedEarthquakesComponent/>
                    <FeltEarthquakeComponent/>

                    <View className={"flex flex-col w-full h-10"}/>
                </ScrollView>
            </View>
        </Animated.View>
    )
}
