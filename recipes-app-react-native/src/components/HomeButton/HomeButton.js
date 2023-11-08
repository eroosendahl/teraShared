import React from "react";
import { TouchableHighlight, Image, Text, View } from "react-native";
import PropTypes from "prop-types";
// import styles from "./styles";
import { mainStyles } from '../../AppStyles'

export default function MenuButton(props) {
  const { title, onPress, source } = props;
  styles = mainStyles

  return (
    <TouchableHighlight underlayColor={'#d3d3d3'} title={title} style={styles.headerButtonContainer} onPress={onPress}>
      <View>
        <Text>Home</Text>
        <Image style={styles.headerButtonImage} source={require("../../../assets/icons/home.png")} />
      </View>
    </TouchableHighlight>
  );
}

MenuButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
