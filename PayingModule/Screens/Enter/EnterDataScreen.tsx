/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext, useCallback, useState} from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RegoModal} from '../Components/RegoModal';
import {LiftingModel} from '../Components/LiftingModel';
import {Picker} from '@react-native-picker/picker';
import {Calculator} from '../Components/Calculator';
import {Calendar} from '../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from '../screens.style';
import {
  selectWeekEndingTable,
  selectLiftingTable,
  SelectCab,
  SelectFromDataTable,
  upsertData,
} from '../../Utilities/Actions';
import {StateContext} from '../../Utilities/Context';
import {
  useInputRefs,
  inputs,
  liftingInputs,
  payinInputs,
} from '../Components/EnterDataValues';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App/App';
import {useNavigation} from '@react-navigation/core';
import ModalForm from '../Components/ModalForm';
import Icon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';
import moment from 'moment';

const EnterData = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'Enter Data'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  const inputRefs = useInputRefs();
  const [Cnetpayin, setCnetpayin] = useState(0);
  const [Dnetpayin, setDnetpayin] = useState(0);
  const [Cdeductions, setCdeductions] = useState(0);
  const [Ddeductions, setDdeductions] = useState(0);

  // interface Cab {
  //   Cab: string;
  //   id: number;
  // }
  // type Cab_Data = {
  //   [key: string]: Cab;
  // };

  useEffect(() => {
    try {
      selectWeekEndingTable(dispatch);
      selectLiftingTable(dispatch);
      SelectCab(dispatch);
      SelectFromDataTable(dispatch);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }, [dispatch]);

  const calculateAndUpdateValues = useCallback(() => {
    //const calculateAndUpdateValues = () => {
    //let updatedValues = {...state};
    state.Levy = +state.Jobs_Done * +state.Gov_Levy;
    // console.log(
    //   'state.Jobs_Done==',
    //   state.Eftpos_Liftings,
    //   state.Number_Of_Manual_Liftings,
    // );
    state.Shift_Total = +state.meterTotal - state.Levy;

    state.Kms;

    state.Paid_Kms;

    state.Number_Of_Chairs =
      Number(state.Eftpos_Liftings) + Number(state.Number_Of_Manual_Liftings);

    state.Driver_Lifting_Value =
      state.Number_Of_Chairs * +state.Driver_Share_In_LiftingFee;

    state.Commission_Driver =
      (state.Shift_Total * +state.Driver_Comm_Rate) / 100;

    state.Company_Comm_Rate = 100 - +state.Driver_Comm_Rate;

    state.Commission_Company =
      (state.Shift_Total * state.Company_Comm_Rate) / 100;

    state.CPK = +state.Kms > 0 ? state.Shift_Total / +state.Kms : 0;

    state.Unpaid_Kms = +state.Kms - +state.Paid_Kms;

    //from save function
    let eftpos_without_lifting =
      +state.Eftpos - state.Number_Of_Chairs * +state.Gov_Lifting_Fee;

    let cdeductions =
      (Number(state.Driver_Lifting_Value) || 0) +
      (Number(state.M3_Dockets) || 0) +
      (Number(state.Electronic_Account_Payments) || 0) +
      (Number(state.Total_Manual_MPTP31_And_MPTP_Values) || 0) +
      (Number(eftpos_without_lifting) || 0);

    setCdeductions(cdeductions);
    let ddeductions =
      cdeductions +
      (Number(state.Misc) || 0) +
      (Number(state.Car_Wash) || 0) +
      (Number(state.Fuel) || 0);

    setDdeductions(ddeductions);
    let cnetpayin = state.Commission_Company - cdeductions;
    setCnetpayin(cnetpayin);
    let dnetpayin = state.Commission_Company - ddeductions;
    setDnetpayin(dnetpayin);

    // dispatch({type: 'INSERT', payload: {state, table: 'datatable'}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    state.Hours_Worked,
    state.Insurance,
    state.Jobs_Done,
    state.meterTotal,
    state.Kms,
    state.Paid_Kms,
    state.Eftpos,
    state.Eftpos_Liftings,
    state.Number_Of_Manual_Liftings,
    state.Total_Manual_MPTP31_And_MPTP_Values,
    state.M3_Dockets,
    state.Electronic_Account_Payments,
    state.Misc,
    state.Car_Wash,
    state.Fuel,
    state.Cab_Data,
    state.Taxi,
    state.Deductions,
    state.Net_Payin,
    Cnetpayin,
    Dnetpayin,
    Cdeductions,
    Ddeductions,
  ]);

  useEffect(() => {
    calculateAndUpdateValues();
  }, [calculateAndUpdateValues]);

  const onChange = (name: string, value: string) => {
    // console.log('onchange==', name, value);
    dispatch({type: 'INSERT', payload: {[name]: value, table: 'datatable'}});
  };

  const SubmitEditing = (name: string, value: string) => {
    if (!isNaN(Number(value))) {
      dispatch({
        type: 'INSERT',
        payload: {[name]: Number(value), table: 'datatable'},
      });
      calculateAndUpdateValues();
    } else {
      Alert.alert('Please input a correct number');
      dispatch({type: 'INSERT', payload: {[name]: '', table: 'datatable'}});
    }
  };

  let Save = () => {
    console.log('in save==', Cdeductions, Ddeductions, Cnetpayin, Dnetpayin);
    if (+state.Car_Wash > 0 || +state.Misc > 0 || +state.Fuel > 0) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's ?",
            onPress: () => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Deductions: isNaN(Ddeductions) ? 0 : Ddeductions,
                  Net_Payin: isNaN(Dnetpayin) ? 0 : Dnetpayin,
                  table: 'datatable',
                },
              });
              alertConfirm();
            },
          },
          {
            text: "Company's ?",
            onPress: () => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Deductions: isNaN(Cdeductions) ? 0 : Cdeductions,
                  Net_Payin: isNaN(Cnetpayin) ? 0 : Cnetpayin,
                  table: 'datatable',
                },
              });
              alertConfirm();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      alertConfirm();
    }
  };

  const alertConfirm = () => {
    Alert.alert(
      'Please confirm!',
      'Wish to Save?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              let res: any = await upsertData(state, dispatch);
              console.log('upsert function===', res.Net_Payin);
            } catch (error) {
              console.log(error);
            }
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

  const Refresh = async () => {
    dispatch({type: 'REFRESH', payload: null});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalForm />
      <AwesomeAlert
        show={
          state.Indicator !== undefined ? Boolean(state.Indicator) : undefined
        }
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={false}
      />

      <Calculator />

      <LiftingModel />

      <RegoModal />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.titleText, {color: 'green', marginVertical: 5}]}>
            Total Entries: {state.Number_Of_Entries}
          </Text>
        </View>
        {liftingInputs.map(input => (
          <View key={input.name} style={styles.textinputview}>
            <Text style={[styles.titleText, {color: '#55a8fa'}]}>
              {input.title}
            </Text>
            <Text style={[styles.titleText, {color: '#55a8fa'}]}>
              {Number(state[input.name]).toFixed(2)}
            </Text>
            {/* <TextInput
              placeholder="0.00"
              placeholderTextColor="#55a8fa"
              style={[styles.textInput, {color: '#55a8fa'}]}
              returnKeyType="next"
              keyboardType="numeric"
              value={state[input.name] === 0 ? '' : String(state[input.name])}
            /> */}
          </View>
        ))}
        <TouchableOpacity
          //style={styles.button}
          onPress={() =>
            dispatch({
              type: 'UPDATE',
              payload: {
                Lifting_Modal_Visible: !state.Lifting_Modal_Visible,
                table: 'datatable',
              },
            })
          }>
          <Text style={styles.buttontext}>Update above fields</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
            alignItems: 'center',
            borderBottomWidth: 0.5,
            justifyContent: 'space-between',
          }}>
          <Text style={[styles.titleText, {color: '#fff'}]}>Shift</Text>
          <TextInput
            placeholder="........."
            placeholderTextColor="#ffffff"
            editable={false}
            style={styles.textInput}>
            <Text style={[styles.titleText, {color: '#fff'}]}>
              {state.Shift}
            </Text>
          </TextInput>
          <Picker
            selectedValue={
              state.Shift !== undefined ? String(state.Shift) : undefined
            }
            style={{
              width: 100,
            }}
            onValueChange={(Shift: string) => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Shift,
                  table: 'datatable',
                },
              });
            }}>
            <Picker.Item
              label="Select"
              value="Select"
              color={Platform.OS === 'ios' ? '#fff' : '#bbb'}
            />
            <Picker.Item
              label="Day"
              value="Day"
              color={Platform.OS === 'ios' ? '#fff' : '#000'}
            />
            <Picker.Item
              label="Night"
              value="Night"
              color={Platform.OS === 'ios' ? '#fff' : '#000'}
            />
            <Picker.Item
              label="Evening"
              value="Evening"
              color={Platform.OS === 'ios' ? '#fff' : '#000'}
            />
          </Picker>
        </View>

        <View style={{borderBottomWidth: 0.5}}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.titleText, {color: '#fff'}]}>Rego</Text>
            <TextInput
              placeholder="............"
              placeholderTextColor="#ffffff"
              editable={false}
              style={styles.textInput}>
              <Text style={[styles.titleText, {color: '#fff'}]}>
                {state.Taxi}
              </Text>
            </TextInput>
            <Picker
              selectedValue={state.Taxi}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={Taxi => {
                dispatch({
                  type: 'INSERT',
                  payload: {
                    Taxi,
                    Rego_Modal: false,
                    table: 'cab',
                  },
                });
              }}>
              <Picker.Item
                label="Select"
                // key=" "
                value="Select "
                color={Platform.OS === 'ios' ? '#fff' : '#bbb'}
              />
              {state.Cab_Data &&
                state.Cab_Data.map((c, key) => (
                  <Picker.Item
                    label={c.Cab}
                    key={key}
                    value={c.Cab}
                    color={Platform.OS === 'ios' ? '#fff' : '#999'}
                  />
                ))}
            </Picker>
          </View>
          <TouchableOpacity
            // style={styles.button}
            onPress={() => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Rego_Modal: !state.Rego_Modal,
                  table: 'cab',
                },
              });
            }}>
            <Text style={styles.buttontext}>Registration Number</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={String(state.Date)}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'INSERT',
                payload: {
                  Date: date,
                  Day: day,
                  table: 'datatable',
                },
              });
            }}
          />
          <Text style={styles.Textinput}>
            {state.Date
              ? state.Day + ' ' + state.Date
              : moment(new Date()).format('dddd, YYYY/MM/DD')}
          </Text>
        </View>

        <View style={{borderBottomWidth: 0.5}}>
          {inputs.map((input, index) => (
            <View key={input.name} style={styles.textinputview}>
              <Text style={[styles.titleText, {color: '#fff'}]}>
                {input.title}
              </Text>
              <TextInput
                placeholder={input.placeholder}
                placeholderTextColor="#fff"
                style={[styles.textInput, {color: '#fff'}]}
                returnKeyType="next"
                // keyboardType="numeric"
                onChangeText={(value: string) => onChange(input.name, value)}
                value={
                  state[input.name] !== 0 && state[input.name] !== undefined
                    ? String(state[input.name])
                    : ''
                }
                ref={inputRefs[input.name]}
                onSubmitEditing={() => {
                  if (input.name) {
                    SubmitEditing(input.name, String(state[input.name]));
                    if (index < inputs.length - 1) {
                      // Check if it's not the last input
                      const nextInputRef = inputRefs[inputs[index + 1].name];
                      nextInputRef.current?.focus();
                    }
                  }
                }}
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Calculator_Modal_Visible: !state.Calculator_Modal_Visible,
                  table: 'datatable',
                },
              });
            }}>
            <Icon name="calculator-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 20}}>
          <Text
            style={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'center',
            }}>
            Payin Details
          </Text>
          {payinInputs.map(input => (
            <View key={input.name} style={styles.textinputview}>
              <Text style={[styles.titleText, {color: '#55a8fa'}]}>
                {input.title}
              </Text>
              <Text style={[styles.titleText, {color: '#55a8fa'}]}>
                {Number(state[input.name]).toFixed(2)}
              </Text>
              {/* <TextInput
                placeholder={input.placeholder}
                placeholderTextColor="#55a8fa"
                style={[styles.textInput, {color: '#55a8fa'}]}
                returnKeyType="next"
                keyboardType="numeric"
                value={
                  state[input.name] === 0
                    ? ''
                    : input.name === 'Number_Of_Chairs'
                    ? Number(state[input.name]).toFixed(0)
                    : Number(state[input.name]).toFixed(2)
                  // state[input.name] === 0
                  //   ? ''
                  //   : Number(state[input.name]).toFixed(2)
                }
              /> */}
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <TouchableOpacity
          // style={styles.button}
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
          // style={styles.button}
          onPress={Save}>
          <Icon name="save-outline" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          // style={styles.button}
          onPress={Refresh}>
          <Icon name="refresh" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterData;
