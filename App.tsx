/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Image} from 'react-native';
import ThemeProvider from './Utilities/ThemeProvider';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import DrawerContent from './Utilities/DrawerContent';
//import HomeScreen from './PayingModule/Screens/Home/HomeScreen';
import {StateProvider} from './Utilities/StateProvider';
import ViewRecords from './PayingModule/Screens/ViewRecords/ViewRecords';
import DisplayReport from './PayingModule/Screens/DisplayReport/DisplayReport';

import {
  DrawerNavigationProp,
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Database from './PayingModule/Database/Database';

export type StackParamList = {
  'Enter Data': undefined;
  'View Records': undefined;
  'Display Report': undefined;
};
const RootStack = createStackNavigator<StackParamList>();
const HomeScreenStack = () => {
  const navigation = useNavigation<DrawerNavigationProp<StackParamList>>();
  return (
    <RootStack.Navigator
      initialRouteName="Enter Data"
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <Ionicons
            name="menu-outline"
            size={30}
            color="#fff"
            backgroundColor="transparent"
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerRight: () => (
          <Image
            style={{
              width: 40,
              height: 40,
              margin: 10,
              borderRadius: 50,
            }}
            source={require('./PayingModule/Components/Images/WFLogo.png')}
          />
        ),
      }}>
      {/* <RootStack.Screen name="Home" component={HomeScreen} /> */}
      <RootStack.Screen name="Enter Data" component={EnterData} />
      <RootStack.Screen name="View Records" component={ViewRecords} />
      <RootStack.Screen name="Display Report" component={DisplayReport} />
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

export default function App() {
  return (
    <ThemeProvider>
      <StateProvider>
        <Database />
        <RootDrawer.Navigator
          initialRouteName="HomeScreenStack"
          screenOptions={{
            headerShown: false,
          }}
          drawerContent={CustomDrawerContent}>
          <RootDrawer.Screen
            name="HomeScreenStack"
            component={HomeScreenStack}
          />
          {/* <RootDrawer.Screen name="Driver App" component={} />
          <RootDrawer.Screen name="View Records" component={ViewRecords} /> */}
        </RootDrawer.Navigator>
      </StateProvider>
    </ThemeProvider>
  );
}
