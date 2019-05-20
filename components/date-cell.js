import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import moment from 'moment';


type Props = {
  item: {
    mnt: Moment,
    year: Number,
    month: Number,
    day: Number
  },
  isThisMonth: Boolean,
  onPress: (item) => {}
};
type State = {
};
export default class DateCell extends Component<Props, State> {
  state = {
  }
  render() {
    let { mnt } = this.props.item,
      now = moment().startOf("date"),
      dateStyle = [styles.day];
    if (!this.props.isThisMonth)
      dateStyle.push(styles.notThisMonth);
    else if (mnt.isSame(now))
      dateStyle.push(styles.today);
    else if (mnt.weekday() === 0 || mnt.weekday() === 6)
      dateStyle.push(styles.weekend);
    let amount = this.props.item.amount;
    if (amount / 1000000 >= 1)
      amount = Math.round(amount / 1000000) + "M";
    else if (amount / 1000 >= 1)
      amount = Math.round(amount / 1000) + "K";
    return (
      <TouchableOpacity
        style={styles.container} onPress={this.onPress}>
        <Text style={StyleSheet.flatten(dateStyle)}>{this.props.item.day}</Text>
        <Text style={styles.amount} >{amount === 0 ? "" : amount}</Text>
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
    flex: 1,
    alignSelf: "stretch",
    borderWidth: 1,
    padding: 5
  },
  day: {
    fontSize: 16,
    marginBottom: 5
  },
  amount: {
    alignSelf: "stretch",
    textAlign: "right",
    fontSize: 14,
    lineHeight: 14
  },
  weekend: {
    color: "#ff0000"
  },
  today: {
    fontWeight: "bold",
    color: "#0000ff"
  },
  notThisMonth: {
    color: "#aaaaaa"
  }
})