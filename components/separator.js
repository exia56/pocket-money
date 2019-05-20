import React, { Component } from "react";
import { View } from "react-native";

export default class Separator extends Component {
  render() {
    return (
      <View style={{ borderBottomColor: "#9a9a9a", borderBottomWidth: 2, margin: 5 }} />
    );
  }
}
