/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {Text, View, ScrollView, Alert, SafeAreaView} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import Mybutton from '../../Components/Mybutton';
import {startRating} from './Print';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './DisplayReport.style';
import {ViewRecordsByDate} from '../ViewRecords/Actions';
import {StateContext} from '../../../Utilities/Context';
import {FormValues} from '../../Components/EnterDataValues';
import {insertIntoTotalTable} from './Actions';

export default function DisplayReport(_props) {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  const [nametable, setNameTable] = useState<FormValues[]>([]);
  const [table, setTable] = useState<FormValues[]>([]);
  const [total, setTotal] = useState<FormValues[]>([]);
  const [liftingtable, setLiftingtable] = useState<FormValues[]>([]);
  const [deducttable, setDeducttable] = useState<FormValues[]>([]);
  const [done, setDone] = useState(false);
  const [usingservice, setUsingservice] = useState(false);

  const tableHead = [
    'Date',
    'Day',
    'Shift',
    'Taxi',
    'Jobs_Done',
    'Hours_Worked',
    'Meter_Start',
    'Meter_Finish',
    'Km_Start',
    'Km_Finish',
    'Paidkm_Start',
    'Paidkm_Finish',
    'Eftpos',
    'M3_Dockets',
    'Electronic_Account_Payments',
    'Total_Manual_MPTP31_And_MPTP_Values',
    'Number_Of_Manual_Liftings',
    'Eftpos_Lifting_Value',
    'Car_Wash',
    'Misc',
    'Fuel',
    'Insurance',
  ];
  const widthArr = [
    80, 80, 60, 70, 50, 60, 80, 60, 60, 80, 80, 100, 80, 80, 80, 80, 60, 60, 80,
    50,
  ];

  const tableHead1 = [
    'Total Lifting Fee Value',
    'Total No. of Wheelchairs Lifts;',
    'Total No. of Manual MPTP Lifts:',
    'Total Manual Lifting Fee Value:',
    'Total Eftpos Lifting Fee Value:',
    'Total Company Portion of Lifting Fee:',
    'Total Driver Portion of Lifting Fee:',
  ];
  const widthArr1 = [150, 150, 150, 150, 150, 150, 150];

  const tableHead2 = [
    'Eftpos',
    'Gov-Sub Manual',
    'Gov-Sub Manual31',
    'Dockets',
    'Charge Authority',
    'Misc',
    'Deductions',
    'Pay Ins-Cash',
  ];
  const widthArr2 = [140, 140, 140, 140, 140, 140, 140, 140];

  let Report = async () => {
    if (!state.start_date || !state.finish_date) {
      Alert.alert('Please select Date !');
    } else {
      const results = await ViewRecordsByDate(
        state.start_date,
        state.finish_date,
      );
      setTable(results);
      setNameTable(results);
      Total();
    }
  };

  const tableData = table.map(record => [
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

  const tableNameData = nametable.map(record => [
    record.Name,
    record.Week_Ending_Date,
    new Date().toDateString(),
  ]);

  let Total = async () => {
    const res = await insertIntoTotalTable();
    console.log('results in display report===', res);
    //dispatch({type: 'UPDATE', payload: result});
    setTotal(res);
    setLiftingtable(res);
    setDeducttable(res);
  };

  const datatotal = total.map(total => [
    'Total',
    '',
    '',
    '',
    total.Jobs_Done,
    total.Insurance,
    total.Shift_Total,
    total.Company_Comm_Rate,
    total.Kms,
    total.Paid_Kms,
    total.Eftpos,
    total.Eftpos,
    total.M3_Dockets,
    total.Electronic_Account_Payments,
    total.Total_Manual_MPTP31_And_MPTP_Values,
    total.Number_Of_Manual_Liftings,
    total.Misc,
    total.Fuel,
    total.Net_Payin,
    total.CPK,
  ]);

  const liftingdata = liftingtable.map(total => [
    total.Total_Lifting_Value,
    total.Number_Of_Chairs,
    total.Number_Of_Manual_Liftings,
    // total.manual_lifting_fee_value,
    total.Total_Manual_MPTP31_And_MPTP_Values,
    total.Eftpos,
    total.Driver_Share_In_LiftingFee,
    total.Driver_Share_In_LiftingFee,
  ]);

  const Deductdata = deducttable.map(total => [
    total.Eftpos,
    total.Total_Manual_MPTP31_And_MPTP_Values,
    total.Total_Manual_MPTP31_And_MPTP_Values,
    total.M3_Dockets,
    total.Electronic_Account_Payments,
    total.Misc,
    total.Deductions,
    total.Net_Payin,
  ]);

  const Rating = () => {
    startRating();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#35363A'}}>
      <AwesomeAlert show={done} title="Done it!" message="Thank you." />
      <AwesomeAlert
        show={usingservice}
        title="Thank you for using our service."
      />

      <ScrollView verical={true}>
        <Mybutton title="Display Data" customClick={Report} />

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
                {tableData.map((rowdata, index) => (
                  <Row
                    key={index}
                    data={rowdata}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {datatotal.map((rowdata, index) => (
                  <Row
                    key={index}
                    data={rowdata}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
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
                {liftingdata.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr1}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
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
                {Deductdata.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr2}
                    style={[
                      styles.row,
                      index % 0 && {backgroundColor: 'white'},
                    ]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      <View
        style={{
          marginLeft: 60,
          marginRight: 60,
          marginBottom: 10,
          marginTop: -12,
        }}>
        <Mybutton title="Print Report" customClick={Rating} />
      </View>
    </SafeAreaView>
  );
}
