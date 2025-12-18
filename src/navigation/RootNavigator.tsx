import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MenuScreen from '../screens/MenuScreen';

import ClassicQuizScreen from '../screens/ClassicQuizScreen';
import TrueFalseScreen from '../screens/TrueFalseScreen';
import LibraryScreen from '../screens/LibraryScreen';
import NovelDetailScreen from '../screens/NovelDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loader" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />

        <Stack.Screen name="ClassicQuiz" component={ClassicQuizScreen} />
        <Stack.Screen name="TrueFalse" component={TrueFalseScreen} />

        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="NovelDetail" component={NovelDetailScreen} />

        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
