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
import {
  UpdateData,
  selectCountFromDataTable,
  deleteDataInTable,
} from '../../Components/dbUtility';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
//import Icon from 'react-native-vector-icons/Ionicons';
import db from '../../Database/databaseService';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';
import {FormValues, initialValues} from '../../Components/EnterDataValues';
import MyButton from '../../Components/Mybutton';
import {StateContext} from '../../../Utilities/Context';

const ViewRecords = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'View Records'>>();
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;

  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            setFormValues(prevState => ({
              ...prevState,
              Number_Of_Entries: len.toString(),
            }));
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  let SearchRecord = () => {
    if (!formValues.start_date || !formValues.finish_date) {
      setFormValues(prevState => ({...prevState, show2Alert: true}));
    } else {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'SELECT * from datatable where Date between ? and ? order by Date',
            [formValues.start_date, formValues.finish_date],
            (_tx: Transaction, results: ResultSet) => {
              console.log('results in View records==', results);
              var len = results.rows.length;
              setFormValues(prevState => ({
                ...prevState,
                totalrecords: len.toString(),
              }));
              if (len > 0) {
                var temp: any = [];
                for (let i = 0; i < len; i++) {
                  temp.push(results.rows.item(i));
                }
                // console.log('temp in view records==',temp);
                setFormValues(prevState => ({
                  ...prevState,
                  flatListItems: temp,
                }));
              } else {
                setFormValues(prevState => ({
                  ...prevState,
                  sorryAlert: true,
                  flatListItems: [],
                }));
              }
            },
          );
        });
      } else {
        console.log('db is undefined');
      }
    }
  };

  const Delete = async (date: string) => {
    const res = await deleteDataInTable(date);
    if (res === 'Deleted successfully') {
      selectCountFromDataTable()
        .then(({len, temp}) => {
        //  console.log(len, temp);
          setFormValues(prevState => ({
            ...prevState,
            totalrecords: len.toString(),
            flatListItems: temp,
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const DeleteRecord = (date: string) => {
    Alert.alert(
      'Please confirm!',
      'Do you wish to delete the record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Delete(date);
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
            customClick={() => DeleteRecord(item?.Date)}
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

  const HideAlert = () => {
    setFormValues(prevState => ({
      ...prevState,
      sorryAlert: false,
      show2Alert: false,
    }));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert
        show={formValues.sorryAlert}
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
        show={formValues.show2Alert}
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
          Total Number of Entries = {formValues.Number_Of_Entries}
        </Text>

        <View style={styles.textinputview}>
          <Calendar
            value={formValues.start_date}
            onChange={(date: string, day: string) => {
              setFormValues(prevValues => ({
                ...prevValues,
                start_date: date,
                start_day: day,
              }));
            }}
          />
          <Text style={styles.Textinput}>
            {formValues.start_date
              ? formValues.start_day + ' ' + formValues.start_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={formValues.finish_date}
            onChange={(date: string, day: string) => {
              setFormValues(prevValues => ({
                ...prevValues,
                finish_date: date,
                finish_day: day,
              }));
            }}
          />
          <Text style={styles.Textinput}>
            {formValues.finish_date
              ? formValues.finish_day + ' ' + formValues.finish_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
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
            Display Records = {formValues.totalrecords}
          </Text>
        </View>
      </ScrollView>

      <FlatList
        data={formValues.flatListItems}
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
  Textinput: {
    height: 35,
    padding: 5,
    color: '#55a8fa',
  },
});
export default ViewRecords;
