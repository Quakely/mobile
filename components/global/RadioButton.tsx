import {View} from "react-native";
import React from "react";

export const RadioButton: React.FC<{isSelected: boolean}> = ({ isSelected }) => (
    isSelected ?
        <View className={`flex items-center justify-center w-5 h-5 rounded-full ${isSelected ? 'bg-accented' : ''}`}>
            <View className={"absolute w-2 h-2 rounded-full bg-white"}/>
        </View> :
    <View className={`w-5 h-5 rounded-full border border-black bg-white`} />
);
