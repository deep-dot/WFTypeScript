/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  View,
  SafeAreaView,
} from 'react-native';
import Mytextinput from '../../Components/Mytextinput';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
//import Icon from 'react-native-vector-icons/Ionicons';
import db from '../../databaseService';
import {Transaction, ResultSet} from '../../databaseTypes';
interface ListItem {
  Acc_Fuel?: number;
  CPK?: number;
  Car_Wash?: string;
  Charge_Authority?: number;
  Com_Driver?: number;
  Com_GTN?: number;
  Company_Comm_Rate?: number;
  Current_Date?: string | null;
  Date?: string;
  Day?: string;
  Deductions?: number;
  Dockets?: string;
  Driver_Comm_Rate?: number;
  Eftpos_LFee?: number;
  Eftpos_Total?: number;
  Gov_Sub_Manual?: string;
  Gov_Sub_Manual31?: string;
  Hours_Worked?: number;
  Ins?: number;
  Jobs?: number;
  Km_Finish?: number;
  Km_Start?: number;
  Kms?: number;
  Manual_MPTP_Total?: string;
  Meter_Finish?: number;
  Meter_Start?: number;
  Misc?: string;
  Name?: string | null;
  Net_Payin?: number;
  No_of_Manual_Lifts?: number;
  Paid_Kms?: number;
  Paidkm_Finish?: number;
  Paidkm_Start?: number;
  Shift?: string;
  Shift_Total?: number;
  Taxi?: string;
  Total_Levy?: number;
  Total_Lifting_Fee_Value?: number;
  Unpaid_kms?: string;
  Week_Ending_Date?: string | null;
  company_portion_lifting_fee?: number;
  driver_portion_lifting_fee?: string;
  manual_lifting_fee_value?: string;
  no_wheelchair_lifts?: number;
  user_id?: number;
  [key: string]: number | string | null | undefined;
}

import {DrawerNavigationProp} from '@react-navigation/drawer';
type DrawerParamList = {
  'View Records': undefined;
  // Other routes...
};
type EnterDataScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList, 'View Records'>;
};

const ViewRecords: React.FC<EnterDataScreenProps> = ({navigation}) => {
  let [flatListItems, setFlatListItems] = useState<ListItem[]>([]);
  let [totalrecords, setTotalrecords] = useState<string>('');

  let [start_date, setstart_date] = useState<string>('');
  let [_start_day, setstart_day] = useState<string>('');
  let [finish_date, setfinish_date] = useState<string>('');
  let [_finish_day, setfinish_day] = useState<string>('');

  //number of Entries
  const [numberofEntries, setNumberofEntries] = useState('');
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            setNumberofEntries(len.toString());
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  let searchUser = () => {
    if (!start_date || !finish_date) {
      setShow2Alert(true);
    } else {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'SELECT * from datatable where Date between ? and ? order by Date',
            [start_date, finish_date],
            (_tx: Transaction, results: ResultSet) => {
              var len = results.rows.length;
              setTotalrecords(len.toString());
              if (len > 0) {
                var temp = [];
                for (let i = 0; i < len; i++) {
                  temp.push(results.rows.item(i));
                }
                setFlatListItems(temp);
              } else {
                setFlatListItems([]);
                setSorryAlert(true);
              }
            },
          );
        });
      } else {
        console.log('db is undefined');
      }
    }
  };

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#ffffff'}} />
    );
  };

  let listItemView = (item: ListItem) => {
    // console.log('item in view screen===', item);
    return (
      <View
        key={item.user_id}
        style={{
          alignContent: 'center',
          backgroundColor: '#24252b',
          marginTop: 10,
          padding: 5,
        }}>
        {Object.keys(item).map(key => {
          return (
            <View key={key} style={styles.textinputview}>
              <Text style={styles.titletext}>{key}</Text>
              <Text style={styles.titletext}>{item[key]}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const [sorryAlert, setSorryAlert] = useState(false);
  const [show2Alert, setShow2Alert] = useState(false);
  const HideAlert = () => {
    setSorryAlert(false);
    setShow2Alert(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert
        show={sorryAlert}
        showProgress={false}
        title="SORRY !"
        message="No data found."
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#54cb77"
        onConfirmPressed={HideAlert}
      />
      <AwesomeAlert
        show={show2Alert}
        showProgress={false}
        title=""
        message="Please select Date !"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#54cb77"
        onConfirmPressed={HideAlert}
      />
      <ScrollView>
        <Text style={{color: '#ffffff', textAlign: 'center'}}>
          Total Number of Entries = {numberofEntries}
        </Text>

        <View style={styles.textinputview}>
          <Calendar
            value={start_date}
            onChange={tareek => setstart_date(tareek)}
            OnChange={tareek => setstart_day(tareek)}
          />
          <Mytextinput
            placeholder="From"
            //style={styles.titletext}
            value={start_date}
            editable={false}
            color="#fff"
          />
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={finish_date}
            onChange={tareek => setfinish_date(tareek)}
            OnChange={tareek => setfinish_day(tareek)}
          />
          <Mytextinput
            placeholder="To"
            // style={styles.titletext}
            value={finish_date}
            editable={false}
            color="#fff"
          />
        </View>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: '#54cb77',
            borderRadius: 5,
            elevation: 20,
            shadowColor: '#000000',
            padding: 10,
            margin: 5,
            marginLeft: 0,
            width: '50%',
            alignSelf: 'center',
          }}
          onPress={searchUser}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 14,
            }}>
            View
          </Text>
        </TouchableOpacity>

        <View style={{borderBottomWidth: 1, alignItems: 'center'}}>
          <Text style={styles.titletext}>
            {' '}
            Display Records = {totalrecords}
          </Text>
        </View>
      </ScrollView>

      <FlatList
        data={flatListItems}
        ItemSeparatorComponent={listViewItemSeparator}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({item}) => listItemView(item)}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#444444',
          padding: 15,
          borderTopColor: 'white',
          borderTopWidth: 2,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'column',
          }}>
          {/* <Icon name="home" size={20} color="#fff" /> */}
          <Text
            style={{
              color: '#ffffff',
              fontSize: 10,
              textAlign: 'center',
            }}>
            HOME
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textinputview: {
    flexDirection: 'row',
    borderColor: '#ffffff',
    borderBottomWidth: 0.5,
    marginRight: 10,
    marginTop: 20,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titletext: {
    color: '#ffffff',
    fontSize: 14,
  },
  textInput: {
    height: 45,
    padding: 0,
    color: '#ffffff',
  },
});
export default ViewRecords;
