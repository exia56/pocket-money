import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import RouteName from './constants/route-name';

import MainPage from './page/main-page';
import InsertOrUpdatePage from './page/insert-or-update-page';
import CostsPage from './page/costs-page';
import KeyPairPage from './page/key-pair-page';
import SplashPage from './page/splash-page';
import SettingPage from './page/setting-page';
import QueryPage from './page/query-page';

const NormalRoute = {},
  SwitchRoute = {};
NormalRoute[RouteName.MainPage] = {
  screen: MainPage
}
NormalRoute[RouteName.InsertOrUpdatePage] = {
  screen: InsertOrUpdatePage
}
NormalRoute[RouteName.CostsPage] = {
  screen: CostsPage
}
NormalRoute[RouteName.SettingPage] = {
  screen: SettingPage
}
NormalRoute[RouteName.QueryPage] = {
  screen: QueryPage
}


const NormalStack = createStackNavigator(NormalRoute, {
  initialRouteName: RouteName.MainPage,
  headerMode: "none"
});

SwitchRoute[RouteName.ROUTE_KEY] = KeyPairPage;
SwitchRoute[RouteName.ROUTE_MAIN] = NormalStack;
SwitchRoute[RouteName.ROUTE_SPLASH] = SplashPage;

const PageSwitch = createSwitchNavigator(SwitchRoute, {
  initialRouteName: RouteName.ROUTE_SPLASH
})

export default createAppContainer(PageSwitch); 