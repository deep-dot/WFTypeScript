/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useContext} from 'react';
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
import {UpdateData} from '../../Components/dbUtility';
import Mytextinput from '../../Components/Mytextinput';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
//import Icon from 'react-native-vector-icons/Ionicons';
import db from '../../Database/databaseService';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';
import {FormValues} from '../Enter/component/EnterDataValues';
import MyButton from '../../Components/Mybutton';
import {StateContext} from '../../../Utilities/Context';

const ViewRecords = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'View Records'>>();

  let [flatListItems, setFlatListItems] = useState<FormValues[]>([]);
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

  let SearchRecord = () => {
    if (!start_date || !finish_date) {
      setShow2Alert(true);
    } else {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'SELECT * from datatable where Date between ? and ? order by Date',
            [start_date, finish_date],
            (_tx: Transaction, results: ResultSet) => {
              console.log('results in View records==', results);
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
          'DELETE FROM  datatable where Record_id = ?',
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

  const DeleteRecord = (idToDelete: number) => {
    Alert.alert(
      'Please confirm!',
      'Do you wish to delete the record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Delete(idToDelete);
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

  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  const handleRefresh = async (searchDate: string) => {
    try {
      const searchedData = await UpdateData(searchDate, dispatch);
      dispatch({type: 'UPDATE', payload: searchedData});
      navigation.navigate('Enter Data');
    } catch (error) {
      // handle error
      console.error(error);
    }
  };

  let listItemView = (item: FormValues) => {
    console.log(item?.Day);
    if (item == null || item === undefined) {
      return null;
    }
    return (
      <View
        key={item?.Record_id}
        style={{backgroundColor: '#ffffff', marginTop: 10, padding: 5}}>
        <View style={styles.textinputview}>
          <MyButton
            title="Delete"
            customClick={() => DeleteRecord(item?.Record_id)}
          />
          <MyButton
            title="Update"
            // customClick={() => updateData(item?.Date)}
            customClick={() => handleRefresh(item?.Date)}
          />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Record Id</Text>
          <Text style={styles.titletext}>{item?.Record_id}</Text>
        </View>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Day</Text>
          <Text style={styles.titletext}>{item?.Day}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Date</Text>
          <Text style={styles.titletext}>{item?.Date}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Worked</Text>
          <Text style={styles.titletext}>{item?.Shift}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Taxi Number</Text>
          <Text style={styles.titletext}>{item?.Taxi}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Jobs</Text>
          <Text style={styles.titletext}>{item?.Jobs_Done}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Insurancefee</Text>
          <Text style={styles.titletext}>{item?.Insurance}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total fare</Text>
          <Text style={styles.titletext}>{item?.Shift_Total}</Text>
        </View>

        {/* <View style={styles.textinputview}>
          <Text style={styles.titletext}>Commission Company</Text>
          <Text style={styles.titletext}>{item?.Com_GTN}</Text>
        </View> */}

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Km</Text>
          <Text style={styles.titletext}>{item?.Kms}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Paid Km</Text>
          <Text style={styles.titletext}>{item?.Paid_Kms}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos</Text>
          <Text style={styles.titletext}>{item?.Eftpos}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Eftpos Lifting</Text>
          <Text style={styles.titletext}>{item?.Eftpos_Lifting_Value}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Dockets</Text>
          <Text style={styles.titletext}>{item?.M3_Dockets}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Charge Authority</Text>
          <Text style={styles.titletext}>
            {item?.Electronic_Account_Payments}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual</Text>
          <Text style={styles.titletext}>
            {item?.Total_Manual_MPTP31_And_MPTP_Values}
          </Text>
        </View>

        {/* <View style={styles.textinputview}>
          <Text style={styles.titletext}>Gov Sub Manual-31</Text>
          <Text style={styles.titletext}>{item?.Gov_Sub_Manual31}</Text>
        </View> */}

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Number Of Manual Lifts</Text>
          <Text style={styles.titletext}>
            {item?.Number_Of_Manual_Liftings}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Misc</Text>
          <Text style={styles.titletext}>{item?.Misc}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Fuel</Text>
          <Text style={styles.titletext}>{item?.Fuel}</Text>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>CPK</Text>
          <Text style={styles.titletext}>{item?.CPK}</Text>
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
          onPress={SearchRecord}>
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
        renderItem={(item: FormValues) => listItemView(item)}
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
