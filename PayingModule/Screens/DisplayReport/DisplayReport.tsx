/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './DisplayReport.style';
import {ViewRecordsByDate} from '../ViewRecords/Actions';
import {StateContext} from '../../../Utilities/Context';
import {totalTable} from './Actions';
import {
  tableHead,
  tableHead1,
  tableHead2,
  widthArr,
  widthArr1,
  widthArr2,
} from './tableHeading';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';
import {useNavigation} from '@react-navigation/core';

export default function DisplayReport() {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'Display Report'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {starRating, state, dispatch} = stateContext;

  useEffect(() => {
    let Report = async () => {
      if (!state.start_date || !state.finish_date) {
        Alert.alert('Please select Date !');
      } else {
        const results = await ViewRecordsByDate(
          state.start_date,
          state.finish_date,
        );
        dispatch({
          type: 'UPDATE',
          payload: {table: results, nametable: results},
        });
        await totalTable(dispatch);
      }
    };
    Report();
  }, [dispatch, state.finish_date, state.start_date]);

  state.tableData = state.table.map(record => [
    record.Date,
    record.Day,
    record.Shift,
    record.Taxi,
    record.Jobs_Done,
    record.Insurance,
    record.Shift_Total,
    record.Company_Comm_Rate,
    record.Kms,
    record.Paid_Kms,
    record.Eftpos,
    record.Eftpos_Lifting_Value,
    record.M3_Dockets,
    record.Electronic_Account_Payments,
    record.Total_Manual_MPTP31_And_MPTP_Values,
    record.Number_Of_Manual_Liftings,
    record.Misc,
    record.Fuel,
    record.Net_Payin,
    record.CPK,
  ]);

  state.datatotal = [
    'Total',
    '',
    '',
    '',
    state.total.Jobs_Done,
    state.total.Insurance,
    // state.Shift_Total,
    // state.Company_Comm_Rate,
    // state.Kms,
    // state.Paid_Kms,
    // state.Eftpos,
    // state.Eftpos,
    // state.M3_Dockets,
    // state.Electronic_Account_Payments,
    // state.Total_Manual_MPTP31_And_MPTP_Values,
    // state.Number_Of_Manual_Liftings,
    // state.Misc,
    // state.Fuel,
    // state.Net_Payin,
    // state.CPK,
  ];
  console.log(state.datatotal);
  state.liftingdata = [state.total.Jobs_Done, state.total.Insurance];

  state.Deductdata = [state.total.Jobs_Done, state.total.Insurance];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert show={state.done} title="Done it!" message="Thank you." />
      <AwesomeAlert
        show={state.usingservice}
        title="Thank you for using our service."
      />

      <ScrollView>
        <View
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Name: {state.Name} {'\n'}
            Payin Summary for the Week Ending: {'\n'}
            {state.Week_Ending_Date} {'\n'}
            Report creating date: {new Date().toDateString()}
          </Text>

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
                {state.tableData.map((rowdata, index) => (
                  <Row
                    key={index}
                    data={rowdata}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 2 === 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                <Row
                  data={state.datatotal}
                  widthArr={widthArr}
                  style={styles.row}
                  textStyle={styles.text}
                />
              </Table>

              <View style={{flex: 1, alignItems: 'flex-start', marginTop: 5}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Lifting Fee Totals:{' '}
                </Text>
              </View>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead1}
                  widthArr={widthArr1}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={state.liftingdata}
                  widthArr={widthArr}
                  style={styles.row}
                  textStyle={styles.text}
                />
              </Table>

              <View style={{flex: 1, alignItems: 'flex-start', marginTop: 5}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                  Shift Deductions Totals:{' '}
                </Text>
              </View>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead2}
                  widthArr={widthArr2}
                  style={styles.header}
                  textStyle={styles.text}
                />
              </Table>
              <Table borderStyle={{borderWidth: 0, borderColor: '#C1C0B9'}}>
                <Row
                  data={state.Deductdata}
                  widthArr={widthArr}
                  style={styles.row}
                  textStyle={styles.text}
                />
              </Table>
            </View>
          </ScrollView>
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
        <TouchableOpacity onPress={() => navigation.navigate('View Records')}>
          <Icon name="eye-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            starRating(state, dispatch);
          }}>
          <Icon name="print-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
