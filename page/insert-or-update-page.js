import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, Platform, TouchableOpacity } from 'react-native';
import { Header, Container, Body, Textarea, Icon, Button, Form, Picker, Content } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import CostType from '../constants/cost-type';
import DatePicker from '../components/date-picker';
import Appstyle from '../constants/app-style';

import UserModel from '../model/user-model';
import CostTypesModel from '../model/cost-types-model';
import CostsModel from '../model/costs-model';
import StyleModal from '../components/style-modal';
import PromiseTimeout from '../helper/promise-timeout';

const focusKey = {
  date: "date",
  type: "type",
  amount: "amount",
  detail: "detail"
};

type Props = {

};
type State = {
  id: String,
  date: Moment,
  type: Number,
  amount: Number,
  detail: String,
  focusAt: Number,
  errorInfo: String,
  modal: Boolean,
  modalBtn: Boolean,
  costTypes: Object
};
export default class InsertOrUpdatePage extends Component<Props, State> {
  state = {
    id: "",
    date: moment().format("YYYY-MM-DD"),
    type: 1,
    amount: "",
    detail: "",
    focusAt: 0,
    errorInfo: undefined,
    modal: false,
    modalBtn: false,
    costTypes: {}
  }
  render() {
    const { fontSize, ...value } = styles.inputText;
    const costKey = Object.keys(this.state.costTypes),
      pickerItem = costKey ? costKey.map((v, idx) => {
        return <Picker.Item key={idx} label={v} value={this.state.costTypes[v]} />
      }) : [];
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          iosBarStyle={"light-content"}
          androidStatusBarColor={Appstyle.mainColor}
          style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: "center", alignSelf: "center" }}
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{this.state.id ? "更新" : "新增"}</Text>
          <View style={styles.headerLeft} />
        </Header>
        <Content
          padder
          style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.title}>日期:</Text>
            <View style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 1 ? styles.focus : {}])}>
              <DatePicker
                ref={focusKey.date}
                defaultDate={moment().toDate()}
                placeHolderTextStyle={styles.inputText}
                // placeHolderText="Select date"
                textStyle={styles.inputText}
                formatChosenDate={date => moment(date).format("YYYY-MM-DD")}
                onDateChange={date => {
                  this.setState({ date: moment(date).format("YYYY-MM-DD"), focusAt: 1 });
                }} />
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>種類:</Text>
            <Form style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 2 ? styles.focus : {}])}>
              <Picker
                enabled
                mode="dropdown"
                style={StyleSheet.flatten([value, {
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  padding: 0,
                  height: "auto",
                }])}
                textStyle={StyleSheet.flatten([{ fontSize }, {
                  paddingLeft: 0,
                  paddingRight: 0,
                  flex: 1
                }])}
                iosIcon={<Icon name="arrow-dropdown" style={{ marginRight: 0 }} />}
                selectedValue={this.state.type}
                onValueChange={(i) => {
                  this.setState({ type: i, focusAt: 2 });
                }}
              >
                {pickerItem}
              </Picker>
            </Form>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>花費:</Text>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 3 ? styles.focus : {}])}
              ref={focusKey.amount}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 3 })}
              numberOfLines={1}
              keyboardType={"numeric"}
              value={this.state.amount}
              onChangeText={(text) => this.setState({ amount: text })} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>細項:</Text>
            <Textarea
              rowSpan={5}
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 4 ? styles.focus : {}])}
              ref={focusKey.detail}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 4 })}
              value={this.state.detail}
              onChangeText={(text) => this.setState({ detail: text })}
              onChange={(e) => {
                if (Platform.OS === "android") {
                  this.setState({ detail: e.nativeEvent.text })
                }
              }} />
          </View>
          {this.state.errorInfo ? <Text style={styles.errorInfo}>{this.state.errorInfo}</Text> : null}
        </Content>
        <View style={StyleSheet.flatten([styles.row, styles.bottom])}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.saveCost}>
            <Text style={styles.buttonText}>{this.state.id ? "更新" : "新增"}</Text>
          </TouchableOpacity>
          {this.state.id ?
            <TouchableOpacity
              style={styles.button}
              onPress={this.deleteCost}>
              <Text style={styles.buttonText}>刪除</Text>
            </TouchableOpacity> : null}
          <TouchableOpacity
            style={styles.button}
            onPress={this.toLastPage}>
            <Text style={styles.buttonText}>取消</Text>
          </TouchableOpacity>
        </View>
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

  saveCost = () => {
    const data = this.getCostData();
    let promiseFlow;
    if (data.id.length <= 1) {
      delete data.id;
      promiseFlow = CostsModel.insert(data);
    } else {
      promiseFlow = CostsModel.update(data);
    }
    PromiseTimeout.wrapTimeout(promiseFlow)
      .then(res => {
        this.toLastPage();
      }).catch(this.handleError);
  }

  deleteCost = () => {
    const data = this.getCostData();

    PromiseTimeout.wrapTimeout(CostsModel.delete(data))
      .then(res => this.toLastPage())
      .catch(this.handleError)
  }

  getCostData = () => {
    const { id,
      date,
      type,
      amount,
      detail } = this.state;
    const momentDate = moment(date, "YYYY-MM-DD");
    const data = { id, type, amount, detail };
    data.year = momentDate.year();
    data.month = momentDate.month();
    data.day = momentDate.date();
    data.amount = +data.amount;
    data.dateStamp = +momentDate.format("YYYYMMDD");
    return data;
  }

  onWillFocus = () => {
    let params = this.props.navigation.state.params;
    if (params && params.id) {
      params.amount = `${params.amount}`;
      this.setState(params);
    }
    if (params && params.dateStamp) {
      this.refs[focusKey.date].setDate(moment(params.dateStamp, "YYYYMMDD").toISOString());
    }
    this.setState({ errorInfo: "", modal: true, modalBtn: false }, () => {
      CostTypesModel.getCostTypeFromLocalAsync()
        .then(res => {
          this.setState({ costTypes: res, modal: false });
        })
    })
  }

  handleError = (err) => {
    console.log(err, PromiseTimeout.TimeoutError === err);
    if (err === PromiseTimeout.TimeoutError) {
      this.toLastPage();
    } else {
      this.setState({ errorInfo: `${err.message}\n${err.stack}` });
    }
  }

  toLastPage = () => {
    this.props.navigation.goBack();
  }
}
const styles = StyleSheet.create({
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
  headerLeft: {
    padding: 10,
    fontSize: Appstyle.headerFontSize,
    color: Appstyle.accentFontColor,
    alignItems: 'center',
    alignSelf: 'center',
  },
  container: {
    flex: 1
  },
  bottom: {
    // marginBottom: 20,
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
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 4,
    shadowColor: Appstyle.accentFontColor,
    backgroundColor: Appstyle.mainColor,
    flex: 1,
    margin: 10
  },
  buttonText: {
    textAlign: "center",
    fontSize: Appstyle.mainFontSize,
    color: Appstyle.accentFontColor,
  },
  a: {},
})