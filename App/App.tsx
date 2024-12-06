/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  Linking,
} from 'react-native';
import ThemeProvider from '../PayingModule/Utilities/ThemeProvider';
import EnterData from '../PayingModule/Screens/Enter/EnterDataScreen';
import DrawerContent from '../PayingModule/Utilities/DrawerContent';
import {StateProvider} from '../PayingModule/Utilities/StateProvider';
import ViewRecords from '../PayingModule/Screens/ViewRecords/ViewRecords';
import DisplayReport from '../PayingModule/Screens/DisplayReport/DisplayReport';
import SplashScreen from 'react-native-splash-screen';
import * as IAP from 'react-native-iap';
//import * as RNIap from 'react-native-iap';
import styles from './App.style';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  DrawerNavigationProp,
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Database from '../PayingModule/Database/Database';
import {
  IN_APP_PURCHASE_KEY,
  RECIEPT_VALIDATE_URL,
  ANDROID_PRODUCT_ID,
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
} from '@env';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
//   android:
//     'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu',
// });
const items = Platform.select({
  ios: [IN_APP_PURCHASE_KEY],
  android: [ANDROID_PRODUCT_ID],
});
export type StackParamList = {
  'Enter Data': undefined;
  'View Records': undefined;
  'Display Report': undefined;
};
const RootStack = createStackNavigator<StackParamList>();
const HomeScreenStack = () => {
  const navigation = useNavigation<DrawerNavigationProp<StackParamList>>();
  return (
    <>
      {Platform.OS === 'android' && <StatusBar hidden />}
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
              source={require('../PayingModule/Screens/Components/Images/WFLogo.png')}
            />
          ),
        }}>
        <RootStack.Screen name="Enter Data" component={EnterData} />
        <RootStack.Screen name="View Records" component={ViewRecords} />
        <RootStack.Screen name="Display Report" component={DisplayReport} />
      </RootStack.Navigator>
    </>
  );
};

type DrawerParamList = {
  HomeScreenStack: StackParamList;
  EnterData: undefined;
  ViewRecords: undefined;
};
const RootDrawer = createDrawerNavigator<DrawerParamList>();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return <DrawerContent {...props} />;
};

export default function App() {

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  type Product = {
    productId: string;
    title: string;
    localizedPrice: string;
  };
  const [purchased, setPurchased] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [checking, setChecking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // type Receipt = {
  //   productId: string;
  //   purchaseToken: string;
  // };

  // const validate = async (receipt: string) => {
  //   const parsedReceipt: Receipt = JSON.parse(receipt);

  //   const receiptBody = {
  //     productId: parsedReceipt.productId,
  //     purchaseToken: parsedReceipt.purchaseToken,
  //   };

  //   console.log(
  //     'receipt body=======',
  //     receiptBody,
  //     //IOS_SANDTEST_URL,
  //     RECIEPT_VALIDATE_URL,
  //   );

  //   try {
  //     const response = await fetch(RECIEPT_VALIDATE_URL, {
  //       //const response = await fetch(IOS_SANDTEST_URL, {
  //       headers: {'Content-Type': 'application/json'},
  //       method: 'POST',
  //       body: JSON.stringify({data: receiptBody}),
  //     });

  //     console.log('result in app', response);
  //     const result = await response.json();
  //     if (result.ok) {
  //       throw new Error(`Server responded with status ${response.status}`);
  //     }
  //     if (result.error === -1) {
  //       setChecking(true);
  //       //Alert.alert('Oops!', 'There is something wrong with your purchase');
  //     } else if (result.isActiveSubscription) {
  //       setPurchased(true);
  //     } else {
  //       setShowAlert(true);
  //     }
  //   } catch (error) {
  //     // console.error('Error during receipt validation:', error);
  //     Alert.alert(
  //       'Error',
  //       'Could not connect to the store. Please try again later.',
  //     );
  //   }
  // };
  // useEffect(() => {
  //   let isMounted = true; // Flag to handle async operation in case the component is unmounted

  //   const initializeIAP = async () => {
  //     try {
  //       await IAP.initConnection();
  //       if (isMounted) {
  //         //console.log('Connection to the IAP store was successful');
  //         const subscriptions = await IAP.getSubscriptions({skus: items || []});
  //         if (!subscriptions || subscriptions.length === 0) {
  //           return Alert.alert('Please check your internet access.');
  //         } else {
  //           const productsArray = subscriptions.map(sub => ({
  //             productId: sub.productId,
  //             title: sub.title,
  //             localizedPrice: '$0.99', // Assuming 'localizedPrice' exists
  //             //localizedPrice: sub.localizedPrice, // Assuming 'localizedPrice' exists
  //           }));
  //           setProducts(productsArray);
  //           //  console.log('Products received:', products[0], products.length);
  //         }

  //         const history = await IAP.getPurchaseHistory();
  //         try {
  //           const receipt = history[history.length - 1].transactionReceipt;
  //           if (receipt) {
  //             validate(receipt);
  //           }
  //         } catch (error) {
  //           console.log('Error getting the receipt:', error);
  //         }
  //       }
  //     } catch (error) {
  //       if (isMounted) {
  //         console.log(
  //           'Error initializing IAP connection or fetching products:',
  //         );
  //       }
  //     }
  //   };

  //   initializeIAP();

  //   return () => {
  //     isMounted = false;
  //     IAP.endConnection?.(); // Clean up the IAP connection when the component unmounts
  //   };
  // }, []);

  return (
    <ThemeProvider>
      <StateProvider>
        {checking ? (
          <View style={styles.container}>
            <Text style={styles.Title}>Checking for previous purchase...</Text>
          </View>
        ) : products.length !== 0 ? (
          <View style={styles.container}>
            <StatusBar backgroundColor="#35363A" />
            <Text style={styles.Title}>Fetching products please wait...</Text>
          </View>
        ) : !purchased ? (
          <>
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
          </>
        ) : (
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#35363A" />
            <ScrollView>
              <Text style={styles.title}>Welcome to WageFigurer !</Text>
              <Text style={styles.Title}>
                This app requires a subscription to use.
              </Text>

              <Text style={styles.Title}>
                {products[0].localizedPrice} / {'Month'}
              </Text>
              <View
                style={{
                  height: 4,
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  width: '30%',
                  marginBottom: 30,
                }}
              />
              <Text style={styles.title}>Features:</Text>
              <Text style={styles.Title}>
                {'\u2B24'} Ad-free access to the entire App.
              </Text>

              {products.map(p => (
                <Button
                  key={p.productId}
                  title={`Purchase ${p.title}`}
                  onPress={() => {
                    IAP.requestSubscription(p.productId as any)
                      .catch(error => {
                        console.log(error.message);
                      })
                      .then(() => {});
                  }}
                />
              ))}
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 70,
                  marginBottom: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(PRIVACY_POLICY);
                  }}>
                  <Text style={styles.Title}> Privacy Policy</Text>
                </TouchableOpacity>

                <Text style={styles.Title}> | </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(TERMS_AND_CONDITIONS);
                  }}>
                  <Text style={styles.Title}> Terms & Conditions</Text>
                </TouchableOpacity>
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  Linking.openURL(MESSENGER_URL);
                }}>
                <Text style={styles.Title}> Contact</Text>
              </TouchableOpacity> */}
            </ScrollView>
          </SafeAreaView>
        )}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Expired !"
          message="Your subscription is expired. Please subscribe."
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          //showCancelButton={true}
          showConfirmButton={true}
          // cancelText="No, Thanks"
          confirmText="OK"
          confirmButtonColor="#54cb77"
          //onCancelPressed={HideAlert1}
          onConfirmPressed={() => setShowAlert(false)}
        />
      </StateProvider>
    </ThemeProvider>
  );
}
