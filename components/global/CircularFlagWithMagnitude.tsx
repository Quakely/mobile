import {Text, View} from "react-native";
import React from "react";
import {Image} from "expo-image";

export const CircularFlagWithMagnitude: React.FC<{
    isoCode: string,
    magnitude: number,
    width: number,
    height: number
}> = ({ isoCode, magnitude, width, height }) => (
    <View className={"flex"} style={{width: width + 8}}>
        <Image
            className={"rounded-full"}
            style={{ width, height }}
            source={isoCode != 'global' ? `https://hatscripts.github.io/circle-flags/flags/${isoCode}.svg` : 'https://firebasestorage.googleapis.com/v0/b/simly-dedfe.appspot.com/o/countries%2FGLOBAL.png?alt=media&token=59cdd766-c6d6-4787-a22a-55a62d571c2b'}
            contentFit="cover"
            transition={1000}
        />
        <View className={"absolute -top-2.5 -right-1.5 flex w-8 h-8 rounded-full items-center justify-center bg-secondary"}>
            <Text style={{fontSize: 12}} className={"text-primary-light font-Gilroy-Bold"}>{magnitude}</Text>
        </View>
    </View>
);
