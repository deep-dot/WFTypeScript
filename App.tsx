/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import ThemeProvider from './ThemeProvider';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import {DrawerContent} from './Utilities/DrawerContent';
import HomeScreen from './PayingModule/Screens/Home/HomeScreen';
import Database from './PayingModule/Database';
import {StateProvider} from './PayingModule/Screens/Enter/StateProvider';
import {useNavigation} from '@react-navigation/native';
import ViewRecords from './PayingModule/Screens/ViewRecords/ViewRecords';

import {
  DrawerNavigationProp,
  DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';

type DrawerParamList = {
  'Home Screen': undefined;
  'Enter Data': undefined;
  'View Records': undefined;
  'Update Record': undefined;
  'Delete Record': undefined;
  'Display Report': undefined;
  // Other routes...
};
const RootDrawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  return <DrawerContent {...props} />;
};

type EnterDataWrapperProps = DrawerScreenProps<DrawerParamList, 'Enter Data'>;

function EnterDataWrapper({navigation}: EnterDataWrapperProps) {
  return (
    <StateProvider>
      <EnterData navigation={navigation} />
    </StateProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Database />
      <RootDrawer.Navigator
        initialRouteName="Enter Data"
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={CustomDrawerContent}>
        <RootDrawer.Screen name="Home Screen" component={HomeScreen} />
        <RootDrawer.Screen name="Enter Data" component={EnterDataWrapper} />
        <RootDrawer.Screen name="View Records" component={ViewRecords} />
      </RootDrawer.Navigator>
    </ThemeProvider>
  );
}
