import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Header, Container, Content, Spinner } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import Singleton from "../respository/singleton";
import AppStyle from '../constants/app-style';

import UserModel from '../model/user-model';

type Props = {

};
type State = {
  date: Moment,
  dayArray: Array,
  monthly: Number
};
export default class SplashPage extends Component<Props, State> {
  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          iosBarStyle={"light-content"}
          androidStatusBarColor={AppStyle.mainColor}
          style={styles.header}>
          <Text style={styles.headerText}>檢查使用者</Text>
        </Header>
        <Content contentContainerStyle={styles.container}>
          <Spinner size={"large"} color={AppStyle.mainColor} />
        </Content>
      </Container>
    )
  }

  toMainRoute = () => {
    this.props.navigation.navigate(RouteName.ROUTE_MAIN);
  }

  toKeyRoute = () => {
    this.props.navigation.navigate(RouteName.ROUTE_KEY);
  }

  onWillFocus = () => {
    UserModel.getUserIdAsync()
      .then(userId => {
        if (userId) {
          return Singleton.setUserIdAsync(userId);
        }
        else return Promise.reject(new Error("non account"));
      })
      .then(res => {
        console.log("onWillFocus", "setUserIdAsync");
        this.toMainRoute();
      })
      .catch(err => {
        console.log(err);
        this.toKeyRoute();
      })
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: AppStyle.mainFontSize,
  }
})