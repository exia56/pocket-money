import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';

import RouteName from './constants/route-name';

import SignUpPage from './page/sign-up-page';
import SignInPage from './page/sign-in-page';

import MainPage from './page/main-page';
import InsertOrUpdatePage from './page/insert-or-update-page';
import CostsPage from './page/costs-page';
import SplashPage from './page/splash-page';
import SettingPage from './page/setting-page';
import QueryPage from './page/query-page';

const SignInRoute = {},
  NormalRoute = {},
  SwitchRoute = {};

SignInRoute[RouteName.SignInPage] = {
  screen: SignInPage
}
SignInRoute[RouteName.SignUpPage] = {
  screen: SignUpPage
}

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


const SignInStack = createStackNavigator(SignInRoute, {
  initialRouteKey: RouteName.SignInPage,
  headerMode: 'none'
}),
  NormalStack = createStackNavigator(NormalRoute, {
    initialRouteName: RouteName.MainPage,
    headerMode: "none"
  });

SwitchRoute[RouteName.ROUTE_KEY] = SignInStack;
SwitchRoute[RouteName.ROUTE_MAIN] = NormalStack;
SwitchRoute[RouteName.ROUTE_SPLASH] = SplashPage;

const PageSwitch = createSwitchNavigator(SwitchRoute, {
  initialRouteName: RouteName.ROUTE_SPLASH
})

export default createAppContainer(PageSwitch); 