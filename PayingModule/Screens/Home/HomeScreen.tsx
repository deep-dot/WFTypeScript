/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable eqeqeq */
// /* eslint-disable no-unused-vars */
// /* eslint-disable no-undef */
// /* eslint-disable quotes */
// /* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Linking,
  Modal,
  Image,
  Alert,
} from 'react-native';

import Mybutton from '../../Components/Mybutton';
import Calendar from '../../Components/Calendar';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import SQLite from 'react-native-sqlite-storage';
import {ScrollView} from 'react-native-gesture-handler';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './HomeScreen.style';
//import envs from '../../config/env';
//const {DATABASE_NAME} = envs;

type Transaction = {
  executeSql: (
    sql: string,
    args?: any[],
    success?: (transaction: Transaction, resultSet: ResultSet) => void,
    error?: (transaction: Transaction, error: any) => void,
  ) => void;
};

type ResultSet = {
  rowsAffected: number;
  insertId?: number;
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
};

let db: SQLiteDatabase | undefined;
db = (SQLite.openDatabase as any)(
  {name: 'database.db', createFromLocation: 1},
  () => {},
  (error: any) => {
    console.log('ERROR:' + error);
  },
);

import {DrawerNavigationProp} from '@react-navigation/drawer';
type DrawerParamList = {
  Home: undefined;
  Notifications: undefined;
  // Add other screens here
};
type HomeScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({navigation}: Props) => {
  const [modalvisible, setModalvisible] = useState(true);
  const [date, setDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [_day, setDay] = useState<string>('');
  //const [showAlert, setShowAlert] = useState(false);
  //const [numberofEntries, setNumberofEntries] = useState<string>('');
  console.log('db in homescreen==', db);
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='datatable'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS datatable', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS datatable (user_id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Date TEXT, Day TEXT, Shift TEXT, Taxi TEXT, Jobs NUMERIC, Ins NUMERIC, Hours_Worked NUMERIC, Total_Levy NUMERIC, Car_Wash NUMERIC, Meter_Start NUMERIC, Meter_Finish NUMERIC, Shift_Total NUMERIC, Com_GTN NUMERIC, Com_Driver NUMERIC, Km_Start NUMERIC, Km_Finish NUMERIC, Kms NUMERIC, Paidkm_Start NUMERIC, Paidkm_Finish NUMERIC, Paid_Kms NUMERIC, Unpaid_kms NUMERIC, Eftpos_Total NUMERIC, Eftpos_LFee NUMERIC, Dockets NUMERIC, Charge_Authority NUMERIC, Manual_MPTP_Total NUMERIC, No_of_Manual_Lifts NUMERIC, Total_Lifting_Fee_Value NUMERIC, Misc NUMERIC, Acc_Fuel NUMERIC, Net_Payin NUMERIC, Week_Ending_Date TEXT, Current_Date TEXT, manual_lifting_fee_value NUMERIC, no_wheelchair_lifts NUMERIC, company_portion_lifting_fee NUMERIC, driver_portion_lifting_fee NUMERIC, Gov_Sub_Manual NUMERIC, Gov_Sub_Manual31 NUMERIC, CPK NUMERIC, Deductions NUMERIC, Driver_Comm_Rate NUMERIC, Company_Comm_Rate NUMERIC)',
                [],
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='nameweekendingtable'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            console.log('table', res.rows.length);
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS nameweekendingtable', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS nameweekendingtable (Name TEXT, Week_Ending_Date TEXT)',
                [],
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  //AlertBox
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

      <Modal
        transparent={true}
        presentationStyle={'pageSheet'}
        visible={modalvisible}
        animationType={'fade'}
        onRequestClose={() => {}}>
        <ScrollView>
          <View style={styles.model}>
            <Text style={styles.titletext}>Enter Name & Week Ending Date</Text>

            <TextInput
              placeholder="Enter Your Name"
              placeholderTextColor="#ffffff"
              style={styles.textInput}
              onChangeText={text => setName(text)}>
              <Text style={styles.titletext}>{name}</Text>
            </TextInput>

            <View
              style={{marginTop: 40, alignItems: 'center', marginBottom: 20}}>
              <Calendar
                onChange={tareek => setDate(tareek)}
                OnChange={din => setDay(din)}
              />

              <TextInput
                placeholder="Select Date"
                editable={false}
                placeholderTextColor="#ffffff"
                style={{
                  margin: 15,
                  backgroundColor: '#434343',
                  textAlign: 'center',
                  color: '#ffffff',
                  fontSize: 18,
                }}
                //style={styles.textInput}
                onChangeText={text => setDate(text)}>
                <Text style={styles.titletext}>{date}</Text>
              </TextInput>

              <Text>YYYY/MM/DD</Text>
            </View>

            <Mybutton
              background-Color="#555555"
              title="Submit"
              customClick={load}
            />
            <Mybutton title="Exit" customClick={cancel} />
          </View>
        </ScrollView>
      </Modal>
      <ScrollView style={{marginEnd: 20, marginStart: 20, marginTop: 10}}>
        <Image
          style={{width: 100, height: 100, alignSelf: 'center'}}
          source={require('../../Components/Images/WFLogo.png')}
        />
        <Mybutton
          title="Add"
          customClick={() => navigation.navigate('Register')}
        />
        <Mybutton
          title="Update"
          customClick={() => navigation.navigate('Update')}
        />
        <Mybutton
          title="View"
          customClick={() => navigation.navigate('ViewRecords')}
        />
        <Mybutton
          title="Delete"
          customClick={() => navigation.navigate('Delete')}
        />
        <Mybutton
          title="Create Report"
          customClick={() => navigation.navigate('DisplayReport')}
        />
        <Mybutton title="Update W E D" customClick={changeweekendingdate} />
        <Mybutton
          title="Youtube Link"
          customClick={() => Linking.openURL('https://youtu.be/ZlgtKUnXd-w')}
        />
      </ScrollView>
      <Text style={styles.footertext}>Total Entries:{numberofEntries}</Text>
      <Text style={styles.footertext}>WageFigurer</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
