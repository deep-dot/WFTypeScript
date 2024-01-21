/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useContext } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  ViewRecordsByDate,
  UpdateData,
  SelectFromDataTable,
  deleteDataInTable,
} from '../../../Utilities/Actions';
import { Calendar } from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import { NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../../App';
import { useNavigation } from '@react-navigation/core';
import { FormValues } from '../../Components/EnterDataValues';
import { StateContext } from '../../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row } from 'react-native-table-component';
import {
  tableHead,
  widthArr,
} from '../DisplayReport/tableHeading';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../screens.style';
import moment from 'moment';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.']);



const ViewRecords = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'View Records'>>();
  const [flatListItems, setFlatListItems] = useState<FormValues[]>([]);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const { state, dispatch } = stateContext;

  let SearchRecord = async (start_date: string, finish_date: string) => {
    //console.log('start date==', start_date, finish_date);
    const current_date = moment(new Date()).format('YYYY/MM/DD');
    const startDate = start_date ? start_date : current_date;
    const endDate = finish_date ? finish_date : current_date;
    try {
      const res = await ViewRecordsByDate(startDate, endDate);
      // console.log('res===', res);
      if (res.length === 0) {
        dispatch({
          type: 'UPDATE',
          payload: { sorryAlert: true },
        });
        setFlatListItems([]);
      } else {
        dispatch({
          type: 'UPDATE',
          payload: { totalrecords: res.length },
        });
        setFlatListItems(res);
        //console.log(flatListItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Delete = async (date: string) => {
    const res: any = await deleteDataInTable(date);
    if (res.status === 'Deleted successfully') {
      let data = flatListItems.filter(item => item.Date !== date);
      setFlatListItems(data);
      dispatch({
        type: 'UPDATE',
        payload: { totalrecords: state.totalrecords - res.length,
        Number_Of_Entries: state.Number_Of_Entries - res.length },
      });
    }
    SelectFromDataTable(dispatch)
      .then(temp => {
        setFlatListItems(temp);
      })
      .catch(error => {
        console.error(error);
      });
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
      { cancelable: true },
    );
  };

  const edit = async (searchDate: string) => {
    try {
      await UpdateData(searchDate, dispatch);
      navigation.navigate('Enter Data');
    } catch (error) {
      Alert.alert('Record does not exist');
      //console.error(error);
    }
  };

  const HideAlert = () => {
    dispatch({ type: 'UPDATE', payload: { sorryAlert: false, show2Alert: false } });
  };

  return (
    <SafeAreaView
      style={{ display: 'flex', flex: 1, backgroundColor: '#35363A' }}>
      <AwesomeAlert
        show={state.sorryAlert}
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
        show={state.show2Alert}
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

      <View
        style={{
          backgroundColor: '#fff',
          borderColor: '#000',
          borderBottomWidth: 0.5,
        }}>
        <Text style={{ textAlign: 'center', color: 'green', paddingTop: 20 }}>
          Total Entries = {state.Number_Of_Entries}
        </Text>

        <View style={[styles.textinputview, { borderColor: '#fff' }]}>
          <Calendar
            value={state.start_date}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: { start_date: date, start_day: day, totalrecords: 0},
              });
             // SearchRecord(date, state.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.start_date
              ? state.start_day + ' ' + state.start_date
              : moment(new Date()).format('dddd, YYYY/MM/DD')
            }
          </Text>
        </View>

        <View style={[styles.textinputview, { borderColor: '#fff' }]}>
          <Calendar
            value={state.finish_date}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: { finish_date: date, finish_day: day },
              });
              SearchRecord(state.start_date, state.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.finish_date
              ? state.finish_day + ' ' + state.finish_date
              : moment(new Date()).format('dddd, YYYY/MM/DD')
            }
          </Text>
        </View>

        <Text style={[styles.Textinput, { alignSelf: 'center' }]}>
          {' '}
          Display Records = {state.totalrecords}
        </Text>
      </View>

      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{ borderWidth: 0, borderColor: '#C1C0B9' }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
            />
            {flatListItems && flatListItems.map((rowdata, index) => (
              <Row
                key={index}
                data={[
                  <View style={styles.rowButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        DeleteRecord(rowdata.Date);
                      }}>
                      <Icon name="trash-outline" size={20} color="tomato" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        edit(rowdata.Date);
                      }}>
                      <Icon name="create-outline" size={20} color="#000" />
                    </TouchableOpacity>
                  </View>,
                  rowdata.Date,
                  rowdata.Day,
                  rowdata.Shift,
                  rowdata.Taxi,
                  rowdata.Jobs_Done,
                  (rowdata.Insurance).toFixed(2),
                  rowdata.Hours_Worked,
                  (rowdata.Shift_Total).toFixed(2),
                  rowdata.Kms,
                  rowdata.Paid_Kms,
                  (rowdata.Eftpos).toFixed(2),
                  rowdata.Number_Of_Manual_Liftings,
                  (rowdata.Total_Manual_MPTP31_And_MPTP_Values).toFixed(2),
                  (rowdata.M3_Dockets).toFixed(2),
                  (rowdata.Electronic_Account_Payments).toFixed(2),
                  (rowdata.Car_Wash).toFixed(2),
                  (rowdata.Misc).toFixed(2),
                  (rowdata.Fuel).toFixed(2),
                  (rowdata.CPK).toFixed(2),
                  (rowdata.Net_Payin).toFixed(2),
                ]}
                widthArr={widthArr}
                style={{
                  ...styles.row,
                  ...(index % 2 === 0 ? { backgroundColor: 'white' } : {}),
                }}
              />
            ))}
          </Table>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#444444',
          paddingHorizontal: 35,
          paddingVertical: 10,
          borderTopColor: 'white',
          borderTopWidth: 2,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Enter Data')}>
          <Icon name="enter-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Display Report');
          }}>
          <Icon name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ViewRecords;
