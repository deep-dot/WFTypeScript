/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useContext} from 'react';
import {Text, SafeAreaView, Alert} from 'react-native';
import styles from './HomeScreen.style';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import db from '../../Database/databaseService';
import NavigationButtons from './NavigationButtons';
import ModalForm from './ModalForm';
import {StateContext} from '../../../Utilities/Context';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {SelectCountFromDataTable} from './Actions';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const HomeScreen = ({navigation}: Props) => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  let register = () => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql('Delete from nameweekendingtable', []);
        txn.executeSql(
          'INSERT INTO nameweekendingtable (Name, Week_Ending_Date) VALUES(?,?)',
          [state.name, state.date],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rowsAffected > 0) {
              setTimeout(() => {
                navigation.navigate('Enter Data');
                dispatch({type: 'UPDATE', payload: {modalVisible: false}});
              }, 1000);
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  };

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM nameweekendingtable',
          [],
          (_tx: Transaction, res: ResultSet) => {
            var len = res.rows.length;
            // console.log('len', len);
            if (len > 0) {
              let result = res.rows.item(0);
              dispatch({
                type: 'UPDATE',
                payload: {
                  name: result.Name,
                  Week_Ending_Date: result.Week_Ending_Date,
                },
              });
            } else {
              // setuserdata('');
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, [dispatch]);

  let changeweekendingdate = () => {
    dispatch({type: 'UPDATE', payload: {modalVisible: false}});
  };

  let load = () => {
    if (!state.date || !state.name) {
      Alert.alert('Put name and date in');
    } else {
      register();
      dispatch({type: 'UPDATE', payload: {modalVisible: false}});
    }
  };

  useEffect(() => {
    SelectCountFromDataTable(dispatch);
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <ModalForm load={load} />

      <NavigationButtons changeweekendingdate={changeweekendingdate} />

      <Text style={styles.footertext}>
        Total Entries:{state.Number_Of_Entries}
      </Text>
      <Text style={styles.footertext}>WageFigurer</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
