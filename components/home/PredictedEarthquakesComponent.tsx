import {ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient)

export const PredictedEarthquakesComponent = () => {

    const sheetRef = useRef<BottomSheet>(null);
    const [earthquakes, setEarthquakes] = useState<EarthquakeDTO[]>([]);
    const [filterVisible, setFilterVisible] = useState<boolean>(false);
    const [statusBarColor, setStatusBarColor] = useState('transparent');
    const [selectedOption, setSelectedOption] = useState<string>("time");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [page, setPage] = useState<number>(1);

    const fetchEarthquakes = async (regionType: EarthquakeRegionType, pageNumber: number) => {
        setIsLoading(true);
        try {
            const response = await EarthquakeService.getPredictedEarthquakes(regionType, pageNumber);
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

    const handleLoadMore = () => {
        if(isLoading) {
            return;
        }

        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchEarthquakes(EarthquakeRegionType.LOCAL, nextPage);
        }
    };

    useEffect(() => {
        setPage(1)
        fetchEarthquakes(EarthquakeRegionType.LOCAL, 1);
    }, [])


    const renderEarthquakes = () => {
        if (isLoading) {
            return Array(6).fill(0).map((_, index) => (
                <View key={index} className={"mr-5 w-44 h-52 rounded-2xl bg-[#f9f7f7] flex flex-col justify-center items-center"}>
                    <ShimmerPlaceHolder style={{width: 60, height: 60, borderRadius: 30, marginBottom: 10}} />
                    <ShimmerPlaceHolder style={{width: 100, height: 20, marginBottom: 5}} />
                    <ShimmerPlaceHolder style={{width: 134, height: 15}}/>
                </View>
            ));
        } else {
            return earthquakes.slice(0, 6).map(r => (
                <TouchableOpacity key={r.id} onPress={() => Alert.alert("PRESSED 1")}>
                    <View className={"mr-5 w-44 h-52 rounded-2xl bg-[#f9f7f7] flex flex-col justify-center items-center"}>
                        <CircularFlagWithMagnitude width={60} height={60} isoCode={r.isoCode!} magnitude={r.magnitude}/>
                        <Text className={"mt-2 text-base font-Gilroy-Bold"}>{r.place}</Text>
                        <Text className={"mt-1 w-32 text-sm text-center font-Gilroy-Semi-Bold"}>{new Date(r.time).toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
            ));
        }
    };

    return (
        <View className={"mt-6 w-full flex flex-col items-start justify-between"}>
            <View className={"w-full flex flex-row justify-between items-center"}>
                <Text className={"text-2xl font-Gilroy-Bold"}>
                    Predicted Earthquakes
                </Text>
                <TouchableOpacity onPress={() => handleSheetOpen()}>
                    <Text className={"text-center text-lg font-Gilroy-Semi-Bold"}>View all</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className={"w-[93%] flex flex-row overflow-visible mt-5"} horizontal={true} showsHorizontalScrollIndicator={false} onMoveShouldSetResponderCapture={() => {
                return true;
            }}>
                {renderEarthquakes()}
            </ScrollView>

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
                                Predicted Earthquakes
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
                            <TouchableOpacity className={"w-full flex items-center justify-center"}>
                                <View className={"w-[90%] flex flex-col items-center"}>
                                    <View className={"w-full flex flex-row items-center gap-5"}>
                                        <CircularFlagWithMagnitude width={60} height={60} isoCode={item.isoCode!} magnitude={item.magnitude}/>
                                        <View className={"flex flex-col flex-grow"}>
                                            <View className={"flex flex-row items-center justify-between"}>
                                                <Text className={"text-xl font-Gilroy-Medium"}>{item.place}</Text>
                                            </View>
                                            <View className={"mt-3 flex flex-row items-center"}>
                                                <Ionicons name="time" size={20} color="black"/>
                                                <Text className={"ml-2 text-base font-Gilroy-Regular"}>{new Date(item.time).toLocaleDateString()}</Text>
                                            </View>
                                            <View className={"flex flex-row items-center"}>
                                                <MaterialCommunityIcons name="map-marker-distance" size={20} color="black"/>
                                                <Text className={"ml-2 text-base font-Gilroy-Regular"}>{item.distance}km from your location</Text>
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
        </View>
    )
}
