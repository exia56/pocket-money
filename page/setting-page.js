import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header, Container, Body, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import RouteName from "../constants/route-name";
import AppStyle from '../constants/app-style';
import SettingRow from '../components/setting-row';
import UserModel from '../model/user-model';
import Singleton from '../respository/singleton';

type Props = {

};

export default class SettingPage extends Component<Props> {
  render() {
    const rows = ["登出"].map((v, idx) => {
      return <SettingRow key={idx} idx={idx} caption={v} onPress={this.onRowPress} />
    })
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          iosBarStyle={"light-content"}
          androidStatusBarColor={AppStyle.mainColor}
          style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: "center", alignSelf: "center" }}
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>
          <Text style={styles.headerText}>設定</Text>
          <View style={styles.headerLeft} />
        </Header>
        <Content contentContainerStyle={styles.container}>
          {rows}
        </Content>
      </Container>
    )
  }

  onRowPress = (idx) => {
    switch (idx) {
      case 0:
        Singleton.setUserIdAsync("");
        UserModel.removeUserIdAsync()
          .then(() => {
            this.toSplashPage();
          });
        break;
    }
  }

  onWillFocus = () => {
  }

  toSplashPage = () => {
    this.props.navigation.navigate(RouteName.ROUTE_SPLASH);
  }

  toLastPage = () => {
    this.props.navigation.goBack();
  }
}
const styles = StyleSheet.create({
  a: {},
  header: {
    backgroundColor: AppStyle.mainColor,
    justifyContent: "center",
  },
  headerText: {
    fontSize: AppStyle.headerFontSize,
    flex: 1,
    textAlign: "center",
    color: AppStyle.accentFontColor,
    alignItems: 'center',
    alignSelf: 'center',
  },
  headerLeft: {
    padding: 10,
    fontSize: AppStyle.headerFontSize,
    color: AppStyle.accentFontColor,
    alignItems: 'center',
    alignSelf: 'center',
  },
  container: {
  },
})