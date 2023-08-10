import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Detail, Home, Login, Profile} from '../screens';

export default function MainNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
