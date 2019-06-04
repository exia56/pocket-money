import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Platform } from 'react-native';
import { Container, Content, Icon } from 'native-base';
import { NavigationEvents } from 'react-navigation';

import RouteName from "../constants/route-name";
import CostType from '../constants/cost-type';
import AppStyle from '../constants/app-style';
import CostRow from '../components/cost-row';
import PositiveButton from '../components/positive-button';
import Header from '../components/my-header';
import CostsModel from '../model/costs-model';
import CostTypesModel from '../model/cost-types-model';

type Props = {

};
type State = {
  items: Array,
  costTypes: Object,
  reverseTypes: Object,
  focusAt: Number,
  searchText: String,
  page: Number
};

export default class QueryPage extends Component<Props, State> {
  state = {
    items: [],
    costTypes: {},
    reverseTypes: {},
    focusAt: 0,
    searchText: '',
    page: 0,
  }
  render() {
    const items = this.state.items.map((v, idx) => {
      v.typeStr = this.state.reverseTypes[v.type];
      return <CostRow key={idx} showDate={true} item={v} onPress={this.onRowPress} />
    });
    return (
      <Container>
        <NavigationEvents
          onWillFocus={this.onWillFocus} />
        <Header
          left={<TouchableOpacity
            onPress={this.toLastPage}>
            <Icon style={styles.headerLeft} name={"arrow-back"} />
          </TouchableOpacity>}
          body={<Text style={styles.headerText}>搜尋</Text>} />
        <Content style={{ padding: 10 }} contentContainerStyle={styles.container}>
          <View style={styles.row}>
            <TextInput
              style={StyleSheet.flatten([styles.valueWrapper, this.state.focusAt === 1 ? styles.focus : {}])}
              onBlur={() => this.setState({ focusAt: 0 })}
              onFocus={() => this.setState({ focusAt: 1 })}
              numberOfLines={1}
              value={this.state.searchText}
              onChangeText={(text) => this.setState({ searchText: text })}
              onChange={(e) => {
                if (Platform.OS === "android") {
                  this.setState({ searchText: e.nativeEvent.text })
                }
              }} />
            <PositiveButton
              style={styles.btn}
              caption="搜尋"
              onPress={this.onSearchPress}
            />
          </View>
          {items}
        </Content>
      </Container>
    )
  }

  search = (searchText, page) => {
    return CostsModel.queryDetails(searchText, page);
  }

  onSearchPress = () => {
    this.search(this.state.searchText, 0)
      .then((items) => {
        this.setState({
          items,
          page: 0
        });
      });
  }

  onRowPress = (item) => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, item);
  }

  toInsertPage = () => {
    this.props.navigation.navigate(RouteName.InsertOrUpdatePage, { dateStamp: this.state.dateStamp });
  }

  onWillFocus = () => {
    CostTypesModel.getCostTypeFromLocalAsync()
      .then((costTypes) => {
        const reverseTypes = CostType.genReverseMap(costTypes)
        this.setState({
          costTypes,
          reverseTypes,
        });
      });
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
  valueWrapper: {
    flex: 3,
    padding: 10,
    fontSize: AppStyle.mainFontSize,
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10
  },
  btn: {
    color: AppStyle.accentFontColor,
    fontSize: AppStyle.mainFontSize
  }
})