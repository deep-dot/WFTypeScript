/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, RefObject} from 'react';
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
import Model from '../../Components/Model';
// import MyButton from '../../Components/Mybutton';
import {Picker} from '@react-native-picker/picker';
import Calculator from '../../Components/Calculator';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './EnterDataScreen.style';
//import envs from '../../config/env';
//import db from '../../databaseService';
import {Transaction, ResultSet} from '../../databaseTypes';
import {
  insertIntoCab,
  deleteIntoCab,
  selectFromCab,
  selectFromUpdateItems,
  selectCountFromDataTable,
  insertData,
} from './dbUtility';
import {StateContext} from './StateProvider';
import {
  initialValues,
  DdeductionsProperties,
  DdeductionsAdditionalProperties,
  useInputRefs,
  useLiftingRefs,
  usePayinRefs,
  inputs,
  liftingInputs,
  payinInputs,
} from './EnterDataValues';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import Database from '../../Database';
import {useNavigation} from '@react-navigation/core';

interface Cab {
  Cab: string;
}
type FormValues = {
  [key: string]: string | boolean | string[] | Cab[];
  //cabData: Cab[];
};

const EnterData = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'Enter Data'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {state, dispatch} = stateContext;
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  //const [formValues, setFormValues] = useState<State>(initialState);
  const inputRefs: {[key: string]: React.RefObject<TextInput>} = useInputRefs();
  const liftingRefs: {[key: string]: React.RefObject<TextInput>} =
    useLiftingRefs();
  const payinRefs: {[key: string]: React.RefObject<TextInput>} = usePayinRefs();

  let submitalltogather = () => {
    let Cdeductions = DdeductionsProperties.reduce(
      (acc, curr) => acc + Number(formValues[curr]),
      0,
    );
    let Ddeductions = [
      ...DdeductionsProperties,
      ...DdeductionsAdditionalProperties,
    ].reduce((acc, curr) => acc + Number(formValues[curr]), 0);

    let Cnetpayin = Number(formValues.commissiongtn) - Cdeductions;
    let Dnetpayin = Number(formValues.commissiongtn) - Ddeductions;
    if (
      DdeductionsAdditionalProperties.some(
        property => Number(formValues[property]) > 0,
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
    setFormValues(prevState => ({
      ...prevState,
      deductions: deductions.toFixed(2),
      netpayin: netpayin.toFixed(2),
    }));
    alertConfirm('Wish to Submit?', () => executeSqlQuery());
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

  const executeSqlQuery = () => {
    insertData(formValues, (_tx: Transaction, results: ResultSet) => {
      console.log('Results', results.rowsAffected);
      if (results.rowsAffected > 0) {
        Alert.alert(
          'Record Submitted Successfully!',
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
                navigation.navigate('Enter Data');
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
    });
  };

  useEffect(() => {
    //setFormValues(state);
    console.log('state in Enter data==', state);
  }, [state]);

  const Refresh = () => {
    dispatch({type: 'REFRESH', payload: null});
    console.log('pressed');
  };

  //number of Entries
  useEffect(() => {
    const fetchUpdateItemsData = async () => {
      try {
        interface UpdateItemsResponse {
          GovLFee: number;
          Driver_Lifting_Value: number;
          Levy: number;
          Driver_Comm_Rate: number;
        }
        const res = (await selectFromUpdateItems()) as UpdateItemsResponse;
        // console.log(' selectFromUpdateItems==', formValues.Total_Lifting_Value);
        setFormValues(prevState => ({
          ...prevState,
          Gov_Lifting_Fee: res.GovLFee.toFixed(2),
          //Driver_Share_In_LiftingFee: res.DriverLFee.t,
          Gov_Levy: res.Levy.toFixed(2),
          Driver_Comm_Rate: res.Driver_Comm_Rate.toFixed(0),
        }));
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCabData = async () => {
      try {
        const res = (await selectFromCab()) as FormValues['cabData'];
        setFormValues(prevState => ({
          ...prevState,
          Cab_Data: res,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNumberOfEntries = async () => {
      try {
        const numberOfEntries = (await selectCountFromDataTable()) as number;
        setFormValues(prevState => ({
          ...prevState,
          Number_Of_Entries: numberOfEntries.toString(),
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUpdateItemsData();
    fetchCabData();
    fetchNumberOfEntries();
  }, [setFormValues]);

  //calculator...
  let Authoritycalculator = (num: Number) => {
    // console.log('charge auth num===', num);
    num = Number(num);
    setFormValues(prevState => ({
      ...prevState,
      Electronic_Account_Payments: num.toFixed(2),
      Calculator_Modal_Visible: !prevState.Calculator_Modal_Visible,
    }));
  };
  let CCcalculator = (num: Number) => {
    num = Number(num);
    setFormValues(prevState => ({
      ...prevState,
      M3_Dockets: num.toFixed(2),
      Calculator_Modal_Visible: !prevState.Calculator_Modal_Visible,
    }));
  };
  let Cancelcalculator = () => {
    setFormValues(prevValue => ({
      ...prevValue,
      Calculator_Modal_Visible: !prevValue.Calculator_Modal_Visible,
    }));
  };

  const handleCabChange = async (action: Function) => {
    if (!formValues.Rego) {
      Alert.alert('Please put rego in.');
      return;
    }
    try {
      await action(formValues.Rego.toString());
      const res = (await selectFromCab()) as Cab[];
      console.log('handleCabChange ==', res);
      setFormValues(prevValue => ({
        ...prevValue,
        Rego_Modal: !prevValue.Rego_Modal,
        Cab_Data: res,
      }));
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
    setFormValues(prevValues => ({
      ...prevValues,
      Lifting_Modal_Visible: !prevValues.Lifting_Modal_Visible,
    }));
  };

  const onChange = (name: string, value: string | boolean) => {
    console.log('onchange in enter data ==', name, 'and', value);
    setFormValues(prevValues => ({...prevValues, [name]: value}));
  };

  const updateStateContext = () => {
    dispatch({type: 'UPDATE', payload: formValues});
    navigation.navigate('Enter Data');
  };

  const SubmitEditing = (
    name: string,
    value: string,
    nextInputRef: React.RefObject<TextInput>,
  ) => {
    if (!isNaN(Number(value))) {
      let updatedValues = {...formValues, [name]: value};
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
        updatedValues.manualLifting = (val2 * val1).toFixed(2);
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
      setFormValues(updatedValues);
      nextInputRef.current?.focus();
    } else {
      Alert.alert('Please input a correct number');
      let updatedValues = {...formValues, [name]: ''};
      setFormValues(updatedValues);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Database />

      <AwesomeAlert
        show={formValues.indicator}
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={false}
      />

      <Calculator
        calculatorVisible={formValues.Calculator_Modal_Visible}
        Cancelcalcu={Cancelcalculator}
        Docketcalcu={CCcalculator}
        CAcalcu={Authoritycalculator}
      />

      <Model
        modvisible={formValues.Lifting_Modal_Visible}
        onCancel={hideModal}
        onupdate={hideModal}
      />

      <RegoModal
        formValues={formValues}
        setFormValues={setFormValues}
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
              value={formValues[input.name]}
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
                        formValues[input.name].toString(),
                        liftingRefs[inputs[index + 1]?.name],
                      )
                  : () => {}
              }
            />
          </View>
        ))}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              Lifting_Modal_Visible: !prevValue.Lifting_Modal_Visible,
            }))
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
              {formValues.Shift}
            </Text>
          </TextInput>
          <Picker
            selectedValue={formValues.Shift}
            style={{
              width: 100,
            }}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValues => ({...prevValues, Shift: itemValue}));
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
              {formValues.Taxi}
            </Text>
          </TextInput>
          <Picker
            selectedValue={formValues.Taxi}
            style={{width: 120}}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValue => ({...prevValue, Taxi: itemValue}));
            }}>
            <Picker.Item label="Select" key=" " value=" " />
            {formValues.Cab_Data.map((cab: Cab, i: number) => (
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
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              Rego_Modal: !prevValue.Rego_Modal,
            }))
          }>
          <Text style={styles.buttontext}>Registration Number</Text>
        </TouchableOpacity>

        <View style={styles.textinputview}>
          <Calendar
            value={formValues.date}
            onChange={(tareek: string) =>
              setFormValues(prevValues => ({...prevValues, date: tareek}))
            }
            OnChange={(din: string) =>
              setFormValues(prevValues => ({...prevValues, day: din}))
            }
          />
          <TextInput
            placeholder="Day"
            placeholderTextColor="#ffffff"
            editable={false}>
            <Text style={styles.titleText}>{formValues.day}</Text>
          </TextInput>

          <TextInput
            placeholder="Date"
            placeholderTextColor="#ffffff"
            style={styles.Textinput}
            editable={false}
            onSubmitEditing={() => {
              if (!formValues.date) {
                Alert.alert('Please input Date');
              } else {
                inputRefs.insurance.current?.focus();
              }
            }}>
            <Text style={styles.titleText}>{formValues.date}</Text>
          </TextInput>
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
              value={formValues[input.name]}
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
                        formValues[input.name].toString(),
                        inputRefs[inputs[index + 1]?.name],
                      )
                  : () => {}
              }
            />
          </View>
        ))}

        {/* <View style={styles.textinputview}>
          <Text style={[styles.titleText, {color: '#fff'}]}>Start Meter</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#fff"
            style={[styles.textInput, {color: '#fff'}]}
            returnKeyType="next"
            keyboardType="numeric"
            OnChange={(meter1: string) =>
              setFormValues(prevValues => ({...prevValues, meter1}))
            }
            ref={inputRefs.meter1}
            // onSubmitEditing={
            //   input.name === 'meter2'
            //     ? () => SubmitEditing('meter2', formValues.meter2.toString())
            //     : undefined
            // }
            onSubmitEditing={() =>
              onSubmitEditing(formValues.meter1.toString(), inputRefs.meter2)
            }
          />
        </View>
        <View style={styles.textinputview}>
          <Text style={[styles.titleText, {color: '#fff'}]}>Finish Meter</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#fff"
            style={[styles.textInput, {color: '#fff'}]}
            returnKeyType="next"
            keyboardType="numeric"
            OnChange={(meter2: string) =>
              setFormValues(prevValues => ({...prevValues, meter2}))
            }
            // value={formValues.meter2}
            ref={inputRefs.meter2}
            onSubmitEditing={() =>
              onSubmitEditing(
                formValues.meter2.toString(),
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
              setFormValues(prevValues => ({...prevValues, Shift_Total}))
            }
            ref={inputRefs.Shift_Total}
            onSubmitEditing={() =>
              onSubmitEditing(
                formValues.Shift_Total.toString(),
                inputRefs.insurancefee,
              )
            }
          />
        </View> */}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              Calculator_Modal_Visible: !prevValue.Calculator_Modal_Visible,
            }))
          }>
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
              value={formValues[input.name]}
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
                        formValues[input.name].toString(),
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

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (formValues.date) {
              submitalltogather();
            } else {
              Alert.alert('Please select Date.');
            }
          }}>
          <Text style={styles.buttontext}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={Refresh}>
          <Text style={styles.buttontext}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterData;
