import {VictoryAxis, VictoryChart, VictoryLine, VictoryTheme} from "victory-native";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
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
import {PermissionStatus, Subscription} from "expo-modules-core";
import {Accelerometer} from "expo-sensors";
import {Listener} from "expo-sensors/src/DeviceSensor";
import {AccelerometerMeasurement} from "expo-sensors/src/Accelerometer";
import {AndroidImportance, setNotificationChannelAsync} from "expo-notifications";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useFocusEffect} from "expo-router";
const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient)

export const AccelerometerSensorComponent = () => {

    const [isAccelerometerAvailable, setAccelerometerAvailable] = useState<boolean>();
    const [hasAccelerometerPermission, setAccelerometerPermission] = useState<boolean>();
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [idle, setIdle] = useState<boolean>(false);
    const [data, setPlotData] = useState<Array<{ time: number, value: number }>>([]);

    const initializeAccelerometer = async () => {
        const hasAccelerometer = await Accelerometer.isAvailableAsync();
        console.log(hasAccelerometer);
        setAccelerometerAvailable(hasAccelerometer);

        if (hasAccelerometer) {
            const accelerometerPermissionResponse = await Accelerometer.getPermissionsAsync();

            if (accelerometerPermissionResponse.status === PermissionStatus.GRANTED) {
                console.log("Already granted");
                setAccelerometerPermission(true);
                Accelerometer.setUpdateInterval(500);
                _subscribe();
            } else {
                setAccelerometerPermission(false);
                console.log("Not granted");
            }
        }
    };

    const accelerometerListener: Listener<AccelerometerMeasurement> = (event) => {
        const alpha = 0.8;
        let gravity = [0, 0, 0];

        gravity[0] = alpha * gravity[0] + (1 - alpha) * event.x;
        gravity[1] = alpha * gravity[1] + (1 - alpha) * event.y;
        gravity[2] = alpha * gravity[2] + (1 - alpha) * event.z;

        const linearAcceleration = [
            event.x - gravity[0],
            event.y - gravity[1],
            event.z - gravity[2],
        ];

        setData({
            x: event.x - gravity[0],
            y: event.y - gravity[1],
            z: event.z - gravity[2],
        });

        const accelerationMagnitude = Math.sqrt(
            linearAcceleration[0] * linearAcceleration[0] +
            linearAcceleration[1] * linearAcceleration[1]
        );

        const idleThreshold = 0.3;

        if (accelerationMagnitude < idleThreshold) {
            setIdle(true);
        } else {
            setIdle(false);
        }

        const currentTime = new Date().getTime();
        setPlotData((prevData) => {
            const newData = [...prevData, { time: currentTime, value: accelerationMagnitude}];
            return newData.slice(-5).filter(d => !isNaN(d.value));
        });
    };

    const _subscribe = () => {
        setSubscription(Accelerometer.addListener(accelerometerListener));
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    const requestAccelerometerPermission = async () => {
        const accelerometerPermissionResponse = await Accelerometer.requestPermissionsAsync();

        if (accelerometerPermissionResponse.status === PermissionStatus.GRANTED) {
            setAccelerometerPermission(true);
            Accelerometer.setUpdateInterval(500);
            _subscribe();
        }
    };

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await setNotificationChannelAsync('default', {
                name: 'default',
                importance: AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(() =>
            initializeAccelerometer().then(() => console.log('Initialized accelerometer')))
        return () => _unsubscribe();
    }, []);

    const translateX = useSharedValue(0);

    useFocusEffect(() => {
        translateX.value = withTiming(0, { duration: 300 });
    });

    return (

        <View className="flex flex-col items-start justify-between w-full ml-7">
            <View className={"flex flex-row items-center"}>
                <Text className="font-Gilroy-Semi-Bold text-2xl">
                    Accelerometer Sensor
                </Text>

                <View className={`flex ${idle ? 'bg-green-300' : 'bg-red-400'} rounded-full w-28 h-10 items-center justify-center ml-5`}>
                    <Text className={"font-Gilroy-Semi-Bold text-white text-xl"}>{idle ? 'Idle' : 'Not Idle'}</Text>
                </View>
            </View>

            <View style={{ marginTop: 10, width: '100%', height: 300 }}>
                <View style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
                    <VictoryChart theme={VictoryTheme.material} domain={{y: [0, 0.3]}} scale={{x: "time", y: "linear"}} height={300}>
                        <VictoryAxis
                            dependentAxis
                            style={{
                                axis: { stroke: "#756f6a" },
                                grid: { stroke: ({ tick }) => tick === 0 ? "grey" : "transparent" }
                            }}
                        />
                        <VictoryAxis
                            tickFormat={() => ''}
                            style={{
                                axis: { stroke: "#756f6a" },
                                ticks: { stroke: "grey", size: 5 },
                                tickLabels: { fontSize: 10, padding: 5 }
                            }}
                        />
                        <VictoryLine
                            data={data}
                            x="time"
                            y="value"
                            interpolation="natural"
                            style={{
                                data: { stroke: '#c43a31' }
                            }}
                        />
                    </VictoryChart>
                </View>
            </View>
        </View>
    )
}
