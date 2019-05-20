import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'native-base';

import AppStyle from '../constants/app-style';

type Props = {
  disable: Boolean,
  style: Style,
  onPress: () => {},
  caption: String
}
export default class PositiveButton extends Component<Props> {
  render() {
    const { fontSize, fontWeight, fontFamily, color, ...style } = this.props.style ? this.props.style : {};
    return (
      <TouchableOpacity disabled={this.props.disable}
        style={StyleSheet.flatten([styles.button, style])} onPress={this.onPress}>
        <Text style={{ fontSize, fontWeight, fontFamily, color }}>{this.props.caption}</Text>
      </TouchableOpacity>
    )
  }

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress();
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: AppStyle.accentFontColor,
    backgroundColor: AppStyle.mainColor,
    flex: 1,
  }
})