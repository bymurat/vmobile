import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer } from 'react-navigation';

import AuthLoadingScreen from './screens/AuthLoadingScreen';
import HomeScreen from './screens/HomeScreen';

import SignInScreen from './screens/SignInScreen';
import ConsultantScreen from './screens/ConsultantScreen';
import ActivityScreen from './screens/ActivityScreen';
import PlanningScreen from './screens/PlanningScreen';

const AppStack = createStackNavigator({
    Home: HomeScreen ,
    Activity: ActivityScreen,
    Consultant : ConsultantScreen,
    Planning : PlanningScreen});
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
