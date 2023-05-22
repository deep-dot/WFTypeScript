/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import ThemeProvider from './ThemeProvider';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import DrawerContent from './Utilities/DrawerContent';
import HomeScreen from './PayingModule/Screens/Home/HomeScreen';
import Database from './PayingModule/Database';
import {StateProvider} from './PayingModule/Screens/Enter/StateProvider';
import ViewRecords from './PayingModule/Screens/ViewRecords/ViewRecords';

import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

type DrawerParamList = {
  HomeScreenStack: StackParamList;
  EnterData: undefined;
  ViewRecords: undefined;
  // Other routes...
};
const RootDrawer = createDrawerNavigator<DrawerParamList>();

export type StackParamList = {
  'Home Screen': undefined;
  'Enter Data': undefined;
  'View Records': undefined;
};
const RootStack = createStackNavigator<StackParamList>();

const HomeScreenStack = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Home Screen" component={HomeScreen} />
      <RootStack.Screen name="Enter Data" component={EnterDataWrapper} />
      <RootStack.Screen name="View Records" component={ViewRecords} />
    </RootStack.Navigator>
  );
};
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return <DrawerContent {...props} />;
};

function EnterDataWrapper() {
  return (
    <StateProvider>
      <EnterData />
    </StateProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Database />
      <RootDrawer.Navigator
        initialRouteName="Home Screen Stack"
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={CustomDrawerContent}>
        <RootDrawer.Screen
          name="Home Screen Stack"
          component={HomeScreenStack}
        />
        <RootDrawer.Screen name="Enter Data" component={EnterDataWrapper} />
        <RootDrawer.Screen name="View Records" component={ViewRecords} />
      </RootDrawer.Navigator>
    </ThemeProvider>
  );
}
