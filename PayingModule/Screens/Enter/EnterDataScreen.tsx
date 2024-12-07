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
//import AwesomeAlert from 'react-native-awesome-alerts';
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
  initialState,
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
  const {
    allDataTypeState,
    mainDataState,
    liftingModelState,
    cabModelState,
    dispatch,
  } = stateContext;

  const inputRefs = useInputRefs();
  const [Cnetpayin, setCnetpayin] = useState(0);
  const [Dnetpayin, setDnetpayin] = useState(0);
  const [Cdeductions, setCdeductions] = useState(0);
  const [Ddeductions, setDdeductions] = useState(0);

  useEffect(() => {
    try {
      // const functions = async () => {
      // const liftingModalData = await
      selectWeekEndingTable(dispatch);
      selectLiftingTable(dispatch);
      SelectCab(dispatch);
      SelectFromDataTable(dispatch);
      // }
      // functions();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }, [dispatch]);

  const calculateAndUpdateValues = useCallback(() => {
    //const calculateAndUpdateValues = () => {
    let updatedValues = {...allDataTypeState};
    updatedValues.mainData[0].Levy =
      updatedValues.mainData[0]?.Jobs_Done ||
      0 * updatedValues.liftingData.Gov_Levy;

    console.log(
      'updatedValues.Jobs_Done==',
      updatedValues.liftingData.Gov_Levy,
      updatedValues.mainData[0]?.Levy || 0,
      updatedValues.mainData[0]?.meterTotal || 0,
    );

    updatedValues.mainData[0].Shift_Total =
      updatedValues.mainData[0].meterTotal - updatedValues.mainData[0].Levy;

    updatedValues.mainData[0]?.Kms || 0;

    updatedValues.mainData[0]?.Paid_Kms || 0;

    updatedValues.mainData[0].Number_Of_Chairs =
      updatedValues.mainData[0].Eftpos_Liftings +
      updatedValues.mainData[0].Number_Of_Manual_Liftings;

    updatedValues.mainData[0].Driver_Lifting_Value =
      updatedValues.mainData[0].Number_Of_Chairs *
      updatedValues.liftingData.Driver_Share_In_LiftingFee;

    updatedValues.mainData[0].Commission_Driver =
      (updatedValues.mainData[0].Shift_Total *
        updatedValues.liftingData.Driver_Comm_Rate) /
      100;

    updatedValues.liftingData.Company_Comm_Rate =
      100 - updatedValues.liftingData.Driver_Comm_Rate;

    updatedValues.mainData[0].Commission_Company =
      (updatedValues.mainData[0].Shift_Total *
        updatedValues.liftingData.Company_Comm_Rate) /
      100;

    updatedValues.mainData[0].CPK =
      updatedValues.mainData[0].Kms > 0
        ? updatedValues.mainData[0].Shift_Total / updatedValues.mainData[0].Kms
        : 0;

    updatedValues.mainData[0].Unpaid_Kms =
      updatedValues.mainData[0].Kms - updatedValues.mainData[0].Paid_Kms;

    //from save function
    let eftpos_without_lifting =
      updatedValues.mainData[0].Eftpos -
      updatedValues.mainData[0].Number_Of_Chairs *
        updatedValues.liftingData.Gov_Lifting_Fee;

    let cdeductions =
      updatedValues.mainData[0].Driver_Lifting_Value +
      updatedValues.mainData[0].M3_Dockets +
      updatedValues.mainData[0].Electronic_Account_Payments +
      updatedValues.mainData[0].Total_Manual_MPTP31_And_MPTP_Values +
      eftpos_without_lifting;

    setCdeductions(cdeductions);
    let ddeductions =
      cdeductions +
      updatedValues.mainData[0].Misc +
      updatedValues.mainData[0].Car_Wash +
      updatedValues.mainData[0].Fuel;

    setDdeductions(ddeductions);
    let cnetpayin = updatedValues.mainData[0].Commission_Company - cdeductions;
    setCnetpayin(cnetpayin);
    let dnetpayin = updatedValues.mainData[0].Commission_Company - ddeductions;
    setDnetpayin(dnetpayin);

    dispatch({
      type: 'INSERT',
      payload: {data: updatedValues, table: 'datatable'},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    // updatedValues.mainData[0].Jobs_Done,
    // liftingModelState.Gov_Levy,
    // mainDataState.meterTotal,
    // mainDataState.Eftpos_Liftings,
    // mainDataState.Number_Of_Manual_Liftings,
    // liftingModelState.Driver_Share_In_LiftingFee,
    // liftingModelState.Driver_Comm_Rate,
    // liftingModelState.Company_Comm_Rate,
    // mainDataState.Kms,
    // mainDataState.Eftpos,
    // mainDataState.M3_Dockets,
    // mainDataState.Electronic_Account_Payments,
    // mainDataState.Total_Manual_MPTP31_And_MPTP_Values,
    // mainDataState.Misc,
    // mainDataState.Car_Wash,
    // mainDataState.Fuel,
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
        payload: {data: value, table: 'datatable'},
      });
      calculateAndUpdateValues();
    } else {
      Alert.alert('Please input a correct number');
      dispatch({type: 'INSERT', payload: {data: '', table: 'datatable'}});
    }
  };

  let Save = () => {
    // console.log('in save==', Cdeductions, Ddeductions, Cnetpayin, Dnetpayin);
    if (
      mainDataState.Car_Wash > 0 ||
      mainDataState.Misc > 0 ||
      mainDataState.Fuel > 0
    ) {
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
                  table: 'datatable',
                  data: {
                    Deductions: isNaN(Ddeductions) ? 0 : Ddeductions,
                    Net_Payin: isNaN(Dnetpayin) ? 0 : Dnetpayin,
                  },
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
                  table: 'datatable',
                  data: {
                    Deductions: isNaN(Cdeductions) ? 0 : Cdeductions,
                    Net_Payin: isNaN(Cnetpayin) ? 0 : Cnetpayin,
                  },
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
            // console.log('state in enterdatascreen alertConfirm ===', state);
            try {
              await upsertData(allDataTypeState, dispatch);
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
    dispatch({
      type: 'REFRESH',
      payload: {table: 'datatable', data: initialState.mainData},
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModalForm />
      {/* <AwesomeAlert
        show={
          state.Indicator !== undefined ? Boolean(state.Indicator) : undefined
        }
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={false}
      /> */}

      <Calculator />

      <LiftingModel />

      <RegoModal />

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={{alignItems: 'center'}}>
          <Text style={[styles.titleText, {color: 'green', marginVertical: 5}]}>
            Total Entries: {allDataTypeState.mainData[0].numberOfEntries}
          </Text>
        </View>
        {liftingInputs.map(input => (
          <View key={input.name} style={styles.textinputview}>
            <Text style={[styles.titleText, {color: '#55a8fa'}]}>
              {input.title}
            </Text>
            <Text style={[styles.titleText, {color: '#55a8fa'}]}>
              {Number(liftingModelState[input.name]).toFixed(2)}
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
                data: {
                  Lifting_Modal_Visible:
                    !liftingModelState.Lifting_Modal_Visible,
                },
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
              {mainDataState.Shift}
            </Text>
          </TextInput>
          <Picker
            selectedValue={mainDataState.Shift}
            style={{
              width: 100,
            }}
            onValueChange={(Shift: string) => {
              dispatch({
                type: 'INSERT',
                payload: {
                  data: {
                    Shift,
                  },
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
                {String(mainDataState.Taxi)}
              </Text>
            </TextInput>
            <Picker
              selectedValue={mainDataState.Taxi}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={Taxi => {
                dispatch({
                  type: 'INSERT',
                  payload: {
                    data: {
                      Taxi,
                      Rego_Modal: false,
                    },
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
              {cabModelState.Cab_Data &&
                cabModelState.Cab_Data.map((c, key) => (
                  <Picker.Item
                    label={c.cab}
                    key={key}
                    value={c.cab}
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
                  data: {
                    Rego_Modal: !cabModelState.Rego_Modal,
                  },
                  table: 'cab',
                },
              });
            }}>
            <Text style={styles.buttontext}>Registration Number</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textinputview}>
          <Calendar
            value={String(mainDataState.Date)}
            onChange={(date: string, day: string) => {
              dispatch({
                type: 'INSERT',
                payload: {
                  data: {
                    Date: date,
                    Day: day,
                  },
                  table: 'datatable',
                },
              });
            }}
          />
          <Text style={styles.Textinput}>
            {mainDataState.Date
              ? mainDataState.Day + ' ' + mainDataState.Date
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
                  mainDataState &&
                  mainDataState[input.name] !== 0 &&
                  mainDataState[input.name] !== undefined
                    ? String(mainDataState[input.name])
                    : ''
                }
                ref={inputRefs[input.name]}
                onSubmitEditing={() => {
                  if (input.name) {
                    SubmitEditing(
                      input.name,
                      String(mainDataState[input.name]),
                    );
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
                  data: {
                    Calculator_Modal_Visible:
                      !mainDataState.Calculator_Modal_Visible,
                  },
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
                {Number(mainDataState[input.name]).toFixed(2)}
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
                data: {
                  start_date: '',
                  finish_date: '',
                  totalrecords: 0,
                },
                table: 'datatable',
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
