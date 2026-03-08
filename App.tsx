import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { TaskProvider } from './src/context/TaskProvider';
import RootNavigation from './src/navigation';

export default function App() {
  return (
    <TaskProvider>
      <RootNavigation />
      <StatusBar style="auto" />
    </TaskProvider>
  );
}