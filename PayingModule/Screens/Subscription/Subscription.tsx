/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable dot-notation */
import React, {useEffect, useContext} from 'react';
import {
  Text,
  Alert,
  Platform,
  StatusBar,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
  Linking,
  EmitterSubscription,
} from 'react-native';
import styles from './Subscription.style';
import IAP from 'react-native-iap';
import SplashScreen from 'react-native-splash-screen';
import AwesomeAlert from 'react-native-awesome-alerts';
import {validate} from './Actions';
import {StateContext} from '../../../Utilities/Context';

const items = Platform.select({
  //ios: [],
  android: ['com.wagefigurer.21042021'],
});

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription | null = null;
    let purchaseErrorSubscription: EmitterSubscription | null = null;

    const init = async () => {
      try {
        await IAP.initConnection();

        if (items) {
          const subscriptions = await IAP.getSubscriptions({skus: items});
          dispatch({
            type: 'UPDATE',
            payload: {products: subscriptions || state.products},
          });

          if (!subscriptions || subscriptions.length === 0) {
            Alert.alert('Please check your internet access.');
          }

          const history = await IAP.getPurchaseHistory();

          try {
            const receipt = history[history.length - 1].transactionReceipt;
            if (receipt) {
              validate(receipt, dispatch);
            }
          } catch (error) {
            console.log('Error getting the receipt:', error);
          }
        } else {
          console.log('items is undefined');
        }
      } catch (error) {
        console.log('error connecting to store...', error.message);
      }
    };

    init();

    purchaseErrorSubscription = IAP.purchaseErrorListener(error => {
      if (!(error['responseCode']?.toString() === '2')) {
        Alert.alert('Oops!', 'There is something wrong with your purchase');
      }
    });

    setTimeout(() => {
      purchaseUpdateSubscription = IAP.purchaseUpdatedListener(purchase => {
        const receipt = purchase.transactionReceipt;
        try {
          if (receipt) {
            validate(receipt, dispatch);
            IAP.finishTransaction({purchase: purchase});
          }
        } catch (e) {
          console.log(e);
        }
      });
    }, 3000);

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
  }, [dispatch, state.products]);

  //end useeffect

  if (state.checking) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#35363A" />
        <Text style={styles.Title}>Checking for previous purchase...</Text>
      </View>
    );
  } else {
    if (state.purchased) {
      return null;
    }

    try {
      if (state.products) {
        const HideAlert = () => {
          dispatch({type: 'UPDATE', payload: {ShowAlert: false}});
        };
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#35363A" />
            <AwesomeAlert
              show={state.showAlert}
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
              onConfirmPressed={HideAlert}
            />
            <ScrollView>
              <Text style={styles.title}>Welcome to WageFigurer !</Text>
              <Text style={styles.Title}>
                This app requires a subscription to use.
              </Text>

              <Text style={styles.Title}>
                {state.products[0]['localizedPrice']} /{'Month'}
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

              {Object.entries(state.products).map(p => (
                <Button
                  key={p['productId']}
                  title={`Purchase ${p['title']}`}
                  onPress={() => {
                    IAP.requestSubscription(p['productId'])
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
        );
      } else {
        return (
          <View style={styles.container}>
            <Text style={styles.Title}>Fetching products please wait...</Text>
          </View>
        );
      }
    } catch (error) {}
  }
}
