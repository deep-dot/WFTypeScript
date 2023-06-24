/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
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
} from './Actions';
import {Calendar} from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import {NavigationProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';
import {FormValues} from '../../Components/EnterDataValues';
import {StateContext} from '../../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';
import {Table, Row} from 'react-native-table-component';
import {
  tableHead,
  tableHead1,
  tableHead2,
  widthArr,
  widthArr1,
  widthArr2,
} from '../DisplayReport/tableHeading';
import {ScrollView} from 'react-native-gesture-handler';

const ViewRecords = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'View Records'>>();
  const [flatListItems, setFlatListItems] = useState<FormValues[]>([]);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;

  let SearchRecord = async (start_date: string, finish_date: string) => {
    // console.log('start date==', start_date);
    const current_date = new Date().toLocaleDateString();
    const startDate = start_date ? start_date : current_date;
    const endDate = finish_date ? finish_date : current_date;
    try {
      const res = await ViewRecordsByDate(startDate, endDate);
      // console.log('res===', res);
      dispatch({
        type: 'UPDATE',
        payload: {totalrecords: res.length.toString()},
      });
      // console.log(res[0].Record_id);
      setFlatListItems(res);
      if (res.length === 0) {
        dispatch({
          type: 'UPDATE',
          payload: {sorryAlert: true},
        });
        setFlatListItems([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Delete = async (id: string, date: string) => {
    const res = await deleteDataInTable(id, date);
    if (res === 'Deleted successfully') {
      SelectFromDataTable(dispatch)
        .then(temp => {
          setFlatListItems(temp);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const DeleteRecord = (id: string, date: string) => {
    Alert.alert(
      'Please confirm!',
      'Do you wish to delete the record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Delete(id, date);
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

  const handleRefresh = async (searchDate: string) => {
    try {
      await UpdateData(searchDate, dispatch);
      navigation.navigate('Enter Data');
    } catch (error) {
      console.error(error);
    }
  };

  const tableData = flatListItems.map(record => ({
    Date: record.Date,
    Day: record.Day,
    Shift: record.Shift,
    Taxi: record.Taxi,
    Jobs_Done: record.Jobs_Done,
    Insurance: record.Insurance,
    Hours_Worked: record.Hours_Worked,
    Meter_Start: record.Meter_Start,
    Meter_Finish: record.Meter_Finish,
    Shift_Total: record.Shift_Total,
    Km_Start: record.Km_Start,
    Km_Finish: record.Km_Finish,
    Kms: record.Kms,
    Paidkm_Start: record.Paidkm_Start,
    Paidkm_Finish: record.Paidkm_Finish,
    Paid_Kms: record.Paid_Kms,
    Eftpos: record.Eftpos,
    Number_Of_Manual_Liftings: record.Number_Of_Manual_Liftings,
    Total_Manual_MPTP31_And_MPTP_Values:
      record.Total_Manual_MPTP31_And_MPTP_Values,
    M3_Dockets: record.M3_Dockets,
    Electronic_Account_Payments: record.Electronic_Account_Payments,
    Car_Wash: record.Car_Wash,
    Misc: record.Misc,
    Fuel: record.Fuel,
    CPK: record.CPK.toFixed(2),
    Net_Payin: record.Net_Payin,
  }));

  //console.log('table data===', tableData);
  const HideAlert = () => {
    dispatch({type: 'UPDATE', payload: {sorryAlert: false, show2Alert: false}});
  };

  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: '#35363A'}}>
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
        <Text style={{textAlign: 'center', color: 'green', paddingTop: 20}}>
          Total Entries = {state.Number_Of_Entries}
        </Text>

        <View style={[styles.textinputview, {borderColor: '#fff'}]}>
          <Calendar
            value={state.start_date}
            onChange={async (date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {start_date: date, start_day: day},
              });
              await SearchRecord(date, state.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.start_date
              ? state.start_day + ' ' + state.start_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <View style={[styles.textinputview, {borderColor: '#fff'}]}>
          <Calendar
            value={state.finish_date}
            onChange={async (date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {finish_date: date, finish_day: day},
              });
              await SearchRecord(state.start_date, date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.finish_date
              ? state.finish_day + ' ' + state.finish_date
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        <Text style={[styles.Textinput, {alignSelf: 'center'}]}>
          {' '}
          Display Records = {state.totalrecords}
        </Text>
      </View>

      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
            {tableData.map((rowdata, index) => (
              <Row
                key={index}
                data={[
                  <View style={styles.rowButtons}>
                    <TouchableOpacity
                      onPress={() => {
                        DeleteRecord(
                          rowdata[index].Record_id.toString(),
                          rowdata[index].Date,
                        );
                      }}>
                      <Icon name="trash-outline" size={20} color="tomato" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleRefresh(rowdata.Date);
                      }}>
                      <Icon name="create-outline" size={20} color="#000" />
                    </TouchableOpacity>
                  </View>,
                  rowdata.Date,
                  rowdata.Day,
                  rowdata.Shift,
                  rowdata.Taxi,
                  rowdata.Jobs_Done,
                  rowdata.Insurance,
                  rowdata.Hours_Worked,
                  rowdata.Meter_Start,
                  rowdata.Meter_Finish,
                  rowdata.Shift_Total,
                  rowdata.Km_Start,
                  rowdata.Km_Finish,
                  rowdata.Kms,
                  rowdata.Paidkm_Start,
                  rowdata.Paidkm_Finish,
                  rowdata.Paid_Kms,
                  rowdata.Eftpos,
                  rowdata.Number_Of_Manual_Liftings,
                  rowdata.Total_Manual_MPTP31_And_MPTP_Values,
                  rowdata.M3_Dockets,
                  rowdata.Electronic_Account_Payments,
                  rowdata.Car_Wash,
                  rowdata.Misc,
                  rowdata.Fuel,
                  rowdata.CPK,
                  rowdata.Net_Payin,
                ]}
                widthArr={widthArr}
                style={{
                  ...styles.row,
                  ...(index % 2 === 0 ? {backgroundColor: 'white'} : {}),
                }}
                textStyle={styles.text}
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

const styles = StyleSheet.create({
  header: {height: 30, backgroundColor: '#ffffff'},
  text: {textAlign: 'center', fontWeight: 'bold', padding: 0, fontSize: 12},
  row: {height: 30, backgroundColor: '#ffffff'},
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textinputview: {
    flexDirection: 'row',
    borderColor: '#000',
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
