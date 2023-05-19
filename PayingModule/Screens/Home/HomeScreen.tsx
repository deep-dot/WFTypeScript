/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable eqeqeq */
// /* eslint-disable no-unused-vars */
// /* eslint-disable no-undef */
// /* eslint-disable quotes */
// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */

import React, {useState, useEffect} from 'react';
import {Text, SafeAreaView, Alert} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './HomeScreen.style';
//import envs from '../../config/env';
//const {DATABASE_NAME} = envs;
import {Transaction, ResultSet} from '../../databaseTypes';
import db from '../../databaseService';
import NavigationButtons from './NavigationButtons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import ModalForm from './ModalForm';

type HomeScreenProps = {
  navigation: NavigationProp<ParamListBase>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [modalvisible, setModalvisible] = useState(true);
  const [date, setDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [_day, setDay] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);

  let register = () => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql('Delete from nameweekendingtable', []);
        txn.executeSql(
          'INSERT INTO nameweekendingtable (Name, Week_Ending_Date) VALUES(?,?)',
          [name, date],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rowsAffected > 0) {
              //setShowAlert(true);
              setTimeout(() => {
                navigation.navigate('Home');
                setShowAlert(false);
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
            console.log('len', len);
            if (len > 0) {
              let result = res.rows.item(0);
              updateallstates({a: result.Name, b: result.Week_Ending_Date});
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

  let updateallstates = ({a, b}: {a: string; b: string}) => {
    setName(a);
    setDate(b);
  };

  let changeweekendingdate = () => {
    setModalvisible(true);
  };
  let load = () => {
    if (!date || !name) {
      Alert.alert('Put name and date in');
    } else {
      register();
      setModalvisible(!modalvisible);
    }
  };
  let cancel = () => {
    setModalvisible(!modalvisible);
  };

  //number of Entries
  const [numberofEntries, setNumberofEntries] = useState<number>(0);
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, res: ResultSet) => {
            let len = res.rows.length;
            if (len >= 0) {
              setNumberofEntries(len);
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
      <AwesomeAlert show={showAlert} title="Success!" />

      <ModalForm
        modalvisible={modalvisible}
        load={load}
        cancel={cancel}
        name={name}
        date={date}
        setName={setName}
        setDate={setDate}
        setDay={setDay}
      />

      <NavigationButtons changeweekendingdate={changeweekendingdate} />

      <Text style={styles.footertext}>Total Entries:{numberofEntries}</Text>
      <Text style={styles.footertext}>WageFigurer</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
