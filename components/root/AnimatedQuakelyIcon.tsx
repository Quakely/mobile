import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import {StyleSheet, Text} from "react-native";
import React, {useEffect} from "react";

export default function AnimatedQuakelyIcon() {
    const shakeX = useSharedValue(0);

    const earthquakeStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: shakeX.value}],
        };
    });

    useEffect(() => {
        shakeX.value = withRepeat(withTiming(-10, {duration: 100}), -1, true);
    }, []);


    return (
        <Animated.View style={[earthquakeStyle, styles.earthquake]}>
            <Text>Splash Screen</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    earthquake: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
