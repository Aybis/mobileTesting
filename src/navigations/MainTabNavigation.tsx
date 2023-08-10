import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import React from 'react';
import {Detail, Home, Profile} from '../screens';

export default function MainTabNavigation() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen name="Detail" component={Detail} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
