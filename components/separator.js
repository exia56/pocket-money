import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class Separator extends Component {
  render() {
    return (
      <View style={StyleSheet.flatten([{ borderColor: "#9a9a9a", borderWidth: 1, margin: 5 }, this.props.style])} />
    );
  }
}
