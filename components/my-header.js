import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import { Header } from 'native-base';

import AppStyle from '../constants/app-style';

type Props = {
  left: Element,
  body: Element,
  right: Element,
}
export default class MyHeader extends Component<Props> {
  render() {
    return (
      <Header
        iosBarStyle={"light-content"}
        androidStatusBarColor={AppStyle.mainColor}
        style={styles.header}>
        <View style={styles.left} >{this.props.left}</View>
        <View style={styles.body}>{this.props.body}</View>
        <View style={styles.right}>{this.props.right}</View>
      </Header>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: AppStyle.mainColor,
  },
  left: {
    flex: 1,
    justifyContent: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})