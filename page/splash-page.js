import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import AppStyle from '../constants/app-style';
import Header from '../components/my-header';

import Singleton from "../respository/singleton";
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
          body={<Text style={styles.headerText}>檢查使用者</Text>} />
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
        console.log('userId', userId);
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
  headerText: {
    fontSize: AppStyle.headerFontSize,
    color: AppStyle.accentFontColor,
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