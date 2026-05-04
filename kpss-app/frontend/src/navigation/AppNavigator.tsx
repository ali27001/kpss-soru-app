import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StatsScreen from '../screens/StatsScreen';
import { getToken } from '../storage/auth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ana Ekran" component={HomeScreen} />
      <Tab.Screen name="Takvim" component={CalendarScreen} />
      <Tab.Screen name="İstatistik" component={StatsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  console.log('AppNavigator component rendered');
  const [initialRoute, setInitialRoute] = useState<string>('Login'); // Default olarak Login

  // Uygulama açılırken token kontrolü — varsa direkt App'e yönlendir
  useEffect(() => {
    console.log('AppNavigator useEffect triggered');
    getToken().then((token) => {
      console.log('AppNavigator: Token exists:', !!token);
      setInitialRoute(token ? 'App' : 'Login');
    });
  }, []);

  console.log('AppNavigator: initialRoute:', initialRoute);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="App" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
