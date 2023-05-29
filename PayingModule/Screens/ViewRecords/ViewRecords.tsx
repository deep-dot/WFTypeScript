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
  Alert,
} from 'react-native';
import {
  updateData,
} from '../Enter/dbUtility';
import Mytextinput from '../../Components/Mytextinput';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
//import Icon from 'react-native-vector-icons/Ionicons';
import db from '../../databaseService';
import {Transaction, ResultSet} from '../../databaseTypes';
interface ListItem {
  item: {
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
    driver_portion_lifting_fee?: string | typeof NaN;
    manual_lifting_fee_value?: string;
    no_wheelchair_lifts?: number;
    user_id?: number;
    [key: string]: number | string | null | undefined;
  };
  index: number;
}
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import MyButton from '../../Components/Mybutton';
// import ListItem from 'react-native-paper/lib/typescript/src/components/List/ListItem';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}

const ViewRecords = ({navigation}: Props) => {
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
                // console.log('temp in view records==',temp);
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

  const Delete = (idToDelete: number | undefined) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'DELETE FROM  datatable where user_id = ?',
          [idToDelete],
          (tx: Transaction) => {
            tx.executeSql(
              'SELECT * FROM datatable',
              [],
              (_tx: Transaction, results: ResultSet) => {
                var len = results.rows.length;
                setTotalrecords(len.toString());
                if (len > 0) {
                  var temp = [];
                  for (let i = 0; i < len; i++) {
                    temp.push(results.rows.item(i));
                  }
                  setFlatListItems(temp);
                }
              },
            );
            Alert.alert('Record deleted successfully!');
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  };

  const DeleteRecord = (idToDelete: number | undefined) => {
      Alert.alert(
        'Please confirm!',
        'Do you wish to delete the record?',
        [
          {
            text: 'Yes',
            onPress: () => {
              Delete((idToDelete));
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
  };

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 10, width: '100%', backgroundColor: '#000'}} />
    );
  };

  let listItemView = (item: ListItem) => {
    console.log(item?.item?.Day);
    if (item == null || item === undefined) {
      return null;
    }
    return (
      <View
        key={item?.item?.user_id}
        style={{backgroundColor: '#ffffff', marginTop: 10, padding: 5}}>
          <View style={styles.textinputview}>
        <MyButton
          title="Delete"
          customClick={() => DeleteRecord(item?.item?.user_id)}
        />
        <MyButton
          title="Update"
          customClick={() => updateData(item?.item?.Date)}
        />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Record Id</Text>
          <Text style={styles.titletext}>{item?.item?.user_id}</Text>
        </View>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Day</Text>
          <Text style={styles.titletext}>{item?.item?.Day}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Date</Text>
          <Text style={styles.titletext}>{item?.item?.Date}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Worked</Text>
          <Text style={styles.titletext}>{item?.item?.Shift}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Taxi Number</Text>
          <Text style={styles.titletext}>{item?.item?.Taxi}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Jobs</Text>
          <Text style={styles.titletext}>{item?.item?.Jobs}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Insurancefee</Text>
          <Text style={styles.titletext}>{item?.item?.Ins}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total fare</Text>
          <Text style={styles.titletext}>{item?.item?.Shift_Total}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Commission Company</Text>
          <Text style={styles.titletext}>{item?.item?.Com_GTN}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Km</Text>
          <Text style={styles.titletext}>{item?.item?.Kms}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Paid Km</Text>
          <Text style={styles.titletext}>{item?.item?.Paid_Kms}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos</Text>
          <Text style={styles.titletext}>{item?.item?.Eftpos_Total}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos Lifting</Text>
          <Text style={styles.titletext}>{item?.item?.Eftpos_LFee}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Dockets</Text>
          <Text style={styles.titletext}>{item?.item?.Dockets}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Charge Authority</Text>
          <Text style={styles.titletext}>{item?.item?.Charge_Authority}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual</Text>
          <Text style={styles.titletext}>{item?.item?.Manual_MPTP_Total}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual-31</Text>
          <Text style={styles.titletext}>{item?.item?.Gov_Sub_Manual31}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Manual Lifts</Text>
          <Text style={styles.titletext}>{item?.item?.No_of_Manual_Lifts}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee Value</Text>
          <Text style={styles.titletext}>
            {item?.item?.Total_Lifting_Fee_Value}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Misc</Text>
          <Text style={styles.titletext}>{item?.item?.Misc}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Fuel</Text>
          <Text style={styles.titletext}>{item?.item?.Acc_Fuel}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>CPK</Text>
          <Text style={styles.titletext}>{item?.item?.CPK}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Manual docket value {'\n'} (For M31 or M30){' '}
          </Text>
          <Text style={styles.titletext}>
            {item?.item?.manual_lifting_fee_value}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number of chairs</Text>
          <Text style={styles.titletext}>
            {item?.item?.no_wheelchair_lifts}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Company lifting fee</Text>
          <Text style={styles.titletext}>
            {item?.item?.company_portion_lifting_fee}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Driver lifting fee</Text>
          <Text style={styles.titletext}>
            {item?.item?.driver_portion_lifting_fee}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Deductions</Text>
          <Text style={styles.titletext}>{item?.item?.Deductions}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            Net Cash
          </Text>
          <Text style={{fontSize: 18, color: '#000000', fontWeight: 'bold'}}>
            {item?.item?.Net_Payin}
          </Text>
        </View>
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
            onChange={(tareek: string) => setstart_date(tareek)}
            OnChange={(tareek: string) => setstart_day(tareek)}
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
            onChange={(tareek: string) => setfinish_date(tareek)}
            OnChange={(tareek: string) => setfinish_day(tareek)}
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
        keyExtractor={(index: number) => index.toString()}
        renderItem={(item: ListItem) => listItemView(item)}
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
          onPress={() => navigation.navigate('Home Screen')}
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
    color: '#000',
    fontSize: 14,
  },
  textInput: {
    height: 45,
    padding: 0,
    color: '#ffffff',
  },
});
export default ViewRecords;
