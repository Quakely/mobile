import BottomSheet, {BottomSheetFlatList, BottomSheetView} from "@gorhom/bottom-sheet";
import {ActivityIndicator, Modal, Text, TouchableOpacity, View} from "react-native";
import {AntDesign, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {CircularFlagWithMagnitude} from "../global/CircularFlagWithMagnitude";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";
import {RadioButton} from "../global/RadioButton";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {generateRandomEarthquakeData} from "../../utils/global/Randomizer";
import {Portal} from "@gorhom/portal";
import {EarthquakeRegionType} from "../../utils/global/Constants";
import {capitalizeFirstOnly} from "../../utils/global/GlobalUtils";
import {EarthquakeDTO} from "../../services/earthquake/dto/EarthquakeDTO";
import {EarthquakeService} from "../../services/earthquake/EarthquakeService";
import {uniqBy} from "lodash";
import {Link} from "expo-router";
import { router } from 'expo-router';

export const RecentEarthquakesComponent = () => {
    const sheetRef = useRef<BottomSheet>(null);
    const [earthquakes, setEarthquakes] = useState<EarthquakeDTO[]>([]);
    const [earthquakeRegionType, setEarthquakeRegionType] = useState<EarthquakeRegionType | undefined>(undefined);

    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [statusBarColor, setStatusBarColor] = useState('transparent');
    const [selectedOption, setSelectedOption] = useState<string>("time");
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [page, setPage] = useState<number>(1);

    const snapPoints = useMemo(() => ["25%", "50%", "95%"], []);

    const fetchEarthquakes = async (regionType: EarthquakeRegionType, pageNumber: number) => {
        setIsLoading(true);
        try {
            const response = await EarthquakeService.getPaginatedEarthquakes(regionType, pageNumber);
            const responseData = response.data;

            const uniqueEarthquakes = uniqBy([...earthquakes, ...responseData.contents], 'id');
            setEarthquakes(uniqueEarthquakes);
            setTotalPages(responseData.total_pages);
        } catch (error) {
            console.error('Error fetching earthquakes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSheetChange = useCallback((index: number) => {
        console.log("handleSheetChange", index);
    }, []);

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);

    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
        setEarthquakeRegionType(undefined);
        setEarthquakes([]);
        setPage(1);
    }, []);

    const handleSheetOpen = (type: EarthquakeRegionType) => {
        setEarthquakeRegionType(type);
    }

    useEffect(() => {
        if(earthquakeRegionType) {
            sheetRef.current?.snapToIndex(0);
            fetchEarthquakes(earthquakeRegionType, 1);
        }
    }, [earthquakeRegionType])

    const toggleModal = () => {
        if (!filterVisible) {
            setStatusBarColor("rgba(0, 0, 0, 0.5)");
        } else {
            setStatusBarColor("transparent");
        }
        setFilterVisible(!filterVisible);
    };

    const handleLoadMore = () => {
        if(isLoading) {
            return;
        }

        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEarthquakes(earthquakeRegionType!, nextPage);
        }
    };

    return (
        <>
            <Text className={"text-2xl font-Gilroy-Bold mt-8"}>
                Recent Earthquakes
            </Text>

            <View className={"w-full h-20 flex flex-row items-center justify-between mt-4"}>
                <TouchableOpacity className={`flex w-[30%] h-14 rounded-full items-center justify-center transition-all ${earthquakeRegionType == EarthquakeRegionType.LOCAL ? "bg-gray-100/90" : ""}`} onPress={() => handleSheetOpen(EarthquakeRegionType.LOCAL)}>
                    <Text className={`text-center text-black font-Gilroy-Semi-Bold`}>
                        Local
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex w-[30%] h-14 rounded-full items-center justify-center transition-all ${earthquakeRegionType == EarthquakeRegionType.REGIONAL ? "bg-gray-100/90" : ""}`} onPress={() => handleSheetOpen(EarthquakeRegionType.REGIONAL)}>
                    <Text className={`text-center text-black font-Gilroy-Semi-Bold`}>
                        Regional
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex w-[30%] h-14 rounded-full items-center justify-center transition-all ${earthquakeRegionType == EarthquakeRegionType.GLOBAL ? "bg-gray-100/90" : ""}`} onPress={() => handleSheetOpen(EarthquakeRegionType.GLOBAL)}>
                    <Text className={`text-center text-black font-Gilroy-Semi-Bold`}>
                        Global
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
                    <BottomSheetView className={"w-full flex items-center justify-center"}>
                        <View className={"w-[90%] flex flex-row items-center justify-between"}>
                            <Text className={"text-2xl font-Gilroy-Semi-Bold my-4"}>
                                {capitalizeFirstOnly(earthquakeRegionType?.toLowerCase())} Earthquakes
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
                    <BottomSheetFlatList
                        data={earthquakes}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => (
                            <TouchableOpacity className={"w-full flex items-center justify-center"} onPress={() => {
                                handleClosePress();
                                router.push(`/map?latitude=${item.coordinates.coordinates[1]}&longitude=${item.coordinates.coordinates[0]}`)}
                            }>
                                <View className={"w-[90%] flex flex-col items-center"}>
                                    <View className={"w-full flex flex-row items-center gap-5"}>
                                        <CircularFlagWithMagnitude width={60} height={60} isoCode={item.isoCode!} magnitude={item.magnitude}/>
                                        <View className={"flex flex-col flex-grow"}>
                                            <View className={"flex flex-row items-center justify-between"}>
                                                <Text className={"text-xl font-Gilroy-Medium"}>{item.place}</Text>
                                            </View>
                                            <View className={"mt-3 flex flex-row items-center"}>
                                                <Ionicons name="time" size={20} color="black"/>
                                                <Text className={"ml-2 text-base font-Gilroy-Regular"}>{new Date(item.time).toLocaleDateString()} {new Date(item.time).toLocaleTimeString()}</Text>
                                            </View>
                                            <View className={"flex flex-row items-center"}>
                                                <MaterialCommunityIcons name="map-marker-distance" size={20} color="black"/>
                                                <Text className={"ml-2 text-base font-Gilroy-Regular"}>{item.distance!}km from your location</Text>
                                            </View>
                                        </View>
                                        <View className={"absolute top-0 right-0 flex items-center justify-center h-10 w-24 rounded-full bg-accented"}>
                                            <Text className={"text-sm text-white font-Sharp-Grotesk-Semi-Bold-25"}>{item.source}</Text>
                                        </View>
                                    </View>
                                    <View className={"my-5 w-full flex items-center justify-center"}>
                                        <View className={"w-full h-[0.5px] border border-t-[1px] border-gray-100/50"}>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
                        }
                    />
                </BottomSheet>

                <StatusBar style={"dark"} animated={true} backgroundColor={statusBarColor}/>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={filterVisible}
                    onRequestClose={() => {
                        toggleModal()
                    }}>
                    <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                            <View style={{width: '90%', backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
                                <Text className={"text-2xl font-Gilroy-Semi-Bold"}>Sort by</Text>
                                <View className={"mt-4 flex flex-col w-full gap-2"}>
                                    <View className={"flex flex-row w-full justify-between"}>
                                        <View className={"flex flex-row items-center"}>
                                            <Ionicons name="time" size={18} color="black"/>
                                            <Text className={"ml-2 text-xl font-Gilroy-Medium"}>Time</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setSelectedOption('time')}>
                                            <RadioButton isSelected={selectedOption === 'time'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className={"w-full flex items-center justify-center"}>
                                        <View className={"w-full h-[0.5px] border border-t-[1px] border-gray-100/60"}>
                                        </View>
                                    </View>
                                    <View className={"flex flex-row w-full justify-between"}>
                                        <View className={"flex flex-row items-center"}>
                                            <AntDesign name="shake" size={18} color="black" />
                                            <Text className={"ml-2 text-xl font-Gilroy-Medium"}>Magnitude</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setSelectedOption('magnitude')}>
                                            <RadioButton isSelected={selectedOption === 'magnitude'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className={"w-full flex items-center justify-center"}>
                                        <View className={"w-full h-[0.5px] border border-t-[1px] border-gray-100/60"}>
                                        </View>
                                    </View>
                                    <View className={"flex flex-row w-full justify-between"}>
                                        <View className={"flex flex-row items-center"}>
                                            <MaterialCommunityIcons name="map-marker-distance" size={18} color="black"/>
                                            <Text className={"ml-2 text-xl font-Gilroy-Medium"}>Distance</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setSelectedOption('distance')}>
                                            <RadioButton isSelected={selectedOption === 'distance'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity className={"mt-8 flex items-center justify-center w-full h-14 bg-accented rounded-2xl"} onPress={() => toggleModal()}>
                                    <Text className={"text-white text-2xl font-Gilroy-Bold"}>APPLY</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>
                </Modal>
            </Portal>
        </>
    )
}
