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
import styles from '../screens.style';
import {ViewRecordsByDate} from '../../../Utilities/Actions';
import {StateContext} from '../../../Utilities/Context';
import {totalTable} from '../../../Utilities/Actions';
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
    '',
    record.Date,
    record.Day,
    record.Shift,
    record.Taxi,
    record.Jobs_Done,
    record.Insurance,
    record.Hours_Worked,
    // record.Meter_Start,
    // record.Meter_Finish,
    record.Shift_Total,
    // record.Km_Start,
    // record.Km_Finish,
    record.Kms,
    // record.Paidkm_Start,
    // record.Paidkm_Finish,
    record.Paid_Kms,
    record.Eftpos,
    record.Number_Of_Manual_Liftings,
    record.Total_Manual_MPTP31_And_MPTP_Values,
    record.M3_Dockets,
    record.Electronic_Account_Payments,
    record.Car_Wash,
    record.Misc,
    record.Fuel,
    record.CPK,
    record.Net_Payin,
  ]);

  state.datatotal = [
    'Total',
    '',
    '',
    '',
    '',
    state.total.Jobs_Done,
    state.total.Insurance,
    state.total.Hours_Worked,
    // '',
    // '',
    state.total.Shift_Total,
    // '',
    // '',
    state.total.Kms,
    // '',
    // '',
    state.total.Paid_Kms,
    state.total.Eftpos,
    state.total.Number_Of_Manual_Liftings,
    state.total.Total_Manual_MPTP31_And_MPTP_Values,
    state.total.M3_Dockets,
    state.total.Electronic_Account_Payments,
    state.total.Car_Wash,
    state.total.Misc,
    state.total.Fuel,
    'avg = ' + state.total.CPK,
    state.total.Net_Payin,
  ];
  //console.log(state.datatotal);
  state.liftingdata = [
    Number(state.total.Number_Of_Chairs) * state.Gov_Lifting_Fee,
    Number(state.total.Number_Of_Chairs),
    Number(state.total.Number_Of_Chairs) * state.Driver_Share_In_LiftingFee,
  ];

  state.Deductdata = [state.total.Jobs_Done, state.total.Net_Payin];

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
                  Lifting Fee Total:{' '}
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
