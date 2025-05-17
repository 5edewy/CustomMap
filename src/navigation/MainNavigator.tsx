import React, {memo} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, isIOS, normalizeFontSize} from '../config/theme';
import screenNames from './screenNames';
import HomeScreen from '../screens/HomeScreen';

type RootStackParamList = {};

const {HOME} = screenNames;
export const Stack = createNativeStackNavigator<RootStackParamList>();

export const MainNavigator = memo(() => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: '',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: normalizeFontSize(17),
          },
          headerBackButtonDisplayMode: 'minimal',
          animation: 'slide_from_left',
          statusBarTranslucent: false,
          statusBarBackgroundColor: colors.white,
          ...(!isIOS && {statusBarStyle: 'dark'}),
        }}
        // initialRouteName={'webScreen'}
        initialRouteName={HOME as keyof undefined}>
        <Stack.Screen
          name={HOME as keyof undefined}
          component={HomeScreen}
          options={{
            title: 'Map View',
          }}
        />
      </Stack.Navigator>
    </>
  );
});
