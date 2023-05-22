/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable eqeqeq */
// /* eslint-disable no-unused-vars */
// /* eslint-disable no-undef */
// /* eslint-disable quotes */
// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */

import React, {useEffect} from 'react';
import {Text, SafeAreaView, Alert} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './HomeScreen.style';
//import envs from '../../config/env';
//const {DATABASE_NAME} = envs;
import {Transaction, ResultSet} from '../../databaseTypes';
import db from '../../databaseService';
import NavigationButtons from './NavigationButtons';
import ModalForm from './ModalForm';

import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const HomeScreen = ({navigation}: Props) => {
  interface State {
    modalVisible: boolean;
    date: string;
    name: string;
    day: string;
    showAlert: boolean;
    numberOfEntries: number;
  }
  const initialState = {
    modalVisible: true,
    date: '',
    name: '',
    day: '',
    showAlert: false,
    numberOfEntries: 0,
  };
  type Action =
    | {type: 'TOGGLE_MODAL_VISIBLE'}
    | {type: 'SET_MODAL_VISIBLE'; payload: boolean}
    | {type: 'SET_DATE'; payload: string}
    | {type: 'SET_NAME'; payload: string}
    | {type: 'SET_DAY'; payload: string}
    | {type: 'SET_SHOW_ALERT'; payload: boolean}
    | {type: 'SET_NUMBER_OF_ENTRIES'; payload: number};

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'TOGGLE_MODAL_VISIBLE':
        return {...state, modalVisible: !state.modalVisible};
      case 'SET_MODAL_VISIBLE':
        return {...state, modalVisible: action.payload};
      case 'SET_DATE':
        return {...state, date: action.payload};
      case 'SET_NAME':
        return {...state, name: action.payload};
      case 'SET_DAY':
        return {...state, day: action.payload};
      case 'SET_SHOW_ALERT':
        return {...state, showAlert: action.payload};
      case 'SET_NUMBER_OF_ENTRIES':
        return {...state, numberOfEntries: action.payload};
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = React.useReducer(reducer, initialState);

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
                dispatch({type: 'SET_SHOW_ALERT', payload: false});
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
              dispatch({type: 'SET_NAME', payload: result.Name});
              dispatch({type: 'SET_DATE', payload: result.Week_Ending_Date});
            } else {
              // setuserdata('');
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  let changeweekendingdate = () => {
    dispatch({type: 'SET_MODAL_VISIBLE', payload: false});
  };
  let load = () => {
    if (!state.date || !state.name) {
      Alert.alert('Put name and date in');
    } else {
      register();
      dispatch({type: 'TOGGLE_MODAL_VISIBLE'});
    }
  };
  let cancel = () => {
    dispatch({type: 'TOGGLE_MODAL_VISIBLE'});
  };

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, res: ResultSet) => {
            let len = res.rows.length;
            if (len >= 0) {
              dispatch({type: 'SET_NUMBER_OF_ENTRIES', payload: len});
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert show={state.showAlert} title="Success!" />

      <ModalForm
        modalvisible={state.modalVisible}
        load={load}
        cancel={cancel}
        name={state.name}
        date={state.date}
        day={state.day}
        setName={(name: string) => dispatch({type: 'SET_NAME', payload: name})}
        setDate={(date: string) => dispatch({type: 'SET_DATE', payload: date})}
        setDay={(day: string) => dispatch({type: 'SET_DAY', payload: day})}
      />

      <NavigationButtons changeweekendingdate={changeweekendingdate} />

      <Text style={styles.footertext}>
        Total Entries:{state.numberOfEntries}
      </Text>
      <Text style={styles.footertext}>WageFigurer</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
