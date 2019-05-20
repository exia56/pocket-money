import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header, Container, Button, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import RouteName from "../constants/route-name";
import DateGridView from '../components/date-grid-view';
import CostsModel from "../model/costs-model";
import Singleton from '../respository/singleton';
import Separator from '../components/separator';
import Appstyle from '../constants/app-style';

type Props = {

};
type State = {
  date: Moment,
  dayArray: Array,
  monthly: Number
};
export default class MainPage extends Component<Props, State> {
  state = {
    date: moment(),
    dayArray: Array.apply(null, { length: 42 }).map((v, idx) => CostsModel.createCellData(idx, 0, 0)),
    monthly: 0
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
          <View style={styles.headerLeft} />
          <Text style={styles.headerText}>記帳咯</Text>
          <TouchableOpacity
            style={{ alignItems: "center", alignSelf: "center" }}
            onPress={this.toSettingPage}>
            <Icon style={styles.headerLeft} name={"settings"} />
          </TouchableOpacity>
        </Header>
        <Content contentContainerStyle={styles.container}>
          <DateGridView
            dayArray={this.state.dayArray}
            onCellPress={this.onCellPress} />
          <View style={styles.row}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={this.previousMonth}>
              <Icon style={styles.arrow} name={"arrow-dropleft"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 3 }}
              onPress={this.thisMonth}>
              <Text style={styles.monthTitle}>{this.state.date.format("YYYY-MM")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={this.nextMonth}>
              <Icon style={styles.arrow} name={"arrow-dropright"} />
            </TouchableOpacity>
          </View>
          <Separator />
          <View style={styles.monthlySection}>
            <Text style={styles.monthlyTitle}>月花費:</Text>
            <Text style={styles.monthlyCost}>{this.state.monthly}</Text>
          </View>
          <Separator />
        </Content>
        <Fab
          style={styles.fabAdd}
          position={"bottomRight"}
          onPress={this.toInsertPage}>
          <Icon style={styles.fabAddContent} name={"add"} />
        </Fab>
      </Container>
    )
  }
  thisMonth = () => {
    this.generateDayArray(moment());
  }

  previousMonth = () => {
    this.generateDayArray(this.state.date.clone().add(-1, "month"));
  }

  nextMonth = () => {
    this.generateDayArray(this.state.date.clone().add(1, "month"))
  }

  generateDayArray = (date) => {
    CostsModel.getDateArrayAsync(date)
      .then(({ daysArray, monthly }) => {
        this.setState({ dayArray: daysArray, date, monthly });
      }).catch(res => { console.log(res) });
  }
  onCellPress = (item) => {
    this.props.navigation.navigate(RouteName.CostsPage, { dateStamp: item.dateStamp })
  }

  toInsertPage = () => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage);
  }

  toSettingPage = () => {
    this.props.navigation.navigate(RouteName.SettingPage);
  }

  onWillFocus = () => {
    let isSetUserId = Singleton.isSetUserId();
    if (isSetUserId) {
      this.generateDayArray(this.state.date);
    } else this.props.navigation.navigate(RouteName.ROUTE_SPLASH);

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
  headerLeft: {
    padding: 10,
    fontSize: Appstyle.headerFontSize,
    color: Appstyle.accentFontColor,
    alignItems: 'center',
    alignSelf: 'center',
  },
  container: {
    paddingBottom: 100
  },
  row: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    paddingHorizontal: 10
  },
  arrow: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 40,
    color: Appstyle.accentColor,
  },
  monthTitle: {
    flex: 3,
    textAlign: "center",
    fontSize: Appstyle.headerFontSize + 6
  },
  monthlySection: {
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "flex-start"
  },
  monthlyTitle: {
    fontSize: Appstyle.subFontSize,
    color: Appstyle.mainColor
  },
  monthlyCost: {
    fontSize: Appstyle.headerFontSize
  },
  fabAdd: {
    backgroundColor: Appstyle.accentColor,
    justifyContent: "center",
    alignItems: "center"
  },
  fabAddContent: {
  }
})