import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import AppStyle from '../constants/app-style';
import CostType from '../constants/cost-type';
import PositiveButton from '../components/positive-button';
import Header from '../components/my-header';

import UserModel from "../model/user-model";
import CostTypesModel from '../model/cost-types-model';

type Props = {

};
type State = {
  email: String,
  password: String,
  focusAt: Number
};
export default class SignUpPage extends Component<Props, State> {
  state = {
    email: "",
    password: "",
    focusAt: 0
  }
  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          left={<TouchableOpacity
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>}
          body={<Text style={styles.headerText}>註冊</Text>} />
        <Content padder style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.title}>帳號:</Text>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 1 ? styles.focus : {}])}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 1 })}
              numberOfLines={1}
              textContentType={"emailAddress"}
              value={this.state.email}
              onChangeText={(text) => this.setState({ email: text })} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>密碼:</Text>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 2 ? styles.focus : {}])}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 2 })}
              numberOfLines={1}
              secureTextEntry={true}
              textContentType={"password"}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })} />
          </View>
        </Content>
        <View style={StyleSheet.flatten([styles.row, styles.bottom])}>
          <PositiveButton
            onPress={this.signUp}
            style={styles.button}
            caption={"註冊"}
          />
        </View>
      </Container>
    )
  }

  signUp = () => {
    const {
      email: email,
      password: password,
    } = this.state;
    UserModel.createUser(email, password)
      .then(user => {
        return UserModel.initialUserDataAsync(user.user.uid);
      }).then(() => {
        let costType = CostType.typeMapInt;
        return Promise.all([
          CostTypesModel.setCostTypesToLocalAsync(costType),
          CostTypesModel.setCostTypesToCloudAsync(costType)
        ]);
      }).then(() => {
        this.props.navigation.navigate(RouteName.ROUTE_SPLASH);
      }).catch(this.handleError);
  }

  onWillFocus = () => {

  }

  toLastPage = () => {
    this.props.navigation.goBack();
  }

  handleError = (err) => {
    console.log(err);
  }
}
const styles = StyleSheet.create({
  a: {},
  headerText: {
    fontSize: AppStyle.headerFontSize,
    color: AppStyle.accentFontColor,
  },
  headerLeft: {
    padding: 10,
    fontSize: AppStyle.headerFontSize,
    color: AppStyle.accentFontColor,
  },
  container: {
    flex: 1,
    // padding: 10,
    // paddingBottom: 30
  },
  caution: {
    color: "#ee0a0a",
    fontSize: AppStyle.mainFontSize,
    margin: 5
  },
  bottom: {
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    margin: 5,
    justifyContent: "center"
  },
  title: {
    flex: 1,
    fontSize: AppStyle.mainFontSize,
    paddingVertical: 10,
  },
  valueWrapper: {
    flex: 3,
    padding: 10,
    fontSize: AppStyle.mainFontSize,
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 4
  },
  focus: {
    borderColor: "#0f0fff",
  },
  inputText: {
    flex: 1,
    alignSelf: "stretch",
    fontSize: AppStyle.mainFontSize,
    padding: 0
  },
  button: {
    margin: 10,
    textAlign: "center",
    fontSize: AppStyle.mainFontSize,
    color: AppStyle.accentFontColor,
  },
})