import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Button, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import RouteName from "../constants/route-name";
import AppStyle from '../constants/app-style';

import Header from '../components/my-header';
import Separator from '../components/separator';
import DateGridView from '../components/date-grid-view';
import HorizontalDrag from '../components/horizontal-drag';

import CostsModel from "../model/costs-model";
import Singleton from '../respository/singleton';
type Props = {

};
type State = {
  middleDate: Moment,
  dateGridViews: Array,
  monthly: Number,
  fabActive: Boolean
};

export default class MainPage extends Component<Props, State> {
  state = {
    middleDate: moment(),
    monthlyCosts: [undefined, undefined, undefined],
    dateGridViews: [undefined, undefined, undefined],
    fabActive: true
  }

  horizontalDrag = React.createRef()

  render() {
    const { monthlyCosts } = this.state;
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          body={<Text style={styles.headerText}>記帳咯</Text>}
          right={<TouchableOpacity
            onPress={this.toSettingPage}>
            <Icon style={styles.headerLeft} name={"settings"} />
          </TouchableOpacity>}
        />
        <Content contentContainerStyle={styles.container}>
          <HorizontalDrag
            horizontal={true}
            ref={this.horizontalDrag}
            data={this.state.dateGridViews}
            onSwipe={this.onSwipe}
            onSwipeEnd={this.onSwipeEnd} />
          <View style={styles.row}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={this.previousMonth}>
              <Icon style={styles.arrow} name={"arrow-dropleft"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 3 }}
              onPress={this.thisMonth}>
              <Text style={styles.monthTitle}>{this.state.middleDate.format("YYYY-MM")}</Text>
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
            <Text style={styles.monthlyCost}>{monthlyCosts[1]}</Text>
          </View>
          <Separator />
        </Content>
        <Fab
          active={this.state.fabActive}
          active={true}
          position={"bottomRight"}>
          <TouchableOpacity
            style={styles.fabAdd}
            onLongPress={this.fabActive}
            onPress={this.toInsertPage}>
            <Icon style={styles.fabAddContent} name={"add"} />
          </TouchableOpacity>
          <Button
            style={{ backgroundColor: '#34A34F' }}
            onPress={this.toQueryPage}>
            <Icon name="search" />
          </Button>
        </Fab>
      </Container>
    )
  }

  thisMonth = () => {
    const now = moment();
    CostsModel.getDateArrayAsync(now)
      .then(({ daysArray, monthly }) => {
        const { dateGridViews, monthlyCosts } = this.state;
        const dateGridView = this.generateDateGridView(daysArray);
        dateGridViews[1] = dateGridView;
        monthlyCosts[1] = monthly;
        this.setState({ dateGridViews, monthlyCosts, middleDate: now });
      });
  }

  previousMonth = () => {
    this.horizontalDrag.current.previous();
  }

  nextMonth = () => {
    this.horizontalDrag.current.next();
  }

  generateDateGridView = (daysArray) => {
    return (
      <DateGridView
        dayArray={daysArray}
        onCellPress={this.onCellPress} />
    )
  }

  onSwipe = async (offset) => {
    console.log(offset)
    const date = this.state.middleDate.clone().add(offset, "month");
    await CostsModel.getDateArrayAsync(date)
      .then(({ daysArray, monthly }) => {
        const { dateGridViews, monthlyCosts } = this.state;
        monthlyCosts[1 + offset] = monthly;
        dateGridViews[1 + offset] = this.generateDateGridView(daysArray);
        console.log(1 + offset, offset, dateGridViews, monthlyCosts);
        this.setState({ dateGridViews, monthlyCosts });
      });
  }

  onSwipeEnd = async (offset) => {
    const { dateGridViews, monthlyCosts, middleDate } = this.state;
    console.log(1 + offset, offset, dateGridViews, monthlyCosts);
    dateGridViews[1] = dateGridViews[1 + offset];
    dateGridViews[0] = undefined;
    dateGridViews[2] = undefined;
    monthlyCosts[1] = monthlyCosts[1 + offset];
    console.log(1 + offset, offset, dateGridViews, monthlyCosts);
    await new Promise((resolve) => {
      this.setState({
        dateGridViews,
        monthlyCosts,
        middleDate: middleDate.clone().add(offset, 'month')
      }, resolve);
    })

  }

  onCellPress = (item) => {
    this.props.navigation.navigate(RouteName.CostsPage, { dateStamp: item.dateStamp })
  }

  fabActive = () => {
    this.setState({ fabActive: !this.state.fabActive });
  }

  fabDeactive = () => {
    this.setState({ fabActive: false });
  }

  toInsertPage = () => {
    this.fabDeactive();
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage);
  }

  toQueryPage = () => {
    this.fabDeactive();
    this.props.navigation.navigate(RouteName.QueryPage);
  }

  toSettingPage = () => {
    this.props.navigation.navigate(RouteName.SettingPage);
  }

  onWillFocus = () => {
    let isSetUserId = Singleton.isSetUserId();
    if (isSetUserId) {
      this.onSwipe(0);
    } else this.props.navigation.navigate(RouteName.ROUTE_SPLASH);
  }
}
const styles = StyleSheet.create({
  a: {},
  headerText: {
    fontSize: AppStyle.headerFontSize,
    // textAlign: "center",
    color: AppStyle.accentFontColor,
    // alignItems: 'center',
  },
  headerLeft: {
    padding: 10,
    fontSize: AppStyle.headerFontSize,
    color: AppStyle.accentFontColor,
    left: 0,
  },
  container: {
    paddingBottom: 100,
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
    color: AppStyle.accentColor,
  },
  monthTitle: {
    flex: 3,
    textAlign: "center",
    fontSize: AppStyle.headerFontSize + 6
  },
  monthlySection: {
    padding: 5,
    paddingHorizontal: 10,
    alignItems: "flex-start"
  },
  monthlyTitle: {
    fontSize: AppStyle.subFontSize,
    color: AppStyle.mainColor
  },
  monthlyCost: {
    fontSize: AppStyle.headerFontSize
  },
  fabAdd: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center"
  },
  fabAddContent: {
    color: "#ffffff"
  }
})