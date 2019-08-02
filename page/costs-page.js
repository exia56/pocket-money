import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Container, Body, Content, Icon, Fab } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import moment, { isMoment } from 'moment';

import CostType from '../constants/cost-type';
import AppStyle from '../constants/app-style';
import RouteName from "../constants/route-name";
import Header from '../components/my-header';
import CostRow from '../components/cost-row';
import HorizontalDrag from '../components/horizontal-drag';
import CostsModel from '../model/costs-model';
import CostTypesModel from '../model/cost-types-model';
import Separator from '../components/separator';

type Props = {

};
type State = {
  dateStamp: String,
  costsList: Array,
  costsTitle: Array,
  costTypes: Object,
  reverseTypes: Object,
};
export default class CostsPage extends Component<Props, State> {
  state = {
    dateStamp: undefined,
    costsTitle: [undefined, '讀取中', undefined],
    costsList: [undefined, undefined, undefined],
    costTypes: {},
    reverseTypes: {},
  }
  render() {
    const { costsList, costsTitle } = this.state;
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          left={<TouchableOpacity
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>}
          body={<Text style={styles.headerText}>{this.momentToFormat(costsTitle[1])}</Text>} />
        <View style={{ flex: 1 }}>
          <HorizontalDrag
            flex={true}
            horizontal={true}
            data={costsList}
            onSwipe={this.onSwipe}
            onSwipeEnd={this.onSwipeEnd}
          />
        </View>
        <Fab
          style={styles.fabAdd}
          position={"bottomRight"}
          onPress={this.toInsertPage}>
          <Icon style={styles.fabAddContent} name={"add"} />
        </Fab>
      </Container >
    )
  }

  createContent = (items, { reverseTypes } = {}) => {
    reverseTypes = reverseTypes || this.state.reverseTypes;
    let total = 0;
    const costRows = items.map((v, idx) => {
      v.typeStr = reverseTypes[v.type];
      total += +v.amount;
      return <CostRow key={idx} item={v} onPress={this.onRowPress} />
    });
    costRows.push(<Separator key={'sep'} style={{ margin: 0, borderWidth: 1, borderColor: '#000' }} />)
    costRows.push(<CostRow key={'total'} item={{ typeStr: 'Total:', amount: `${total}` }} />)
    return (
      <Content style={{ alignSelf: 'stretch', borderColor: '#eee', borderWidth: 1 }} contentContainerStyle={styles.container}>
        {costRows}
      </Content>
    );
  }

  onSwipe = async (offset) => {
    const { costsList, costsTitle } = this.state;
    costsTitle[1 + offset] = costsTitle[1].clone().add(offset, 'day');
    await CostsModel.getThisDayCostsAsync(this.momentToDateStamp(costsTitle[1 + offset]))
      .then((costs) => {
        costsList[1 + offset] = this.createContent(costs);
        this.setState({ costsList, costsTitle })
      });
  }

  onSwipeEnd = async (offset) => {
    const { costsList, costsTitle } = this.state;
    costsTitle[1] = costsTitle[1 + offset];
    costsList[1] = costsList[1 + offset];
    costsList[0] = undefined;
    costsList[2] = undefined;
    await new Promise((resolve) => {
      this.setState({
        costsList,
        costsTitle,
        dateStamp: this.momentToDateStamp(costsTitle[1]),
      }, resolve);
    });
  }

  onRowPress = (item) => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, item);
  }

  createMoment = (dateStamp) => {
    return moment(dateStamp, "YYYYMMDD");
  }

  momentToFormat = (moment) => {
    return isMoment(moment) ? moment.format("YYYY-MM-DD") : moment;
  }

  momentToDateStamp = (moment) => {
    return moment.format('YYYYMMDD');
  }

  toInsertPage = () => {
    const { dateStamp } = this.state;
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, { dateStamp });
  }

  onWillFocus = () => {
    const { params } = this.props.navigation.state;
    const { dateStamp: ds } = this.state;
    const dateStamp = ds ? ds : params.dateStamp;
    if (dateStamp) {
      Promise.all([
        CostsModel.getThisDayCostsAsync(dateStamp),
        CostTypesModel.getCostTypeFromLocalAsync()
      ]).then(([costs, costTypes]) => {
        const reverseTypes = CostType.genReverseMap(costTypes)
        this.setState({
          dateStamp,
          costsTitle: [undefined, this.createMoment(dateStamp), undefined],
          costsList: [undefined, this.createContent(costs, { reverseTypes }), undefined],
          costTypes,
          reverseTypes,
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
    padding: 10,
    alignSelf: 'stretch',
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