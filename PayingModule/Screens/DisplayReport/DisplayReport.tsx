/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from '../screens.style';
import {StateContext} from '../../Utilities/Context';
import {totalTable} from '../../Utilities/Actions';
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
import {StackParamList} from '../../../App/App';
import {useNavigation} from '@react-navigation/core';
import {LogBox} from 'react-native';
import {tableItems} from '../Components/EnterDataValues';
LogBox.ignoreLogs([
  'Warning: Failed prop type: Invalid prop `style` of type `array` supplied to `Row`, expected `object`',
]);

type TotalType = {
  [key: string]: any; // or replace `any` with a more specific type if possible
};
export default function DisplayReport() {
  const navigation =
    useNavigation<NavigationProp<StackParamList, 'Display Report'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch, starRating, state} = stateContext;
  const [total, setTotal] = useState<TotalType>({});

  let Report = useCallback(async () => {
    let res = await totalTable();
    setTotal(res);
  }, []);

  // console.log('total:', total);
  // console.log('tableData:', state.tableData);

  useEffect(() => {
    Report();
  }, [Report]);

  state.liftingdata = useMemo(
    () => [
      Number(total.Number_Of_Chairs) * state.Gov_Lifting_Fee,
      Number(total.Number_Of_Chairs),
      Number(total.Number_Of_Chairs) * state.Driver_Share_In_LiftingFee,
    ],
    [
      total.Number_Of_Chairs,
      state.Gov_Lifting_Fee,
      state.Driver_Share_In_LiftingFee,
    ],
  );

  state.deductdata = useMemo(
    () => [
      total.Deductions, // Assuming `deductions` is part of `tableItems`
      total.Net_Payin, // Assuming `netPayin` is part of `tableItems`
    ],
    [total.Net_Payin, total.Deductions],
  );

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
                {state.tabledata &&
                  state.tabledata.map((rowdata, index) => {
                    let keysToInclude = [
                      'Date',
                      'Day',
                      'Shift',
                      'Taxi',
                      'Jobs_Done',
                      'Insurance',
                      'Hours_Worked',
                      'Shift_Total',
                      'Kms',
                      'Paid_Kms',
                      'Eftpos',
                      'Eftpos_Liftings',
                      'Number_Of_Manual_Liftings',
                      'Total_Manual_MPTP31_And_MPTP_Values',
                      'M3_Dockets',
                      'Electronic_Account_Payments',
                      'Car_Wash',
                      'Misc',
                      'Fuel',
                      'CPK',
                      'Net_Payin',
                    ];
                    let dataObj: {[key: string]: any} = {};
                    //allowing the dynamic access without changing the global definition of tableItems
                    keysToInclude.forEach(key => {
                      dataObj[key] = rowdata[key as keyof tableItems];
                    });
                    let data = Object.values(dataObj);
                    return (
                      <Row
                        key={index}
                        index={index}
                        data={['', ...data]}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          index % 2 === 0 && {backgroundColor: 'white'},
                        ]}
                        textStyle={styles.text}
                      />
                    );
                  })}
              </Table>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {(() => {
                  let keysToInclude = [
                    'Jobs_Done',
                    'Insurance',
                    'Hours_Worked',
                    'Shift_Total',
                    'Kms',
                    'Paid_Kms',
                    'Eftpos',
                    'Eftpos_Liftings',
                    'Number_Of_Manual_Liftings',
                    'Total_Manual_MPTP31_And_MPTP_Values',
                    'M3_Dockets',
                    'Electronic_Account_Payments',
                    'Car_Wash',
                    'Misc',
                    'Fuel',
                    'CPK',
                    'Net_Payin',
                  ];

                  let dataObj: {[key: string]: any} = {};

                  keysToInclude.forEach(key => {
                    dataObj[key] = total[key];
                  });

                  let data = Object.values(dataObj);

                  return (
                    <Row
                      data={['Total', '', '', '', '', ...data]}
                      widthArr={widthArr}
                      style={styles.row}
                      textStyle={styles.text}
                    />
                  );
                })()}
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
                  data={state.deductdata}
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
        <TouchableOpacity
          onPress={() => {
            dispatch({
              type: 'UPDATE',
              payload: {
                start_date: '',
                finish_date: '',
                totalrecords: 0,
              },
            });
            navigation.navigate('View Records');
          }}>
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
