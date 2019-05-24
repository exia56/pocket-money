import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header, Container, Body, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import AppStyle from '../constants/app-style';
import StyleModal from '../components/style-modal';
import SettingRow from '../components/setting-row';
import UserModel from '../model/user-model';
import CostModel from '../model/costs-model';

type Props = {

};
type State = {
  modal: Boolean,
  modalBtn: Boolean,
  errorInfo: String,
};

const key = {
  sycn: "同步",
  logout: "登出",
}

export default class SettingPage extends Component<Props, State> {
  state = {
    modal: false,
    modalBtn: false,
    errorInfo: '',
  }
  render() {
    const rows = Object.entries(key).map(([k, v], idx) => {
      return <SettingRow key={k} idx={v} caption={v} onPress={this.onRowPress} />
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
        <StyleModal
          visible={this.state.modal}
          caption={this.state.errorInfo}
          spinnerVisible={!this.state.modalBtn}
          btnVisible={this.state.modalBtn}
          btnText={"確定"}
          onButtonPress={() => this.setState({ modal: false })}
          onReturnPress={() => this.setState({ modal: false })}
          onOutsidePress={() => this.setState({ modal: false })} />
      </Container>
    )
  }

  onRowPress = (idx) => {
    switch (idx) {
      case key.sycn:
        this.setState({ errorInfo: "", modal: true, modalBtn: false }, () => {
          CostModel.syncCloud()
            .then(res => {
              this.setState({ modal: false });
            }).catch(err => {
              this.setState({ modalBtn: true, errorInfo: err });
            })
        });
        break;
      case key.logout:
        UserModel.removeUserIdAsync()
          .then(() => {
            this.toSplashPage();
          });
        break;
    }
  }

  onWillFocus = () => {
    this.setState({ errorInfo: "", modal: false, modalBtn: false });
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