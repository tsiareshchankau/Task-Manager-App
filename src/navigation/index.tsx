// src/navigation/index.tsx

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AppNavigator from './AppNavigator';

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}