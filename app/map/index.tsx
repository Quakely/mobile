import React, {useEffect, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Animated, {FadeInLeft, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useLocalSearchParams} from "expo-router";
import MapView, {Callout, Details, Marker, PROVIDER_GOOGLE, Region} from "react-native-maps";
import {Entypo, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {EarthquakeService} from "../../services/earthquake/EarthquakeService";
import {EarthquakeType} from "../../utils/global/Constants";
import {EarthquakeDTO} from "../../services/earthquake/dto/EarthquakeDTO";
import * as Location from "expo-location";
import {RadioButton} from "../../components/global/RadioButton";
import {Image} from 'expo-image';

export default function Map() {
    const insets = useSafeAreaInsets();
    const mapRef = useRef<MapView | null>(null);

    const {
        latitude,
        longitude
    } = useLocalSearchParams<{ latitude?: string, longitude?: string }>();

    const animateToRegion = async() => {
        if (latitude && longitude && mapRef.current) {
            const region = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };

            mapRef.current.animateToRegion(region, 2500)
        }
    }

    const [earthquakeDetails, setEarthquakeDetails] = useState<any>(null);
    const [visibleEarthquakes, setVisibleEarthquakes] = useState<any[]>([]);
    const [filterMenuVisible, setFilterMenuVisible] = useState(false);
    const [filterOptions, setFilterOptions] = useState<{predicted: boolean, verified: boolean}>({predicted: false, verified: true})
    const [location, setLocation] = useState<any | null>({
        latitude: 90,
        longitude: 0,
        latitudeDelta: 90,
        longitudeDelta: 180
    });
    const [region, setRegion] = useState<Region | undefined>(undefined);

    const rotation = useSharedValue(0);

    const rotateIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const toggleFilterMenu = () => {
        setFilterMenuVisible(prev => {
            const newState = !prev;
            rotation.value = withTiming(newState ? 90 : 0, { duration: 300 });
            return newState;
        });
    };

    const handleMarkerPress = (earthquake: any) => {
        setEarthquakeDetails(earthquake);
    };

    const handleRegionChangeComplete = (async (region: Region, details: Details) => {
        let lat_min = region.latitude - (region.latitudeDelta / 2);
        let lat_max = region.latitude + (region.latitudeDelta / 2);

        let lng_min = region.longitude - (region.longitudeDelta / 2);
        let lng_max = region.longitude + (region.longitudeDelta / 2);

        let earthquakeTypes: EarthquakeType[] = [];

        if(filterOptions.verified) {
            earthquakeTypes.push(EarthquakeType.VERIFIED)
        } else {
            earthquakeTypes.push(EarthquakeType.PREDICTED);
        }

        const visibleQuakes = await EarthquakeService.getMapEarthquakes(earthquakeTypes,
            lat_min, lat_max, lng_min, lng_max);

        setVisibleEarthquakes(visibleQuakes.data);
        setRegion(region);
    });

    useEffect(() => {
        if(latitude && longitude) {
            animateToRegion()
        }
    }, [latitude, longitude])

    useEffect(() => {
        if(region) {
            handleRegionChangeComplete(region, {});
        }
    }, [filterOptions])

    useEffect(() => {
        if(mapRef.current) {
            if(!latitude && !longitude) {
                (async () => {
                    let currentLocation = await Location.getLastKnownPositionAsync({});

                    if(currentLocation) {
                        mapRef.current!.animateToRegion({
                            latitude: currentLocation.coords.latitude,
                            longitude: currentLocation.coords.longitude,
                            latitudeDelta: 7,
                            longitudeDelta: 7
                        }, 2500);
                    } else {
                        const visibleQuakes = await EarthquakeService.getMapEarthquakes([EarthquakeType.VERIFIED],
                         -90, 90, -180, 180);
                        setVisibleEarthquakes(visibleQuakes.data);
                    }
                })();
            }
        }
    }, [mapRef])

    const getMarkerColor = (magnitude: number) => {
        if(magnitude < 3) {
            return "#22c55e";
        }

        if(magnitude < 5) {
            return "#eab308";
        }

        if(magnitude < 7) {
            return "#f97316";
        }

        return "#ef4444";
    };

    return (
        <Animated.View className="flex-1 flex flex-col items-center justify-center bg-white" style={{paddingTop: insets.top}}>
            <View className="relative w-full flex-1 flex-col bg-white">
                <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={{width: '100%', height: '100%'}}
                         onRegionChangeComplete={handleRegionChangeComplete} onMapLoaded={animateToRegion}>
                    {visibleEarthquakes.map((earthquake: EarthquakeDTO) => (
                        <Marker
                            key={earthquake.id}
                            coordinate={{ latitude: earthquake.coordinates.coordinates[1], longitude: earthquake.coordinates.coordinates[0] }}
                            tracksViewChanges={false}
                        >
                            <View style={{backgroundColor: getMarkerColor(earthquake.magnitude)}} className={`rounded-full w-8 h-8 items-center justify-center`}>
                                <Text className={`text-white`}>{earthquake.magnitude}</Text>
                            </View>
                            <Callout style={{flex: 1, width:300}} tooltip onPress={() => handleMarkerPress(earthquake)}>
                                <View className={`flex flex-col bg-white p-2 rounded-2xl`}>
                                    <Image contentFit="cover" className={"w-[300px] h-[200px]"} source={earthquake.earthquakeImage}></Image>
                                    <View className={"mt-4 flex flex-row w-full justify-between items-center"}>
                                        <Text className={`font-Gilroy-Semi-Bold text-black text-xl truncate w-60`}>{earthquake.magnitude}ml - {earthquake.place}</Text>
                                        <View className={"flex items-center justify-center h-10 w-24 rounded-full bg-accented"}>
                                            <Text className={"text-sm text-white font-Sharp-Grotesk-Semi-Bold-25"}>{earthquake.source}</Text>
                                        </View>
                                    </View>
                                    <View className={"mt-4 flex flex-row items-center gap-2"}>
                                        <Ionicons name="time" size={20} color="black"/>
                                        <Text className={`font-Gilroy-Regular text-black text-lg`}>{new Date(earthquake.time).toISOString()}</Text>
                                    </View>
                                    <View className={"mt-1 flex flex-row items-center gap-2"}>
                                        <MaterialCommunityIcons name="tape-measure" size={20} color="black" />
                                        <Text className={`font-Gilroy-Regular text-black text-lg`}>{Math.abs(earthquake.depth)}km deep</Text>
                                    </View>
                                    <View className={"mt-1 flex flex-row items-center gap-2"}>
                                        <Entypo name="ruler" size={20} color="black" />
                                        <Text className={`font-Gilroy-Regular text-black text-lg`}>{earthquake.distance}km from your destination</Text>
                                    </View>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
                <TouchableOpacity className={"flex flex-row absolute left-6 top-5 gap-5 items-center justify-center"} onPress={toggleFilterMenu}>
                    <Animated.View className={"flex items-center justify-center w-10 h-10 rounded-full bg-white"} style={rotateIconStyle}>
                        <Ionicons name="filter" size={16} color="black" />
                    </Animated.View>
                    {filterMenuVisible && (
                        <Animated.View className={"flex flex-col bg-white rounded-3xl items-center"} entering={FadeInLeft.duration(250)}>
                            <TouchableOpacity className={"mx-4 my-4 flex flex-row items-center gap-5"} onPress={() => setFilterOptions({
                                ...filterOptions,
                                predicted: !filterOptions.predicted
                            })}>
                                <Text className={"font-Gilroy-Medium min-w-52"}>Predicted Earthquakes</Text>
                                <RadioButton isSelected={filterOptions.predicted}/>
                            </TouchableOpacity>
                            <View className={"w-[90%] h-[0.5px] border border-t-[1px] border-black"}/>
                            <TouchableOpacity className={"mx-4 my-4 flex flex-row items-center gap-5"} onPress={() => setFilterOptions({
                                ...filterOptions,
                                verified: !filterOptions.verified
                            })}>
                                <Text className={"font-Gilroy-Medium min-w-52"}>Verified Earthquakes</Text>
                                <RadioButton isSelected={filterOptions.verified}/>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}
