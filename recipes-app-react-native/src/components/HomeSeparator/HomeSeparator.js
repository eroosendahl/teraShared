import { TouchableHighlight, Image, Text, View } from "react-native";
import { mainStyles } from "../../AppStyles";

export default function HomeSeparator(props) {
    const styles = mainStyles
    const size = props.size

    if (size == "big") {
        return (
            <View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
            </View>

        )
    } else if (size == "medium") {
        return (
            <View>
                <View style={styles.homeBigSeparator}></View>
                <View style={styles.homeAltSeparator}></View>
                <View style={styles.homeBigSeparator}></View>
            </View>

        )
    }
    else if (size == "small") {
        return (
            <View style={styles.homeBigSeparator}></View>
        )
    } else if (size =="tiny") {
        return (
            <View style={{minHeight: 10, borderBottomColor: "green", borderStyle: "dotted", borderWidth: 4, borderColor: "green"}}></View>
        )
    }

}