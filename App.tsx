/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import ThemeProvider from './ThemeProvider';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import DrawerContent from './Utilities/DrawerContent';
import HomeScreen from './PayingModule/Screens/Home/HomeScreen';
import {StateProvider} from './PayingModule/Screens/Enter/StateProvider';
import ViewRecords from './PayingModule/Screens/ViewRecords/ViewRecords';

import {
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

export type StackParamList = {
  Home: undefined;
  'Enter Data': undefined;
  'View Records': undefined;
};
const RootStack = createStackNavigator<StackParamList>();
const HomeScreenStack = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Enter Data"
      screenOptions={{
        headerShown: true,
      }}>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen name="Enter Data" component={EnterDataWrapper} />
      <RootStack.Screen name="View Records" component={ViewRecords} />
    </RootStack.Navigator>
  );
};

type DrawerParamList = {
  HomeScreenStack: StackParamList;
  EnterData: undefined;
  ViewRecords: undefined;
  // Other routes...
};
const RootDrawer = createDrawerNavigator<DrawerParamList>();
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
function ViewRecordsWrapper() {
  return (
    <StateProvider>
      <ViewRecords />
    </StateProvider>
  );
}
export default function App() {
  return (
    <ThemeProvider>
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
        <RootDrawer.Screen name="View Records" component={ViewRecordsWrapper} />
      </RootDrawer.Navigator>
    </ThemeProvider>
  );
}
