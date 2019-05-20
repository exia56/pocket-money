import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native';
import { Header, Container, Body, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import UserModel from "../model/user-model";
import CostTypesModel from '../model/cost-types-model';
import SingleTon from '../respository/singleton';
import Appstyle from '../constants/app-style';
import CostType from '../constants/cost-type';
import PositiveButton from '../components/positive-button';

const focusKey = {
  key1: "key1",
  key2: "key2"
};

type Props = {

};
type State = {
  key1: String,
  key2: String,
  focusAt: Number
};
export default class KeyPairPage extends Component<Props, State> {
  state = {
    key1: "",
    key2: "",
    focusAt: 0
  }
  render() {
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          iosBarStyle={"light-content"}
          androidStatusBarColor={Appstyle.mainColor}
          style={styles.header}>
          <Text style={styles.headerText}>填寫個人密鑰</Text>
        </Header>
        <Content padder style={styles.container}>
          <Text style={styles.caution}>本密鑰僅僅只是用於唯一對應的帳號。</Text>
          <Text style={styles.caution}>本程式不會對使用者的記帳內容進行加密，敏感資料請勿直接記錄在此。</Text>
          <Text style={styles.caution}>密鑰最長十五個字。</Text>
          <View style={styles.row}>
            <Text style={styles.title}>密鑰1:</Text>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 1 ? styles.focus : {}])}
              ref={focusKey.key1}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 1 })}
              numberOfLines={1}
              maxLength={15}
              value={this.state.key1}
              onChangeText={(text) => this.setState({ key1: text })} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>密鑰2:</Text>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 2 ? styles.focus : {}])}
              ref={focusKey.key12}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 2 })}
              numberOfLines={1}
              maxLength={15}
              value={this.state.key2}
              onChangeText={(text) => this.setState({ key2: text })} />
          </View>
        </Content>
        <View style={StyleSheet.flatten([styles.row, styles.bottom])}>
          {/* <TouchableOpacity
            onPress={this.saveKey}
            style={styles.button}>
            <Text style={styles.buttonText}>開始</Text>
          </TouchableOpacity> */}
          <PositiveButton
            onPress={this.saveKey}
            style={styles.button}
            caption={"開始"}
          />
        </View>
      </Container>
    )
  }

  saveKey = () => {
    const userId = UserModel.generateUserId(this.state.key1.toLowerCase(), this.state.key2.toLowerCase())
    UserModel.initialUserDataAsync(userId)
      .then(_ => {
        return CostTypesModel.getCostTypesFromCloudAsync();
      }).then(costType => {
        console.log(11111)
        return CostTypesModel.setCostTypesToLocalAsync(costType);
      }).catch(res => {
        console.log(res);
        let costType = CostType.typeMapInt;
        return Promise.all([
          CostTypesModel.setCostTypesToLocalAsync(costType),
          CostTypesModel.setCostTypesToCloudAsync(costType)
        ]);
      }).then(() => {
        this.props.navigation.navigate(RouteName.ROUTE_SPLASH);
      });
  }

  onWillFocus = () => {

  }
}
const styles = StyleSheet.create({
  a: {},
  header: {
    backgroundColor: Appstyle.mainColor,
    justifyContent: "center",
  },
  headerText: {
    fontSize: Appstyle.headerFontSize,
    flex: 1,
    textAlign: "center",
    color: Appstyle.accentFontColor,
    alignItems: 'center',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    // padding: 10,
    // paddingBottom: 30
  },
  caution: {
    color: "#ee0a0a",
    fontSize: Appstyle.mainFontSize,
    margin: 5
  },
  bottom: {
    marginBottom: 10
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    margin: 5,
    justifyContent: "space-around"
  },
  title: {
    flex: 1,
    fontSize: Appstyle.mainFontSize,
    paddingVertical: 10,
  },
  valueWrapper: {
    flex: 3,
    padding: 10,
    fontSize: Appstyle.mainFontSize,
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
    fontSize: Appstyle.mainFontSize,
    padding: 0
  },
  button: {
    margin: 10,
    textAlign: "center",
    fontSize: Appstyle.mainFontSize,
    color: Appstyle.accentFontColor,
  },
  buttonText: {
  },
})