import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Body, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment from 'moment';

import CostType from '../constants/cost-type';
import AppStyle from '../constants/app-style';
import RouteName from "../constants/route-name";
import Header from '../components/my-header';
import CostRow from '../components/cost-row';
import CostsModel from '../model/costs-model';
import CostTypesModel from '../model/cost-types-model';

type Props = {

};
type State = {
  title: String,
  items: Array,
  dateStamp: Number,
  costTypes: Object,
  reverseTypes: Object,
};
export default class CostsPage extends Component<Props, State> {
  state = {
    title: "讀取中",
    items: [],
    dateStamp: 0,
    costTypes: {},
    reverseTypes: {},
  }
  render() {
    const items = this.state.items.map((v, idx) => {
      v.typeStr = this.state.reverseTypes[v.type];
      return <CostRow key={idx} item={v} onPress={this.onRowPress} />
    })
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          left={<TouchableOpacity
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>}
          body={<Text style={styles.headerText}>{this.state.title}</Text>} />
        <Content style={{ padding: 10 }} contentContainerStyle={styles.container}>
          {items}
        </Content>
        <Fab
          style={styles.fabAdd}
          position={"bottomRight"}
          onPress={this.toInsertPage}>
          <Icon style={styles.fabAddContent} name={"add"} />
        </Fab>
      </Container >
    )
  }

  onRowPress = (item) => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, item);
  }

  dateStampFormat = (dateStamp) => {
    return moment(dateStamp, "YYYYMMDD").format("YYYY-MM-DD");
  }

  toInsertPage = () => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, { dateStamp: this.state.dateStamp });
  }

  onWillFocus = () => {
    const params = this.props.navigation.state.params;
    if (params && params.dateStamp) {
      Promise.all([
        CostsModel.getThisDayCostsAsync(params.dateStamp),
        CostTypesModel.getCostTypeFromLocalAsync()
      ])
        .then(([costs, costTypes]) => {
          const reverseTypes = CostType.genReverseMap(costTypes)
          console.log(costs);
          this.setState({
            items: costs,
            costTypes,
            reverseTypes,
            dateStamp: params.dateStamp,
            title: this.dateStampFormat(params.dateStamp)
          });
        });
    } else {
      this.toLastPage();
    }
  }

  toLastPage = () => {
    this.props.navigation.goBack();
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
    alignSelf: "flex-end",
    fontSize: AppStyle.headerFontSize
  },
  fabAdd: {
    backgroundColor: AppStyle.accentColor,
    justifyContent: "center",
    alignItems: "center"
  },
  fabAddContent: {
  }
})