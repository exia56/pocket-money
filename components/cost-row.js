import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import AppStyle from '../constants/app-style';
import CostType from '../constants/cost-type';

type Props = {
  item: {
    id: String,
    amount: Number,
    dateStamp: Number,//YYYMMDD
    day: Number,
    detail: String,
    month: Number,
    type: Number,
    year: Number,
    typeStr: String
  },
  onPress: (item) => {}
};
type State = {
};
export default class CostRow extends Component<Props, State> {
  state = {
  }
  render() {

    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View style={styles.left}>
          <Text style={styles.type}>{this.props.item.typeStr}</Text>
          <Text style={styles.detail}>{this.props.item.detail}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>{this.props.item.amount}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress(this.props.item);
  }
}

const styles = StyleSheet.create({
  a: {},
  container: {
    alignSelf: "stretch",
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: "row"
  },
  left: {
    flex: 1
  },
  right: {
    alignItems: "center"
  },
  type: {
    fontSize: AppStyle.mainFontSize,
    color: AppStyle.mainFontColor
  },
  detail: {
    fontSize: AppStyle.subFontSize,
    color: AppStyle.subFontColor
  },
  amount: {
    fontSize: AppStyle.mainFontSize,
    color: AppStyle.accentColor
  }
})