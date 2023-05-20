/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import ThemeProvider from './ThemeProvider';
import {createDrawerNavigator} from '@react-navigation/drawer';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import {DrawerContent} from './Utilities/DrawerContent';
import HomeScreen from './PayingModule/Screens/Home/HomeScreen';
import Database from './PayingModule/Database';
const Drawer = createDrawerNavigator();
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {StateProvider} from './PayingModule/Screens/Enter/StateProvider';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
type DrawerParamList = {
  'Enter Data': undefined;
  // ... other routes
};

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  return <DrawerContent {...props} />;
};

function EnterDataWrapper() {
  const navigation =
    useNavigation<DrawerNavigationProp<DrawerParamList, 'Enter Data'>>();
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
      <Drawer.Navigator
        initialRouteName="Enter Data"
        screenOptions={{
          headerShown: true,
        }}
        drawerContent={CustomDrawerContent}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Enter Data" component={EnterDataWrapper} />
      </Drawer.Navigator>
    </ThemeProvider>
  );
}
