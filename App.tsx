/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  Platform,
  EmitterSubscription,
  Alert,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  Linking,
} from 'react-native';
import ThemeProvider from './Utilities/ThemeProvider';
import EnterData from './PayingModule/Screens/Enter/EnterDataScreen';
import DrawerContent from './Utilities/DrawerContent';
import {StateProvider} from './Utilities/StateProvider';
import ViewRecords from './PayingModule/Screens/ViewRecords/ViewRecords';
import DisplayReport from './PayingModule/Screens/DisplayReport/DisplayReport';
import SplashScreen from 'react-native-splash-screen';
//import * as IAP from 'react-native-iap';
import styles from './PayingModule/Screens/Subscription//Subscription.style';
import AwesomeAlert from 'react-native-awesome-alerts';

import {
  DrawerNavigationProp,
  DrawerContentComponentProps,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Database from './PayingModule/Database/Database';
import {SANDTEST_URL} from '@env';

const items = Platform.select({
  //ios: [],
  android: ['com.wagefigurer.21042021'],
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
              source={require('./PayingModule/Components/Images/WFLogo.png')}
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
  // Other routes...
};
const RootDrawer = createDrawerNavigator<DrawerParamList>();
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return <DrawerContent {...props} />;
};

export default function App() {
  useEffect(() => {
    console.log('api key==', SANDTEST_URL);
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  type Product = {
    productId: string;
    title: string;
    localizedPrice: string;
    // include other properties as necessary
  };
  const [purchased, setPurchased] = useState(true); //make it false after done
  const [products, setProducts] = useState<Product[]>([]);
  const [checking, setChecking] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  type Receipt = {
    productId: string;
    purchaseToken: string;
  };

  const validate = async (receipt: string) => {
    const parsedReceipt: Receipt = JSON.parse(receipt);

    const receiptBody = {
      productId: parsedReceipt.productId,
      purchaseToken: parsedReceipt.purchaseToken,
    };

    console.log('receipt body=======', receiptBody);

    try {
      await fetch(
        'https://australia-southeast1-pc-api-7263938244868821830-612.cloudfunctions.net/receipt',
        {
          headers: {'Content-Type': 'application/json'},
          method: 'POST',
          body: JSON.stringify({data: receiptBody}),
        },
      ).then(res => {
        res.json().then(r => {
          if (r.result.error === -1) {
            setChecking(false);
            Alert.alert('Oops!', 'There is something wrong with your purchase');
          } else if (r.result.isActiveSubscription) {
            setPurchased(true);
          } else {
            setShowAlert(true);
          }
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log('error connecting to store...', error.message);
      } else {
        // handle other potential types of errors if necessary
        console.log('error connecting to store...', error);
      }
    }
  };

  useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription | null = null;
    let purchaseErrorSubscription: EmitterSubscription | null = null;

    const init = async () => {
      try {
        await IAP.initConnection();

        if (items) {
          const subscriptions = await IAP.getSubscriptions({skus: items});
          let productsArray: Product[] = subscriptions.map(sub => ({
            productId: sub.productId,
            title: sub.title,
            localizedPrice: '1.99$',
          }));
          setProducts(productsArray);
          if (!subscriptions || subscriptions.length === 0) {
            Alert.alert('Please check your internet access.');
          }

          const history = await IAP.getPurchaseHistory();

          try {
            const receipt = history[history.length - 1].transactionReceipt;
            if (receipt) {
              validate(receipt);
            }
          } catch (error) {
            console.log('Error getting the receipt:', error);
          }
        } else {
          console.log('items is undefined');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('error connecting to store...', error.message);
        } else {
          // handle other potential types of errors if necessary
          console.log('error connecting to store...', error);
        }
      }
    };

    init();

    try {
      type PurchaseError = Error & {responseCode?: number | string};

      purchaseErrorSubscription = IAP.purchaseErrorListener(
        (error: PurchaseError) => {
          if (!(error.responseCode?.toString() === '2')) {
            Alert.alert('Oops!', 'There is something wrong with your purchase');
          }
        },
      );

      setTimeout(() => {
        purchaseUpdateSubscription = IAP.purchaseUpdatedListener(purchase => {
          const receipt = purchase.transactionReceipt;
          try {
            if (receipt) {
              validate(receipt);
              IAP.finishTransaction({purchase: purchase});
            }
          } catch (e) {
            console.log(e);
          }
        });
      }, 3000);
    } catch (error) {
      console.log(error);
    }

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      try {
        IAP.endConnection();
      } catch (error) {
        console.log('Error ending connection:', error);
      }
    };
  }, [products]);

  //end useeffect

  return (
    <ThemeProvider>
      <StateProvider>
        {products.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.Title}>Fetching products please wait...</Text>
          </View>
        ) : checking ? (
          <View style={styles.container}>
            <StatusBar backgroundColor="#35363A" />
            <Text style={styles.Title}>Checking for previous purchase...</Text>
          </View>
        ) : purchased ? (
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
                {products[0].localizedPrice} /{'Month'}
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
                    IAP.requestSubscription(p.productId)
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
                    Linking.openURL(
                      'https://www.privacypolicies.com/live/aedcda52-a940-4709-a1cd-c06d70e58b46',
                    );
                  }}>
                  <Text style={styles.Title}> Privacy Policy</Text>
                </TouchableOpacity>

                <Text style={styles.Title}> | </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://www.privacypolicies.com/live/8467e6de-e7f6-4a70-8b79-c50bcddaadfc',
                    );
                  }}>
                  <Text style={styles.Title}> Terms & Conditions</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                    'https://www.messenger.com/t/106587868210718',
                  );
                }}>
                <Text style={styles.Title}> Contact</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        )}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Expired !"
          message="Your subscription has expired. Please subscribe. ?"
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
