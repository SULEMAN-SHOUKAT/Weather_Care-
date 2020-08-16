/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,

} from 'react-native';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import First_screen from './screens/user_registration/First_screen.js';
import Login_screen from './screens/user_registration/Login_screen.js';
import Signup_screen from './screens/user_registration/Signup_screen.js';
import Password_reset_screen from './screens/user_registration/Password_reset_screen.js';
import Home_screen from './screens/Home_screen.js';
import Loading_screen from './screens/Loading_screen.js';


const Stack_navigator = createStackNavigator({
  First_screen:First_screen,
  Signup_screen:Signup_screen,
  Login_screen:Login_screen,
  Password_reset_screen:Password_reset_screen
  
},
{
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
});

const Switch_navigator=createSwitchNavigator({
  Loading_screen:Loading_screen,
  Stack_navigator:Stack_navigator,
  Home_screen:Home_screen,

  
});

export default createAppContainer(Switch_navigator);



