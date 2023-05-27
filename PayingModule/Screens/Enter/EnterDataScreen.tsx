/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, useContext, RefObject} from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {RegoModal} from './components/RegoModal';
import Model from '../../Components/Model';
// import MyButton from '../../Components/Mybutton';
import {Picker} from '@react-native-picker/picker';
import Calculator from '../../Components/Calculator';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './EnterDataScreen.style';
//import envs from '../../config/env';
import db from '../../databaseService';
import {Transaction, ResultSet} from '../../databaseTypes';
import {
  insertIntoCab,
  selectFromCab,
  selectFromUpdateItems,
  selectCountFromDataTable,
} from './dbUtility';
import {StateContext} from './StateProvider';
import MyTextInput from './MyTextInput';
import {
  initialValues,
  useInputRefs,
  insertData,
  inputs,
  liftingModalInputs,
  payinDetailInputs,
} from './EnterDataValues';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../../App';
import Database from '../../Database';
import {useNavigation} from '@react-navigation/core';

type FormValues = {
  [key: string]: string | boolean | string[];
  cabData: string[];
};
const EnterData = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackParamList, 'Enter Data'>>();
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  let submitalltogather = () => {
    let Cdeductions =
      Number(formValues.eftpos) -
      Number(formValues.eftposlifting) +
      Number(formValues.govSubManual31) +
      Number(formValues.manualMptp) +
      Number(formValues.cc) +
      Number(formValues.chargeAuthority) +
      Number(formValues.driverLFee);
    let Ddeductions =
      Cdeductions +
      Number(formValues.carwash) +
      Number(formValues.accountFuel) +
      Number(formValues.misc);

    let Cnetpayin = Number(formValues.commissiongtn) - Cdeductions;
    let Dnetpayin = Number(formValues.commissiongtn) - Ddeductions;
    formValues.driverIncome = (
      Number(formValues.driverLFee) + Number(formValues.commissiondriver)
    ).toFixed(2);

    if (
      Number(formValues.accountFuel) > 0 ||
      Number(formValues.carwash) > 0 ||
      Number(formValues.misc) > 0
    ) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's ?",
            onPress: () => {
              setFormValues(prevState => ({
                ...prevState,
                deductions: Ddeductions.toFixed(2),
                netpayin: Dnetpayin.toFixed(2),
              }));
              alertConfirm('Wish to Submit?', () => executeSqlQuery());
            },
          },
          {
            text: "Company's ?",
            onPress: () => {
              setFormValues(prevState => ({
                ...prevState,
                deductions: Cdeductions.toFixed(2),
                netpayin: Cnetpayin.toFixed(2),
              }));
              alertConfirm('Wish to Submit?', () => executeSqlQuery());
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
      setFormValues(prevState => ({
        ...prevState,
        deductions: Cdeductions.toFixed(2),
        netpayin: Cnetpayin.toFixed(2),
      }));
      alertConfirm('Wish to Submit?', () => executeSqlQuery());
    }
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

  const Refresh = () => {
    dispatch({type: 'REFRESH'});
  };

  //number of Entries
  useEffect(() => {
    const fetchUpdateItemsData = async () => {
      try {
        const res = await selectFromUpdateItems(db);
        setFormValues(prevState => ({
          ...prevState,
          liftingtotal: res.GovLFee,
          liftingcompany: res.CompanyLFee,
          liftingdriver: res.DriverLFee,
          levy: res.Levy,
          drivercommrate: res.Driver_Comm_Rate,
          companycommrate: res.Company_Comm_Rate,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCabData = async () => {
      try {
        const res = await selectFromCab(db);
        setFormValues(prevState => ({...prevState, cabData: res}));
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNumberOfEntries = async () => {
      try {
        const numberOfEntries = await selectCountFromDataTable(db);
        setFormValues(prevState => ({...prevState, numberOfEntries}));
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
      chargeAuthority: num.toFixed(2),
      calculatormodalvisible: !prevState.calculatormodalvisible,
    }));
  };
  let CCcalculator = (num: Number) => {
    num = Number(num);
    setFormValues(prevState => ({
      ...prevState,
      cc: num.toFixed(2),
      calculatormodalvisible: !prevState.calculatormodalvisible,
    }));
  };
  let Cancelcalculator = () => {
    setFormValues(prevValue => ({
      ...prevValue,
      calculatormodalvisible: !prevValue.calculatormodalvisible,
    }));
  };

  let pushcab = async () => {
    if (!formValues.rego) {
      Alert.alert('Please put rego in.');
    } else {
      try {
        if (typeof formValues.rego === 'string') {
          console.log('formValues.rego==', formValues.rego);
          const res = await insertIntoCab(db, formValues.rego);
          if (res.rowsAffected > 0) {
            navigation.navigate('Enter Data');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deletecab = () => {
    if (!formValues.rego) {
      Alert.alert('Please put rego in.');
    } else {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'DELETE FROM cab where Cab = ?',
            [formValues.rego],
            (_tx: Transaction, results: ResultSet) => {
              if (results.rowsAffected > 0) {
                Alert.alert('Deleted successfully');
                navigation.navigate('Home');
              }
            },
          );
        });
      } else {
        console.log('db is undefined');
      }
    }
  };
  const Onupdate = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      liftingmodalvisible: !prevValues.liftingmodalvisible,
    }));
    navigation.navigate('Enter Data');
  };
  const Invisible = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      liftingmodalvisible: !prevValues.liftingmodalvisible,
    }));
  };

  const onChange = (name: string, value: string | boolean) => {
    setFormValues(prevValues => ({...prevValues, [name]: value}));
  };

  const inputRefs: {[key: string]: React.RefObject<TextInput>} = {
    hours: useRef(null),
    insurancefee: useRef(null),
    numberofJobs: useRef(null),
    totallevy: useRef(null),
    meter1: useRef(null),
    meter2: useRef(null),
    totalmeter: useRef(null),
    km1: useRef(null),
    km2: useRef(null),
    resultkm: useRef(null),
    paidkm1: useRef(null),
    paidkm2: useRef(null),
    resultpaidkm: useRef(null),
    unpaidkm: useRef(null),
    cpk: useRef(null),
    eftpos: useRef(null),
    eftposlifting: useRef(null),
    cc: useRef(null),
    manualMptp: useRef(null),
    govSubManual31: useRef(null),
    numberofmanuallifting: useRef(null),
    chargeAuthority: useRef(null),
    misc: useRef(null),
    carwash: useRef(null),
    accountFuel: useRef(null),
  };

  const SubmitEditing = (
    name: string,
    value: string,
    nextInputRef: React.RefObject<TextInput>,
  ) => {
    if (!isNaN(Number(value))) {
      let updatedValues = {...formValues, [name]: value};
      console.log(`name ${name} and value ${value}`);
      if (name === 'numberofJobs') {
        const val1 = Number(updatedValues.numberofJobs || 0);
        const val2 = Number(updatedValues.levy || 0);
        updatedValues.totallevy = (val1 * val2).toFixed(2);
      }
      if (name === 'meter2') {
        const val1 = Number(updatedValues.meter1 || 0);
        const val2 = Number(updatedValues.meter2 || 0);
        const val3 = Number(updatedValues.totallevy || 0);
        const val4 = Number(updatedValues.drivercommrate || 0);
        const val5 = Number(updatedValues.companycommrate || 0);
        const val6 = Number(updatedValues.hours || 0);
        updatedValues.totalmeter = (val2 - val1 - val3).toFixed(2);
        updatedValues.commissiondriver = (
          Number(updatedValues.totalmeter) *
          (val4 / 100)
        ).toFixed(2);
        updatedValues.commissiongtn = (
          Number(updatedValues.totalmeter) *
          (val5 / 100)
        ).toFixed(2);
        updatedValues.fare = (Number(updatedValues.totalmeter) / val6).toFixed(
          2,
        );
      }
      if (name === 'km2') {
        const val1 = Number(updatedValues.km1 || 0);
        const val2 = Number(updatedValues.km2 || 0);
        updatedValues.resultkm = (val2 - val1).toFixed(2);
        updatedValues.cpk = (
          Number(updatedValues.totalmeter) / Number(updatedValues.resultkm)
        ).toFixed(2);
      }
      if (name === 'paidkm2') {
        const val1 = Number(updatedValues.paidkm1 || 0);
        const val2 = Number(updatedValues.paidkm2 || 0);
        updatedValues.resultpaidkm = (val2 - val1).toFixed(2);
        updatedValues.unpaidkm = (
          Number(updatedValues.resultkm) - Number(updatedValues.resultpaidkm)
        ).toFixed(2);
      }
      if (name === 'numberofmanuallifting') {
        const val1 = Number(updatedValues.numberofmanuallifting || 0);
        const val2 = Number(updatedValues.liftingtotal || 0);
        updatedValues.manualLifting = (val2 * val1).toFixed(2);
      }
      if (name === 'eftposlifting') {
        const val1 = Number(updatedValues.numberofmanuallifting || 0);
        const val2 = Number(updatedValues.liftingtotal || 0);
        const val3 = Number(updatedValues.eftposlifting || 0);
        const val4 = Number(updatedValues.liftingcompany || 0);
        const val5 = Number(updatedValues.liftingdriver || 0);
        updatedValues.totalLifting = (val2 * val1 + val3).toFixed(2);
        updatedValues.numberofChairs = (val1 + val3 / val2).toFixed(2);
        updatedValues.gtnLFee = (
          Number(updatedValues.numberofChairs) * val4
        ).toFixed(2);
        updatedValues.driverLFee = (
          Number(updatedValues.numberofChairs) * val5
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
        calculatorVisible={formValues.calculatormodalvisible}
        Cancelcalcu={Cancelcalculator}
        Docketcalcu={CCcalculator}
        CAcalcu={Authoritycalculator}
      />

      <Model
        modvisible={formValues.liftingmodalvisible}
        onCancel={Invisible}
        onupdate={Onupdate}
      />

      <RegoModal
        formValues={formValues}
        setFormValues={setFormValues}
        pushcab={pushcab}
        deletecab={deletecab}
      />

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* {liftingModalInputs.map((input, index) => (
          <MyTextInput
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
           // nextInputRef={inputRefs[liftingModalInputs[index + 1]?.nextInput]}
            textColor="#55a8fa"
            placeholderTextColor="#55a8fa"
          />
        ))} */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              liftingmodalvisible: !prevValue.liftingmodalvisible,
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
              {formValues.shift}
            </Text>
          </TextInput>
          <Picker
            selectedValue={formValues.shift}
            style={{
              width: 100,
            }}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValues => ({...prevValues, shift: itemValue}));
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
            style={{width: 100}}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValue => ({...prevValue, Taxi: itemValue}));
            }}>
            <Picker.Item label="Select" key=" " value=" " />
            {formValues.cabData.forEach((cab: string, i: number) => (
              <Picker.Item label={cab} key={i} value={cab} color="#fff" />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              regomodal: !prevValue.regomodal,
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
              placeholder="0.0"
              placeholderTextColor="#fff"
              style={[styles.textInput, {color: '#fff'}]}
              returnKeyType="next"
              keyboardType="numeric"
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
                inputRefs.totalmeter,
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
            OnChange={(totalmeter: string) =>
              setFormValues(prevValues => ({...prevValues, totalmeter}))
            }
            ref={inputRefs.totalmeter}
            onSubmitEditing={() =>
              onSubmitEditing(
                formValues.totalmeter.toString(),
                inputRefs.insurancefee,
              )
            }
          />
        </View> */}

        <View style={styles.textinputview}>
          <Text style={[styles.titleText, {color: '#55a8fa'}]}>Total Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.textInput}
            value={formValues.totallevy}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFormValues(prevValue => ({
              ...prevValue,
              calculatormodalvisible: !prevValue.calculatormodalvisible,
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
        {payinDetailInputs.map((input, index) => (
          <MyTextInput
            placeholderTextColor="#55a8fa"
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
            nextInputRef={inputRefs[payinDetailInputs[index + 1]?.nextInput]}
            textColor="#55a8fa"
          />
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DisplayReport')}>
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
