/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext, RefObject} from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RegoModal} from './component/RegoModal';
import Model from './component/Model';
// import MyButton from '../../Components/Mybutton';
import {Picker} from '@react-native-picker/picker';
import Calculator from './component/Calculator';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './EnterDataScreen.style';
import {
  insertIntoCab,
  deleteIntoCab,
  SelectFromCab,
  SelectCountFromDataTable,
  InsertData,
  UpdateDataInTable,
} from '../../Components/dbUtility';
import {StateContext} from '../../../Utilities/Context';
import {
  DdeductionsProperties,
  DdeductionsAdditionalProperties,
  useInputRefs,
  useLiftingRefs,
  usePayinRefs,
  inputs,
  liftingInputs,
  payinInputs,
} from '../../Components/EnterDataValues';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import Database from '../../Database/Database';
import {useNavigation} from '@react-navigation/core';
interface Cab {
  Cab: string;
}
const EnterData = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'Enter Data'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  const inputRefs: {[key: string]: React.RefObject<TextInput>} = useInputRefs();
  const liftingRefs: {[key: string]: React.RefObject<TextInput>} =
    useLiftingRefs();
  const payinRefs: {[key: string]: React.RefObject<TextInput>} = usePayinRefs();

  let Save = () => {
    let Cdeductions = DdeductionsProperties.reduce(
      (acc, curr) => acc + Number(state[curr]),
      0,
    );
    let Ddeductions = [
      ...DdeductionsProperties,
      ...DdeductionsAdditionalProperties,
    ].reduce((acc, curr) => acc + Number(state[curr]), 0);

    let Cnetpayin = Number(state.Commission_Driver) - Cdeductions;
    let Dnetpayin = Number(state.Commission_Driver) - Ddeductions;
    if (
      DdeductionsAdditionalProperties.some(
        property => Number(state[property]) > 0,
      )
    ) {
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
    let result = {
      Deductions: deductions.toFixed(2),
      Net_Paying: netpayin.toFixed(2),
    };
    dispatch({type: 'UPDATE', payload: result});
    alertConfirm('Wish to Save?', () => executeSqlQuery());
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

  const alertForSaveRecord = () => {
    Alert.alert(
      'Record Saved Successfully!',
      'Do you want to add another record?',
      [
        {
          text: 'Yes',
          onPress: () => {
            Refresh();
          },
        },
        {
          text: 'No',
          onPress: () => {
            navigation.navigate('Home');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const executeSqlQuery = async () => {
    if (state.Search_Date !== undefined && state.Search_Date !== '') {
      let res = await UpdateDataInTable(state, dispatch);
      if (res) {
        dispatch({
          type: 'UPDATE',
          payload: {
            Search_Date: '',
          },
        });
      }
    } else {
      let res = await InsertData(state);
      // console.log('res in insertData function in EnterData screen==', res);
      if (res === 'Inserted') {
        alertForSaveRecord();
      }
    }
  };

  const Refresh = () => {
    dispatch({type: 'REFRESH', payload: null});
  };

  useEffect(() => {
    SelectFromCab(state, dispatch);
    SelectCountFromDataTable(dispatch);
  });

  //calculator...
  let Authoritycalculator = (num: Number) => {
    // console.log('charge auth num===', num);
    dispatch({
      type: 'UPDATE',
      payload: {
        Electronic_Account_Payments: num.toFixed(2),
        Calculator_Modal_Visible: !state.Calculator_Modal_Visible,
      },
    });
  };
  let CCcalculator = (num: Number) => {
    dispatch({
      type: 'UPDATE',
      payload: {
        M3_Dockets: num.toFixed(2),
        Calculator_Modal_Visible: !state.Calculator_Modal_Visible,
      },
    });
  };
  let Cancelcalculator = () => {
    dispatch({
      type: 'UPDATE',
      payload: {
        Calculator_Modal_Visible: !state.Calculator_Modal_Visible,
      },
    });
  };

  const handleCabChange = async (action: Function) => {
    if (!state.Rego) {
      Alert.alert('Please put rego in.');
      return;
    }
    try {
      await action(state.Rego.toString());
      await SelectFromCab(state, dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  let pushcab = async () => {
    handleCabChange(insertIntoCab);
  };

  const deletecab = async () => {
    handleCabChange(deleteIntoCab);
  };

  const hideModal = () => {
    dispatch({
      type: 'UPDATE',
      payload: {Lifting_Modal_Visible: !state.Lifting_Modal_Visible},
    });
  };

  const onChange = (name: string, value: string | boolean) => {
    //console.log('onchange in enter data ==', name, 'and', value);
    dispatch({type: 'UPDATE', payload: {[name]: value}});
  };

  const updateStateContext = () => {
    dispatch({type: 'UPDATE', payload: state});
    navigation.navigate('Enter Data');
  };

  const SubmitEditing = (
    name: string,
    value: string,
    nextInputRef: React.RefObject<TextInput>,
  ) => {
    if (!isNaN(Number(value))) {
      let updatedValues = {...state, [name]: value};
      console.log(`name ${name} and value ${value}`);
      if (name === 'Jobs_Done') {
        const val1 = Number(updatedValues.Jobs_Done || 0);
        const val2 = Number(updatedValues.Gov_Levy || 0);
        updatedValues.Levy = (val1 * val2).toFixed(2);
      }
      if (name === 'Meter_Finish') {
        const val1 = Number(updatedValues.Meter_Start || 0);
        const val2 = Number(updatedValues.Meter_Finish || 0);
        const val3 = Number(updatedValues.Levy || 0);
        const val4 = Number(updatedValues.Driver_Comm_Rate || 0);
        const val6 = Number(updatedValues.Hours_Worked || 0);
        const val7 = Number(updatedValues.Driver_Lifting_Value || 0);
        updatedValues.Shift_Total = (val2 - val1 - val3).toFixed(2);
        updatedValues.Commission_Driver = (
          Number(updatedValues.Shift_Total) *
          (val4 / 100)
        ).toFixed(2);
        updatedValues.Average_Fare = (
          Number(updatedValues.Shift_Total) / val6
        ).toFixed(2);
        updatedValues.Net_Driver_Income = (
          val7 + Number(updatedValues.Commission_Driver)
        ).toFixed(2);
      }
      if (name === 'Km_Finish') {
        const val1 = Number(updatedValues.Km_Start || 0);
        const val2 = Number(updatedValues.Km_Finish || 0);
        updatedValues.Kms = (val2 - val1).toFixed(2);
        updatedValues.CPK = (
          Number(updatedValues.Shift_Total) / Number(updatedValues.Kms)
        ).toFixed(2);
      }
      if (name === 'Paidkm_Finish') {
        const val1 = Number(updatedValues.Paidkm_Start || 0);
        const val2 = Number(updatedValues.Paidkm_Finish || 0);
        updatedValues.Paid_Kms = (val2 - val1).toFixed(2);
        updatedValues.Unpaid_Kms = (
          Number(updatedValues.Kms) - Number(updatedValues.Paid_Kms)
        ).toFixed(2);
      }
      if (name === 'Number_Of_Manual_Liftings') {
        const val1 = Number(updatedValues.Number_Of_Manual_Liftings || 0);
        const val2 = Number(updatedValues.Total_Lifting_Value || 0);
        updatedValues.Manual_Lifting_Value = (val2 * val1).toFixed(2);
      }
      if (name === 'Eftpos_Lifting_Value') {
        const val1 = Number(updatedValues.Number_Of_Manual_Liftings || 0);
        const val2 = Number(updatedValues.Total_Lifting_Value || 0);
        const val3 = Number(updatedValues.Eftpos_Lifting_Value || 0);
        const val5 = Number(updatedValues.Driver_Lifting_Value || 0);
        updatedValues.Total_Lifting_Value = (val2 * val1 + val3).toFixed(2);
        updatedValues.Number_Of_Manual_Liftings = (val1 + val3 / val2).toFixed(
          2,
        );
        updatedValues.Driver_Lifting_Value = (
          Number(updatedValues.Number_Of_Manual_Liftings) * val5
        ).toFixed(2);
      }
      dispatch({type: 'UPDATE', payload: updatedValues});
      nextInputRef.current?.focus();
    } else {
      Alert.alert('Please input a correct number');
      let updatedValues = {...state, [name]: ''};
      dispatch({type: 'UPDATE', payload: updatedValues});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Database />

      <AwesomeAlert
        show={state.Indicator}
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={false}
      />

      <Calculator
        calculatorVisible={state.Calculator_Modal_Visible}
        Cancelcalcu={Cancelcalculator}
        Docketcalcu={CCcalculator}
        CAcalcu={Authoritycalculator}
      />

      <Model
        modvisible={state.Lifting_Modal_Visible}
        onCancel={hideModal}
        onupdate={hideModal}
      />

      <RegoModal
        visible={state.Rego_Modal}
        state={state}
        //setstate={setstate}
        dispatch={dispatch}
        pushcab={pushcab}
        deletecab={deletecab}
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        {liftingInputs.map((input, index) => (
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
              // onChangeText={(value: string) => onChange(input.name, value)}
              value={state[input.name]}
              ref={(ref: RefObject<TextInput>) => {
                if (ref) {
                  liftingRefs[input.name] = ref;
                }
              }}
              onSubmitEditing={
                input.name
                  ? () =>
                      SubmitEditing(
                        input.name,
                        state[input.name].toString(),
                        liftingRefs[inputs[index + 1]?.name],
                      )
                  : () => {}
              }
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={
            () =>
              dispatch({
                type: 'UPDATE',
                payload: {
                  Lifting_Modal_Visible: !state.Lifting_Modal_Visible,
                },
              })
            // setstate(prevValue => ({
            //   ...prevValue,
            //   Lifting_Modal_Visible: !prevValue.Lifting_Modal_Visible,
            // }))
          }>
          <Text style={styles.buttontext}>Update above Items if needed</Text>
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
            placeholder="............"
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
            onValueChange={(itemValue: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Shift: itemValue,
                },
              });
            }}>
            <Picker.Item label="Select" value="  " color="#fff" />
            <Picker.Item label="Day" value="Day" color="#fff" />
            <Picker.Item label="Night" value="Night" color="#fff" />
            <Picker.Item label="Evening" value="Evening" color="#fff" />
          </Picker>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
            alignItems: 'center',
            borderBottomWidth: 0.5,
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
            onValueChange={(itemValue: string) => {
              dispatch({
                type: 'UPDATE',
                payload: {
                  Taxi: itemValue,
                },
              });
            }}>
            <Picker.Item label="Select" key=" " value=" " />
            {state.Cab_Data.map((cab: Cab, i: number) => (
              <Picker.Item
                label={cab.Cab}
                key={i}
                value={cab.Cab}
                color="#fff"
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
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
              : new Date().toLocaleDateString(undefined, {weekday: 'long'})}
          </Text>
        </View>

        {inputs.map((input, index) => (
          <View key={input.name} style={styles.textinputview}>
            <Text style={[styles.titleText, {color: '#fff'}]}>
              {input.title}
            </Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#fff"
              style={[styles.textInput, {color: '#fff'}]}
              returnKeyType="next"
              // keyboardType="numeric"
              onChangeText={(value: string) => onChange(input.name, value)}
              value={String(state[input.name])}
              ref={(ref: RefObject<TextInput>) => {
                if (ref) {
                  inputRefs[input.name] = ref;
                }
              }}
              onSubmitEditing={
                input.name
                  ? () =>
                      SubmitEditing(
                        input.name,
                        state[input.name].toString(),
                        inputRefs[inputs[index + 1]?.name],
                      )
                  : () => {}
              }
            />
          </View>
        ))}

        {/*<View style={styles.textinputview}>
          <Text style={[styles.titleText, {color: '#fff'}]}>Finish Meter</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#fff"
            style={[styles.textInput, {color: '#fff'}]}
            returnKeyType="next"
            keyboardType="numeric"
            OnChange={(meter2: string) =>
              setstate(prevValues => ({...prevValues, meter2}))
            }
            // value={state.meter2}
            ref={inputRefs.meter2}
            onSubmitEditing={() =>
              onSubmitEditing(
                state.meter2.toString(),
                inputRefs.Shift_Total,
              )
            }
          />
        </View>
        <View style={styles.textinputview}>
          <Text style={[styles.titleText, {color: '#fff'}]}>Total Meter</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#fff"
            style={[styles.textInput, {color: '#fff'}]}
            returnKeyType="next"
            keyboardType="numeric"
            OnChange={(Shift_Total: string) =>
              setstate(prevValues => ({...prevValues, Shift_Total}))
            }
            ref={inputRefs.Shift_Total}
            onSubmitEditing={() =>
              onSubmitEditing(
                state.Shift_Total.toString(),
                inputRefs.insurancefee,
              )
            }
          />
        </View> */}

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
          <Text
            style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            Calculator
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Payin Details
        </Text>
        {payinInputs.map((input, index) => (
          <View key={input.name} style={styles.textinputview}>
            <Text style={[styles.titleText, {color: '#55a8fa'}]}>
              {input.title}
            </Text>
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#55a8fa"
              style={[styles.textInput, {color: '#55a8fa'}]}
              returnKeyType="next"
              keyboardType="numeric"
              // onChangeText={(value: string) => onChange(input.name, value)}
              value={state[input.name]}
              ref={(ref: RefObject<TextInput>) => {
                if (ref) {
                  inputRefs[input.name] = ref;
                }
              }}
              onSubmitEditing={
                input.name
                  ? () =>
                      SubmitEditing(
                        input.name,
                        state[input.name].toString(),
                        payinRefs[inputs[index + 1]?.name],
                      )
                  : () => {}
              }
            />
          </View>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <TouchableOpacity style={styles.button} onPress={updateStateContext}>
          <Text style={styles.buttontext}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={Save}>
          <Text style={styles.buttontext}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Refresh}>
          <Text style={styles.buttontext}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterData;
