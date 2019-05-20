import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Icon } from 'native-base';

import AppStyle from '../constants/app-style';

type Props = {
  idx: Number,
  caption: String,
  onPress: (idx) => {},
}
export default class SettingRow extends Component<Props> {
  render() {
    return (
      <TouchableOpacity style={{ alignSelf: "stretch" }} onPress={this.onPress}>
        <View style={styles.settingRow}>
          <Text style={styles.rowTitle}>
            {this.props.caption}
          </Text>
          <View style={styles.rowIcon}>
            <Icon style={styles.icon} name="arrow-forward" />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onPress = () => {
    if (this.props.onPress)
      this.props.onPress(this.props.idx);
  }
}

const styles = StyleSheet.create({
  settingRow: {
    padding: 15,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  rowTitle: {
    flex: 1,
    textAlign: "left",
    fontSize: AppStyle.mainFontSize,
    justifyContent: "center"
  },
  rowIcon: {
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    fontSize: AppStyle.mainFontSize,
  }
})