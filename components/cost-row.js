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
    typeStr: String,
  },
  showDate: Boolean,
  onPress: (item) => {}
};
type State = {
};
export default class CostRow extends Component<Props, State> {
  state = {
  }
  render() {
    const { amount, day, detail, month, year, typeStr } = this.props.item;
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View style={styles.left}>
          <Text style={styles.type}>{typeStr}</Text>
          {detail ?
            <Text style={styles.detail}>{detail}</Text> :
            undefined}
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>{amount}</Text>
          {this.props.showDate ?
            <Text style={styles.date}>{`${year}/${month}/${day}`}</Text> :
            undefined}
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
    alignItems: "flex-end"
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
  },
  date: {
    fontSize: AppStyle.subFontSize - 3,
    color: AppStyle.subFontColor
  },
  a: {}
})