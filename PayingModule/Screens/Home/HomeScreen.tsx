/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useContext} from 'react';
import {Text, SafeAreaView} from 'react-native';
import styles from './HomeScreen.style';
import NavigationButtons from './NavigationButtons';
import ModalForm from './ModalForm';
import {StateContext} from '../../../Utilities/Context';
import {SelectFromDataTable} from './Actions';

const HomeScreen = () => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  useEffect(() => {
    SelectFromDataTable(dispatch);
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ModalForm />

      <NavigationButtons />

      <Text style={styles.footertext}>
        Total Entries:{state.Number_Of_Entries}
      </Text>
      <Text style={styles.footertext}>WageFigurer</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
