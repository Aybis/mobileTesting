import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import MainTabNavigation from './src/navigations/MainTabNavigation';
import { Detail, Login, Profile } from './src/screens';

export default function App() {
  const [test, settest] = useState(false);
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="MainTabNavigation"
          component={MainTabNavigation}
        />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
