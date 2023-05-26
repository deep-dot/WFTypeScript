/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
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
  // console.log('props in Enter Data screen===', navigation);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  //console.log('state in EnterDataScreen==', state);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const inputRefs: {[key: string]: React.RefObject<TextInput>} = useInputRefs();

  const setFormValue = (key: string, value: string | boolean) => {
    setFormValues(prevValues => ({...prevValues, [key]: value}));
  };

  const calculatekm = () => {
    const resultkm = Number(formValues.km2) - Number(formValues.km1);
    setFormValue('resultkm', resultkm.toFixed(2));
    // paidkmstart.focus();
  };

  const calculatemeter = () => {
    const totalmeter =
      Number(formValues.meter2) -
      Number(formValues.totallevy) -
      Number(formValues.meter1);
    setFormValue('totalmeter', totalmeter.toFixed(2));
    kmstart.current.focus();
  };

  const Totallevy = () => {
    const totalLevy = Number(formValues.numberofJobs) * Number(formValues.levy);
    setFormValue('totalLevy', totalLevy.toFixed(2));
    // mis.focus();
  };

  const calculatepaidkm = () => {
    const resultpaidkm = (
      Number(formValues.paidkm2) - Number(formValues.paidkm1)
    ).toFixed(2);
    setFormValue('resultpaidkm', resultpaidkm);

    const commissiondriver =
      Number(formValues.totalmeter) * (Number(formValues.drivercommrate) / 100);
    setFormValue('commissiondriver', commissiondriver.toFixed(2));

    const commissiongtn =
      Number(formValues.totalmeter) *
      (Number(formValues.companycommrate) / 100);
    setFormValue('commissiongtn', commissiongtn.toFixed(2));

    let cpk;
    if (Number(formValues.resultkm) > 0) {
      cpk = Number(formValues.totalmeter) / Number(formValues.resultkm);
    } else {
      cpk = Number(formValues.cpk);
    }
    setFormValue('cpk', cpk.toFixed(2));
    // gsm.focus();
  };

  const calculateUnpaidkm = () => {
    const unpaidkm =
      Number(formValues.resultkm) - Number(formValues.resultpaidkm);
    setFormValue('unpaidkm', unpaidkm.toFixed(2));
  };

  const calculateManualLifting = () => {
    const manualLifting =
      Number(formValues.numberofmanuallifting) *
      Number(formValues.liftingtotal);
    setFormValue('manuallifting', manualLifting.toFixed(2));
    calculateUnpaidkm();
    // eftps.focus();
  };

  const calculateTotalLifting = () => {
    let a =
      Number(formValues.numberofmanuallifting) *
      Number(formValues.liftingtotal);
    let b = Number(formValues.eftposlifting);
    const totalLifting = a + b;
    setFormValue('totalLifting', totalLifting.toFixed(2));
    calculateNumberofChairs();
  };

  const calculateNumberofChairs = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let numberofChairs;
    if (Number(formValues.liftingtotal) > 0) {
      numberofChairs = a + b;
    } else {
      numberofChairs = 0;
    }
    setFormValue('numberofChairs', numberofChairs.toFixed(0));
    calculateGtnLFee();
  };

  const calculateGtnLFee = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let gtnLFee = (a + b) * Number(formValues.liftingcompany);
    setFormValue('gtnLFee', gtnLFee.toFixed(2));
    calculateDriverLFee();
  };

  const calculateDriverLFee = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let driverLFee = (a + b) * Number(formValues.liftingdriver);
    setFormValue('driverLFee', driverLFee.toFixed(2));
    calculateAveFare();
  };

  const calculateAveFare = () => {
    let fare;
    if (Number(formValues.hours) > 0) {
      fare = Number(formValues.totalmeter) / Number(formValues.hours);
    } else {
      fare = 0.0;
    }
    setFormValue('fare', fare.toFixed(2));
    // docket.focus();
  };

  let submitalltogather = () => {
    let a;
    if (Number(formValues.liftingtotal) > 0) {
      a = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    } else {
      a = 0;
    }

    let kullnumberofchairs = Number(formValues.numberofmanuallifting) + a;
    let kulldriverlfee =
      Number(kullnumberofchairs) * Number(formValues.liftingdriver);
    let kulllevy = Number(formValues.numberofJobs) * Number(formValues.levy);
    let kullmeter =
      Number(formValues.meter2) - Number(formValues.meter1) - kulllevy;
    let kullkm = Number(formValues.km2) - Number(formValues.km1);
    let kullpaidkm = Number(formValues.paidkm2) - Number(formValues.paidkm1);
    let kullunpaidkm = kullkm - kullpaidkm;
    let kullmanuallifting =
      Number(formValues.numberofmanuallifting) *
      Number(formValues.liftingtotal);
    let kulltotallifting = kullmanuallifting + Number(formValues.eftposlifting);
    let kullgtnlfee =
      Number(kullnumberofchairs) * Number(formValues.liftingcompany);
    let kullcommdriver = kullmeter * (Number(formValues.drivercommrate) / 100);
    let kullcommgtn = kullmeter * (Number(formValues.companycommrate) / 100);

    let Cdeductions =
      Number(formValues.eftpos) -
      Number(formValues.eftposlifting) +
      Number(formValues.govSubManual31) +
      Number(formValues.manualMptp) +
      Number(formValues.cc) +
      Number(formValues.chargeAuthority) +
      kulldriverlfee;
    let Ddeductions =
      Cdeductions +
      Number(formValues.carwash) +
      Number(formValues.accountFuel) +
      Number(formValues.misc);

    let Cnetpayin = kullcommgtn - Cdeductions;
    let Dnetpayin = kullcommgtn - Ddeductions;
    let driverincome = kulldriverlfee + kullcommdriver;

    let kullcpk = 0.0;
    if (kullkm > 0) {
      kullcpk = kullmeter / kullkm;
    }

    let fare = 0.0;
    if (Number(formValues.hours) > 0) {
      fare = kullmeter / Number(formValues.hours);
    }

    setFormValues({
      ...formValues,
      cpk: kullcpk.toFixed(2),
      fare: fare.toFixed(2),
      commissiondriver: kullcommdriver.toFixed(2),
      commissiongtn: kullcommgtn.toFixed(2),
      totallevy: kulllevy.toFixed(2),
      totalmeter: kullmeter.toFixed(2),
      resultkm: kullkm.toFixed(2),
      resultpaidkm: kullpaidkm.toFixed(2),
      unpaidkm: kullunpaidkm.toFixed(2),
      manuallifting: kullmanuallifting.toFixed(2),
      totallifting: kulltotallifting.toFixed(2),
      numberofChairs: kullnumberofchairs.toFixed(0),
      gtnLFee: kullgtnlfee.toFixed(2),
      driverLFee: kulldriverlfee.toFixed(2),
      driverIncome: driverincome.toFixed(2),
    });

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

  // console.log('inputRefs[input.nextInput]==', inputRefs.insurance.current);
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
        {liftingModalInputs.map(input => (
          <MyTextInput
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
            nextInputRef={inputRefs[input.nextInput]}
            textColor="#55a8fa"
            placeholderTextColor="#55a8fa"
          />
        ))}
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

        {inputs.map(input => (
          <MyTextInput
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
             nextInputRef={inputRefs[input.nextInput]}
           // nextInputRef={input.nextInput}
            textColor="#fff"
            placeholderTextColor="#fff"
          />
        ))}

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
        {payinDetailInputs.map(input => (
          <MyTextInput
            placeholderTextColor="#55a8fa"
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
            nextInputRef={inputRefs[input.nextInput]}
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
