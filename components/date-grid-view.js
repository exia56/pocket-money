import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import DateCell from './date-cell';

type DateToCell = {
  id: String,
  year: Number,
  month: Number,
  day: Number,
  amount: Number,
  dateStamp: Number,
  detail: String
}
type Props = {
  dayArray: Array<DateToCell>,
  onCellPress: (DateToCell) => {},
};
type State = {
};
export default class DateGridView extends Component<Props, State> {
  state = {
  }
  render() {
    let rows = [],
      idx = 0,
      middleMonth = this.props.dayArray[21].month;
    while (idx < this.props.dayArray.length) {
      rows.push(this.props.dayArray.slice(idx, idx + 7));
      idx += 7;
    }
    rows = rows.map((v, idx) => {
      let dateCells = v.map(d => {
        return <DateCell key={d.dateStamp} item={d} isThisMonth={middleMonth == d.month} onPress={this.onCellPress} />
      });
      return (
        <View key={"row" + idx} style={styles.row}>
          {dateCells}
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={StyleSheet.flatten([styles.weekDay, styles.weekend])}>日</Text>
          <Text style={styles.weekDay}>一</Text>
          <Text style={styles.weekDay}>二</Text>
          <Text style={styles.weekDay}>三</Text>
          <Text style={styles.weekDay}>四</Text>
          <Text style={styles.weekDay}>五</Text>
          <Text style={StyleSheet.flatten([styles.weekDay, styles.weekend])}>六</Text>
        </View>
        <View style={{ borderWidth: 2, alignSelf: "stretch" }}>
          {rows}
        </View>
      </View>
    );
  }

  onCellPress = (date) => {
    if (this.props.onCellPress)
      this.props.onCellPress(date);
  }
}
const styles = StyleSheet.create({
  a: {},
  container: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch"
  },
  weekDay: {
    flex: 1,
    fontSize: 18,
    textAlign: "center",
    padding: 5
  },
  dateText: {
    fontSize: 12
  },
  amountText: {
    fontSize: 18
  },
  weekend: {
    color: "#ff0000"
  },
  today: {
    color: "#0000ff"
  }
})