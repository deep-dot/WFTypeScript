/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useCallback, useState } from 'react';
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
  deleteDataInTable,
} from '../../Utilities/Actions';
import { Calendar } from '../Components/Calendar';
import { NavigationProp } from '@react-navigation/native';
import { StackParamList } from '../../../App/App';
import { useNavigation } from '@react-navigation/core';
import { StateContext } from '../../Utilities/Context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Table, Row } from 'react-native-table-component';
import {
  tableHead,
  widthArr,
} from '../DisplayReport/tableHeading';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../screens.style';
import { LogBox } from 'react-native';
import { tableData } from '../Components/EnterDataValues';
// import { FormValues } from '../Components/EnterDataValues';

LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.']);



const ViewRecords = () => {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'View Records'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const { state, dispatch } = stateContext;
  const [isLoading, setIsLoading] = useState(false);
  const [ res, setRes] = useState<tableData[]>([]);

  const searchRecord = useCallback(async () => {
    setIsLoading(true);
    try {
      let tem = await ViewRecordsByDate(state.start_date, state.finish_date, dispatch);      
      setRes(tem);
      //console.log('res===',res);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching records:', error);
      setIsLoading(false);
    }
  },[ dispatch, state.start_date, state.finish_date]);

  useEffect(() => {
    if (state.start_date && state.finish_date)  {
      searchRecord();
    }
}, [searchRecord, state.finish_date, state.start_date]);

  const DeleteRecord = async (date: string) => {
    Alert.alert(
      'Please confirm!',
      'Do you wish to delete the record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteDataInTable(date, state, dispatch);
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

  return (
    <SafeAreaView
      style={{ display: 'flex', flex: 1, backgroundColor: '#35363A' }}>
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
                payload: { start_date: date, start_day: day, finish_date: '', table: 'datatable' },
              });
             // SearchRecord(date, state.finish_date);
            }}
          />
          <Text style={styles.Textinput}>
            {state.start_date
              ? state.start_day + ' ' + state.start_date
              // : moment(new Date()).format('dddd, YYYY/MM/DD')
              : 'Select'
            }
          </Text>
        </View>

        <View style={[styles.textinputview, { borderColor: '#fff' }]}>
          <Calendar
            value={state.finish_date}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: { finish_date: date, finish_day: day, table: 'datatable' },
              });
            }}
          />
          <Text style={styles.Textinput}>
            {state.finish_date
              ? state.finish_day + ' ' + state.finish_date
              // : moment(new Date()).format('dddd, YYYY/MM/DD')
              : 'Select'
            }
          </Text>
        </View>

        <Text style={[styles.Textinput, { alignSelf: 'center' }]}>
          {' '}
          Display Records = {state.totalrecords}
        </Text>
      </View>

      {isLoading ? (
      <Text>Loading...</Text> // Show a loading message or a spinner
    ) : (
      <ScrollView horizontal={true}>
        <View>
         {state.start_date !== '' && state.finish_date !== '' ?
          <Table borderStyle={{ borderWidth: 0, borderColor: '#C1C0B9' }}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
            />
            {/* {flatListItems && flatListItems.map((rowdata, index) => ( */}
            {res && res.map((rowdata, index: number) => (
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
                  rowdata.Insurance,
                  rowdata.Hours_Worked,
                  rowdata.Shift_Total,
                  rowdata.Kms,
                  rowdata.Paid_Kms,
                  rowdata.Eftpos,
                  rowdata.Eftpos_Liftings,
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
                  ...(index % 2 === 0 ? { backgroundColor: 'white' } : {}),
                }}
              />
            ))}
          </Table>
          : <View/>
          }
        </View>
      </ScrollView>
    )}
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
            state.totalrecords ?
            navigation.navigate('Display Report') :
            Alert.alert('No records');
          }}>
          <Icon name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ViewRecords;
