import React, { useEffect, useState } from 'react';
import {View, Text, Modal, Button, Linking, Alert} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import Constants from 'expo-constants';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { Audio } from 'expo-av';
import { useRecoilState } from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { onboardingAtom } from '../context/atoms/onboarding.atom';
import { appLoadedAtom } from '../context/atoms/apploaded.atom';
import { QuakelyStorageKeys } from '../utils/storage/StorageKeys';
import notifee from '@notifee/react-native';
import * as Notifications from "expo-notifications";
import { EventRegister } from 'react-native-event-listeners';

const LOCATION_TASK_NAME = 'background-location-task';
const BACKGROUND_FETCH_TASK = 'background-fetch';
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
    await fetch('https://zburgerhouse.internalizable.dev/status', { method: 'GET' });
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        return;
    }
    if (data) {
        console.log(data);
    }
});

export default function App() {
    const [onboarded, setOnboarded] = useRecoilState(onboardingAtom);
    const [appLoaded, setAppLoaded] = useRecoilState(appLoadedAtom);
    const [modalVisible, setModalVisible] = useState(false);
    const [notificationData, setNotificationData] = useState(null);
    const [sound, setSound] = useState<Audio.Sound>();
    const router = useRouter();

    useEffect(() => {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize(Constants!.expoConfig!.extra!.oneSignalAppId);
    }, []);

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/alarm.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const registerBackgroundFetchAsync = async () => {
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 10,
            stopOnTerminate: false,
            startOnBoot: true,
        });
    };

    async function getInitialURL() {
        const url = await Linking.getInitialURL();
        if (url) {
            return url;
        }
    }

    useEffect(() => {
        if (appLoaded) {
            if (onboarded) {
                AsyncStorage.getItem(QuakelyStorageKeys.QUAKELY_USER_KEY).then(externalId => {
                    if (externalId) {
                        OneSignal.login(externalId);
                    }
                });

                getInitialURL().then(r => {
                    if (r == undefined) {
                        router.navigate('/home');
                    } else {
                        router.navigate(r);
                    }
                });
            } else {
                router.navigate('/onboarding');
            }
        }
    }, [appLoaded, onboarded]);

    const handleDismiss = () => {
        setModalVisible(false);
        setNotificationData(null);
    };

    const handleShowEarthquake = () => {
        setModalVisible(false);
        setNotificationData(null);
        router.navigate('/home');
    };

    return (
        <View style={{ flex: 1 }}>
            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                            <Text>Earthquake Alert!</Text>
                            <Button title="Dismiss" onPress={handleDismiss} />
                            <Button title="Show Earthquake" onPress={handleShowEarthquake} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}
