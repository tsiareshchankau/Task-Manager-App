// src/navigation/AppNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddTask from '../screens/AddTask';
import Home from '../screens/Home';
import TaskDetails from '../screens/TaskDetails';

export type RootStackParamList = {
  Home: undefined;
  AddTask: undefined;
  TaskDetails: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'Tasks' }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTask}
        options={{ title: 'Add Task' }}
      />
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{ title: 'Task Details' }}
      />
    </Stack.Navigator>
  );
}