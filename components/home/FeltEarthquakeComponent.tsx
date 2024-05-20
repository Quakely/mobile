import {Alert, Modal, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Portal} from "@gorhom/portal";
import BottomSheet, {BottomSheetFlatList, BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import {capitalizeFirstOnly} from "../../utils/global/GlobalUtils";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {CircularFlagWithMagnitude} from "../global/CircularFlagWithMagnitude";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";
import {RadioButton} from "../global/RadioButton";
import {generateRandomEarthquakeData} from "../../utils/global/Randomizer";
import {EarthquakeRegionType} from "../../utils/global/Constants";
import LottieView from "lottie-react-native";

export const FeltEarthquakeComponent = () => {

    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["85%"], []);

    const handleSheetChange = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index, {
            duration: 200
        });
    }, []);

    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const showAlert = (message: string) => {
        Alert.alert(
            "Confirmation Required",
            "Are you sure you'd like to report the following: " + message + "?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "CONFIRM", onPress: () => console.log("OK Pressed") }
            ],
            { cancelable: true }
        );
    };

    return (
        <View className={"mt-4 flex flex-col"}>
            <Text className={"text-2xl font-Gilroy-Bold"}>
                Reports
            </Text>
            <View className={"flex flex-col w-full h-44 rounded-3xl bg-gray-100/90 items-center justify-center mt-4"}>
                <Text className={"text-2xl text-center text-accented font-Gilroy-Semi-Bold"}>
                    834
                </Text>
                <Text className={"text-xl text-center text-black font-Gilroy-Semi-Bold"}>
                    reports in the last 24h
                </Text>
                <TouchableOpacity className={"mt-3 px-7 py-2 flex items-center justify-center bg-accented rounded-3xl"} onPress={() => handleSnapPress(0)}>
                    <Text className={"text-xl text-center text-white font-Gilroy-Semi-Bold"}>
                        I felt an earthquake!
                    </Text>
                </TouchableOpacity>
            </View>
            <Portal>
                <BottomSheet
                    ref={sheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChange}
                    enablePanDownToClose={true}
                    onClose={handleClosePress}
                >
                    <BottomSheetScrollView contentContainerClassName={"items-center justify-center"}
                                           className={"w-full flex"}>
                        <View className={"w-[90%] flex flex-col items-start justify-center"}>
                            <View className={"w-full flex flex-row items-center justify-between"}>
                                <Text className={"text-2xl font-Gilroy-Bold my-2"}>
                                    I felt an earthquake!
                                </Text>
                                <LottieView
                                    autoPlay
                                    style={{
                                        width: 180,
                                        height: 50,
                                        transform: [
                                            { scale: 3.25 },
                                            { scaleX: -1 }
                                        ]
                                    }}
                                    source={require("../../assets/animations/earthquake-feel.json")}
                                />
                            </View>
                            <Text className={"text-lg font-Gilroy-Semi-Bold my-2"}>
                                Please select which best describes how you felt the earthquake.
                            </Text>
                            <View className={"w-[95%] h-[0.5px] border border-t-[1px] border-gray-100/50 mb-4"}>
                            </View>
                            <View className={"w-full flex flex-col justify-between gap-3"}>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-gray-300 rounded-3xl"}  onPress={() => showAlert("II - Barely perceived")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>II - Barely perceived</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-purple-300 rounded-3xl"} onPress={() => showAlert("III - Vibrations similar to a truck passing by")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>III - Vibrations similar to a truck passing by</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-blue-300 rounded-3xl"} onPress={() => showAlert("IV - Vibrations of windows, slight oscillations of hanging objects")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>IV - Vibrations of windows, slight oscillations of hanging objects</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-green-300 rounded-3xl"} onPress={() => showAlert("V - Falling objects from the shelves")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>V - Falling objects from the shelves</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-yellow-300 rounded-3xl"} onPress={() => showAlert("VI - Small cracks in buildings and shattered windows")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>VI - Small cracks in buildings and shattered windows</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-orange-300 rounded-3xl"} onPress={() => showAlert("VII - Damages in buildings, difficulty in standing up")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>VII - Damages in buildings, difficulty in standing up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-orange-500 rounded-3xl"} onPress={() => showAlert("VIII - Evident damages in buildings and partial collapses")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>VIII - Evident damages in buildings and partial collapses</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-orange-700 rounded-3xl"} onPress={() => showAlert("IX - Consistent collapses in buildings, people thrown to the ground")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>IX - Consistent collapses in buildings, people thrown to the ground</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className={"px-5 py-3 w-full flex flex-row items-center bg-red-700 rounded-3xl"} onPress={() => showAlert("X - Whole area and buildings collapsed")}>
                                    <Text className={"text-base font-Sharp-Grotesk-Semi-Bold-25"}>X - Whole area and buildings collapsed.</Text>
                                </TouchableOpacity>
                            </View>
                            <View className={"flex flex-col w-full h-10"}/>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </Portal>
        </View>
    )
}
