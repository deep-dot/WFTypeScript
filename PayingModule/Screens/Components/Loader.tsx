/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, Modal, Platform, StatusBar} from 'react-native';
import {
  BallIndicator,
  //BarIndicator,
  /* DotIndicator,
   MaterialIndicator,
   PacmanIndicator,
   PulseIndicator,
   SkypeIndicator,
   UIActivityIndicator,
   WaveIndicator,*/
} from 'react-native-indicators';

const platformStatusBarStyle = Platform.select({
  ios: () => StatusBar.setBarStyle('light-content'),
  android: () => StatusBar.setBackgroundColor('#01579B'),
});

// If the function exists for the platform, invoke it
if (platformStatusBarStyle) {
  platformStatusBarStyle();
}

interface LoaderProps {
  loading: boolean;
  Transparency?: any;
}

const Loader = ({loading}: LoaderProps) => {
  return (
    <Modal
      // transparent={true}
      // presentationStyle={'pageSheet'}
      visible={loading}
      animationType={'fade'}
      onRequestClose={() => {}}>
      <View style={styles.container}>
        <BallIndicator color="#000000" />
        <View style={{flex: 1}}>
          <Text style={{color: '#000000', fontWeight: 'bold', fontSize: 18}}>
            Please wait.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 0.5,
    alignItems: 'center',
    backgroundColor: '#b88a74',
  },
});
