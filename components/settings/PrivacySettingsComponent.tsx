import {ActivityIndicator, Alert, Linking, Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {CircularFlagWithMagnitude} from "../global/CircularFlagWithMagnitude";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Portal} from "@gorhom/portal";
import BottomSheet, {BottomSheetFlatList, BottomSheetView} from "@gorhom/bottom-sheet";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";
import {RadioButton} from "../global/RadioButton";
import {generateRandomEarthquakeData} from "../../utils/global/Randomizer";
import {EarthquakeRegionType} from "../../utils/global/Constants";
import {EarthquakeService} from "../../services/earthquake/EarthquakeService";
import {uniqBy} from "lodash";
import {EarthquakeDTO} from "../../services/earthquake/dto/EarthquakeDTO";
import { createShimmerPlaceHolder } from 'expo-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient'
import FontAwesome from "@expo/vector-icons/FontAwesome";
const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient)

export const PrivacySettingsComponent = () => {

    const sheetRef = useRef<BottomSheet>(null);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [statusBarColor, setStatusBarColor] = useState('transparent');

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

    const handleSheetOpen = () => {
        sheetRef.current?.snapToIndex(0);
    }

    const toggleModal = () => {
        if (!filterVisible) {
            setStatusBarColor("rgba(0, 0, 0, 0.5)");
        } else {
            setStatusBarColor("transparent");
        }
        setFilterVisible(!filterVisible);
    };

    return (
        <View className={"mt-6 w-full flex flex-col items-start justify-between"}>
            <TouchableOpacity onPress={() => handleSheetOpen()} className={"flex flex-row w-10/12 justify-between items-center"}>
                <View className={"flex flex-row items-center gap-5"}>
                    <View className={"flex flex-row justify-center items-center w-11 h-11 bg-purple-600 rounded-full"}>
                        <FontAwesome name="lock" size={20} color="white" />
                    </View>
                    <View className={"flex flex-row"}>
                        <Text className={"font-Gilroy-Medium text-xl"}>
                            Privacy
                        </Text>
                    </View>
                </View>
                <View className={"flex flex-row justify-center items-center w-6 h-6 bg-gray-200 rounded-full"}>
                    <View className={"font-Gilroy-Extra-Bold"}>
                        <FontAwesome name="chevron-right" size={12} color="white" />
                    </View>
                </View>
            </TouchableOpacity>
            <Portal>
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChange}
                    enablePanDownToClose={true}
                    onClose={handleClosePress}
                >
                    <BottomSheetView className={"w-full flex items-center justify-center"}>
                        <View className={"w-[90%] flex flex-row items-center justify-between"}>
                            <Text className={"text-2xl font-Gilroy-Semi-Bold my-4"}>
                                Real Time Alerts Settings
                            </Text>
                            <View className={"flex flex-row items-center justify-between gap-2"}>
                                <TouchableOpacity className={"flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F7F7F7]"} onPress={() => toggleModal()}>
                                    <Ionicons name="options" size={16} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className={"w-[90%] h-[0.5px] border border-t-[1px] border-gray-100/50 mb-4"}>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </Portal>
        </View>
    )
}
