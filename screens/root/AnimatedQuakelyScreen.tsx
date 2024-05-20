import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import AnimatedQuakelyIcon from "../../components/root/AnimatedQuakelyIcon";

export default function AnimatedQuakelyScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <AnimatedQuakelyIcon/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
