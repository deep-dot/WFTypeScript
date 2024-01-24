/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext} from 'react';
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
  Select,
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

  let Save = () => {
    let eftpos_without_lifting =
      state.Eftpos - state.Number_Of_Chairs * state.Gov_Lifting_Fee;
    let Cdeductions =
      state.Driver_Lifting_Value +
      state.M3_Dockets +
      state.Electronic_Account_Payments +
      state.Total_Manual_MPTP31_And_MPTP_Values +
      eftpos_without_lifting;
    let Ddeductions = Cdeductions + state.Misc + state.Car_Wash + state.Fuel;

    let Cnetpayin = state.Commission_Company - Cdeductions;
    let Dnetpayin = state.Commission_Company - Ddeductions;
    if (state.Car_Wash > 0 || state.Misc > 0 || state.Fuel > 0) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's ?",
            onPress: () => {
              handleDeduction(Ddeductions, Dnetpayin);
            },
          },
          {
            text: "Company's ?",
            onPress: () => {
              handleDeduction(Cdeductions, Cnetpayin);
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
      handleDeduction(Cdeductions, Cnetpayin);
    }
  };

  const handleDeduction = (deductions: number, netpayin: number) => {
    dispatch({
      type: 'UPDATE',
      payload: {
        Deductions: deductions,
        Net_Payin: netpayin,
      },
    });
    alertConfirm('Wish to Save?', async () => {
      try {
        await upsertData(state, dispatch);
      } catch (error) {
        console.log(error);
      }
    });
  };

  const alertConfirm = (title: string, onPressYes: () => void) => {
    Alert.alert(
      'Please confirm!',
      title,
      [
        {
          text: 'Yes',
          onPress: onPressYes,
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

  useEffect(() => {
    try {
      selectWeekEndingTable(dispatch);
      selectLiftingTable(dispatch);
      SelectCab(dispatch);
      Select(dispatch);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }, [dispatch, state.Number_Of_Entries]);

  const onChange = (name: string, value: string) => {
    //console.log('onchange in enter data ==', name, 'and', value);
    dispatch({type: 'UPDATE', payload: {[name]: value}});
  };

  const SubmitEditing = (text: string, value: string) => {
    if (!isNaN(Number(value))) {
      let updatedValues = {...state, [text]: Number(value)};

      updatedValues.Levy = updatedValues.Jobs_Done * updatedValues.Gov_Levy;

      updatedValues.Shift_Total = updatedValues.meterTotal - updatedValues.Levy;

      updatedValues.Kms;

      updatedValues.Paid_Kms;

      updatedValues.Number_Of_Chairs =
        updatedValues.Eftpos_Liftings + updatedValues.Number_Of_Manual_Liftings;

      updatedValues.Driver_Lifting_Value =
        updatedValues.Number_Of_Chairs *
        updatedValues.Driver_Share_In_LiftingFee;

      updatedValues.Commission_Driver =
        (updatedValues.Shift_Total * updatedValues.Driver_Comm_Rate) / 100;

      updatedValues.Company_Comm_Rate = 100 - updatedValues.Driver_Comm_Rate;

      updatedValues.Commission_Company =
        (updatedValues.Shift_Total * updatedValues.Company_Comm_Rate) / 100;

      updatedValues.CPK =
        updatedValues.Kms > 0
          ? updatedValues.Shift_Total / updatedValues.Kms
          : 0;

      updatedValues.Unpaid_Kms = updatedValues.Kms - updatedValues.Paid_Kms;

      dispatch({type: 'UPDATE', payload: updatedValues});
    } else {
      Alert.alert('Please input a correct number');
      let updatedValues = {...state, [text]: ''};
      dispatch({type: 'UPDATE', payload: updatedValues});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalForm />
      <AwesomeAlert
        show={state.Indicator}
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
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#55a8fa"
              style={[styles.textInput, {color: '#55a8fa'}]}
              returnKeyType="next"
              keyboardType="numeric"
              value={state[input.name] === 0 ? '' : String(state[input.name])}
            />
          </View>
        ))}
        <TouchableOpacity
          //style={styles.button}
          onPress={() =>
            dispatch({
              type: 'UPDATE',
              payload: {
                Lifting_Modal_Visible: !state.Lifting_Modal_Visible,
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
            selectedValue={state.Shift}
            style={{
              width: 100,
            }}
            onValueChange={(Shift: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Shift,
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
              style={{width: 120}}
              onValueChange={Taxi => {
                dispatch({
                  type: 'UPDATE',
                  payload: {
                    Taxi,
                  },
                });
              }}>
              <Picker.Item
                label="Select"
                key=" "
                value="Select "
                color={Platform.OS === 'ios' ? '#fff' : '#bbb'}
              />
              {state.Cab_Data.map((c: {Cab: string}, key: number) => (
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
                type: 'UPDATE',
                payload: {
                  Rego_Modal: !state.Rego_Modal,
                },
              });
            }}>
            <Text style={styles.buttontext}>Registration Number</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={state.Date}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Date: date,
                  Day: day,
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
                value={state[input.name] === 0 ? '' : String(state[input.name])}
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
              <TextInput
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
              />
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
