/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import Model from '../../Components/Model';
import MyButton from '../../Components/Mybutton';
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
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {string} from 'prop-types';

interface Props {
  navigation: NavigationProp<ParamListBase>;
}
type FormValues = {
  [key: string]: string | boolean;
};
const EnterData = ({navigation}: Props) => {
  console.log('props in Enter Data screen===', navigation);
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  //console.log('state in EnterDataScreen==', state);
  const [formValues, setFormValues] = useState<FormValues>({
    liftingtotal: '',
    liftingdriver: '',
    liftingcompany: '',
    levy: '',
    drivercommrate: '',
    companycommrate: '',
    liftingmodalvisible: false,
    shift: '',
    hours: '',
    numberofJobs: '',
    totallevy: '',
    insurancefee: '',
    meter1: '',
    meter2: '',
    totalmeter: '',
    km1: '',
    km2: '',
    resultkm: '',
    paidkm1: '',
    paidkm2: '',
    unpaidkm: '',
    cpk: '',
    resultpaidkm: '',
    eftpos: '',
    eftposlifting: '',
    cc: '',
    manualMptp: '',
    govSubManual31: '',
    cabData: [''],
    Taxi: '',
    numberofmanuallifting: '',
    manuallifting: '',
    chargeAuthority: '',
    misc: '',
    carwash: '',
    accountFuel: '',
    totallifting: '',
    numberofChairs: '',
    gtnLFee: '',
    driverLFee: '',
    deductions: '',
    date: '',
    day: '',
    commissiongtn: '',
    commissiondriver: '',
    fare: '',
    netpayin: '',
    driverIncome: '',
    regomodal: false,
    rego: '',
    calculatormodalvisible: false,
    numberofEntries: '',
    indicator: false,
  });
  const inputRefs: {[key: string]: React.RefObject<TextInput>} = {
    hoursworked: useRef<TextInput>(null),
    insurance: useRef<TextInput>(null),
    job: useRef<TextInput>(null),
    // lev: useRef<TextInput>(null),
    fuel: useRef<TextInput>(null),
    meterstart: useRef<TextInput>(null),
    meterfinish: useRef<TextInput>(null),
    kmstart: useRef<TextInput>(null),
    kmfinish: useRef<TextInput>(null),
    paidkmstart: useRef<TextInput>(null),
    paidkmfinish: useRef<TextInput>(null),
    // sbmt: useRef<TextInput>(null),
    gsm: useRef<TextInput>(null),
    gsm31: useRef<TextInput>(null),
    // manualmptp: useRef<TextInput>(null),
    noofmanualmptplifts: useRef<TextInput>(null),
    eftps: useRef<TextInput>(null),
    eftposliftingfee: useRef<TextInput>(null),
    docket: useRef<TextInput>(null),
    charge: useRef<TextInput>(null),
    mis: useRef<TextInput>(null),
    wash: useRef<TextInput>(null),
  };

  const setFormValue = (key: string, value: string | boolean) => {
    setFormValues(prevValues => ({...prevValues, [key]: value}));
  };

  const calculatekm = () => {
    const resultkm = (Number(formValues.km2) - Number(formValues.km1)).toFixed(
      2,
    );
    setFormValue('resultkm', resultkm);
    // paidkmstart.focus();
  };

  const calculatemeter = () => {
    const totalmeter = (
      Number(formValues.meter2) -
      Number(formValues.totallevy) -
      Number(formValues.meter1)
    ).toFixed(2);
    setFormValue('totalmeter', totalmeter);
    kmstart.current.focus();
  };

  const Totallevy = () => {
    const totalLevy = (
      Number(formValues.numberofJobs) * Number(formValues.levy)
    ).toFixed(2);
    setFormValue('totalLevy', totalLevy);
    // mis.focus();
  };

  const calculatepaidkm = () => {
    const resultpaidkm = (
      Number(formValues.paidkm2) - Number(formValues.paidkm1)
    ).toFixed(2);
    setFormValue('resultpaidkm', resultpaidkm);

    const commissiondriver = (
      Number(formValues.totalmeter) *
      (Number(formValues.drivercommrate) / 100)
    ).toFixed(2);
    setFormValue('commissiondriver', commissiondriver);

    const commissiongtn = (
      Number(formValues.totalmeter) *
      (Number(formValues.companycommrate) / 100)
    ).toFixed(2);
    setFormValue('commissiongtn', commissiongtn);

    let cpk;
    if (Number(formValues.resultkm) > 0) {
      cpk = (
        Number(formValues.totalmeter) / Number(formValues.resultkm)
      ).toFixed(2);
    } else {
      cpk = Number(formValues.cpk).toFixed(2);
    }
    setFormValue('cpk', cpk);
    // gsm.focus();
  };

  const calculateUnpaidkm = () => {
    const unpaidkm = (
      Number(formValues.resultkm) - Number(formValues.resultpaidkm)
    ).toFixed(2);
    setFormValue('unpaidkm', unpaidkm);
  };

  const calculateManualLifting = () => {
    const manualLifting = (
      Number(formValues.numberofmanuallifting) * Number(formValues.liftingtotal)
    ).toFixed(2);
    setFormValue('manuallifting', manualLifting);

    calculateUnpaidkm();
    // eftps.focus();
  };

  const calculateTotalLifting = () => {
    let a =
      Number(formValues.numberofmanuallifting) *
      Number(formValues.liftingtotal);
    let b = Number(formValues.eftposlifting);
    const totalLifting = (a + b).toFixed(2);
    setFormValue('totalLifting', totalLifting);

    calculateNumberofChairs();
  };

  const calculateNumberofChairs = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let numberofChairs;
    if (Number(formValues.liftingtotal) > 0) {
      numberofChairs = (a + b).toFixed(0);
    } else {
      numberofChairs = '0';
    }
    setFormValue('numberofChairs', numberofChairs);

    calculateGtnLFee();
  };

  const calculateGtnLFee = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let gtnLFee = ((a + b) * Number(formValues.liftingcompany)).toFixed(2);
    setFormValue('gtnLFee', gtnLFee);

    calculateDriverLFee();
  };

  const calculateDriverLFee = () => {
    let a = Number(formValues.numberofmanuallifting);
    let b = Number(formValues.eftposlifting) / Number(formValues.liftingtotal);
    let driverLFee = ((a + b) * Number(formValues.liftingdriver)).toFixed(2);
    setFormValue('driverLFee', driverLFee);

    let fare;
    if (Number(formValues.hours) > 0) {
      fare = (Number(formValues.totalmeter) / Number(formValues.hours)).toFixed(
        2,
      );
    } else {
      fare = '0.00';
    }
    setFormValue('fare', fare);
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

    let kullcpk = '0.00';
    if (kullkm > 0) {
      kullcpk = (kullmeter / kullkm).toFixed(2);
    }

    let fare = '0.00';
    if (Number(formValues.hours) > 0) {
      fare = (kullmeter / Number(formValues.hours)).toFixed(2);
    }

    setFormValues({
      ...formValues,
      cpk: kullcpk,
      fare,
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

    const executeSqlQuery = (deduction: number, netPayin: number) => {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs, Ins, Hours_Worked, Total_Levy, Car_Wash, Meter_Start, Meter_Finish, Shift_Total, Com_GTN, Com_Driver, Km_Start, Km_Finish, Kms, Paidkm_Start, Paidkm_Finish, Paid_Kms, Unpaid_kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts, Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK, Gov_Sub_Manual, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
              formValues.date,
              formValues.day,
              formValues.shift,
              formValues.Taxi,
              formValues.numberofJobs,
              formValues.insurancefee,
              formValues.hours,
              formValues.totallevy,
              formValues.carwash,
              formValues.meter1,
              formValues.meter2,
              formValues.totalmeter,
              formValues.commissiongtn,
              formValues.commissiondriver,
              formValues.km1,
              formValues.km2,
              formValues.resultkm,
              formValues.paidkm1,
              formValues.paidkm2,
              formValues.resultpaidkm,
              formValues.unpaidkm,
              formValues.eftpos,
              formValues.eftposlifting,
              formValues.cc,
              formValues.chargeAuthority,
              formValues.manualMptp,
              formValues.numberofmanuallifting,
              formValues.totallifting,
              formValues.misc,
              formValues.accountFuel,
              netPayin,
              formValues.manuallifting,
              formValues.numberofChairs,
              formValues.gtnLFee,
              formValues.driverLFee,
              deduction,
              formValues.govSubManual31,
              formValues.cpk,
              formValues.manualMptp,
              formValues.drivercommrate,
              formValues.companycommrate,
            ],
            (_tx: Transaction, results: ResultSet) => {
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
            },
          );
        });
      } else {
        console.log('db is undefined');
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
                netPayin: Dnetpayin.toFixed(2),
              }));
              alertConfirm('Wish to Submit?', () =>
                executeSqlQuery(Ddeductions, Dnetpayin),
              );
            },
          },
          {
            text: "Company's ?",
            onPress: () => {
              setFormValues(prevState => ({
                ...prevState,
                deductions: Cdeductions.toFixed(2),
                netPayin: Cnetpayin.toFixed(2),
              }));
              alertConfirm('Wish to Submit?', () =>
                executeSqlQuery(Cdeductions, Cnetpayin),
              );
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
        netPayin: Cnetpayin.toFixed(2),
      }));
      alertConfirm('Wish to Submit?', () =>
        executeSqlQuery(Cdeductions, Cnetpayin),
      );
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
    setFormValues(prevState => ({
      ...prevState,
      chargeAuthority: num.toFixed(2),
    }));
    setcalculatormodalvisible(!formValues.calculatormodalvisible);
  };
  let CCcalculator = (num: Number) => {
    setFormValues(prevState => ({...prevState, cc: num.toFixed(2)}));
    setcalculatormodalvisible(!formValues.calculatormodalvisible);
  };
  let Cancelcalculator = () => {
    setcalculatormodalvisible(!formValues.calculatormodalvisible);
  };

  let pushcab = async () => {
    if (!formValues.rego) {
      Alert.alert('Please put rego in.');
    } else {
      try {
        const res = await insertIntoCab(db, formValues.rego);
        if (res.rowsAffected > 0) {
          navigation.navigate('HomeScreen');
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
                navigation.navigate('HomeScreen');
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
    navigation.navigate('HomeScreen');
  };
  const Invisible = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      liftingmodalvisible: !prevValues.liftingmodalvisible,
    }));
  };

  const inputs = [
    {title: 'Lifting Total', name: 'liftingtotal', nextInput: 'hoursworked'},
    {title: 'Lifting Driver', name: 'liftingdriver', nextInput: 'hoursworked'},
    {title: 'Lifting Company', name: 'liftingcompany', nextInput: 'insurance'},
    {title: 'Levy', name: 'levy', nextInput: 'hoursworked'},
    {
      title: 'Driver Commission Rate',
      name: 'drivercommrate',
      nextInput: 'hoursworked',
    },
    {
      title: 'Company Commission Rate',
      name: 'companycommrate',
      nextInput: 'job',
    },
    {
      title: 'Lifting Modal Visible',
      name: 'liftingmodalvisible',
      nextInput: 'job',
    },
    {title: 'Shift', name: 'shift', nextInput: 'job'},
    {title: 'Hours Worked', name: 'hours', nextInput: 'job'},
    {title: 'Number of Jobs', name: 'numberofJobs', nextInput: 'fuel'},
    {title: 'Total Levy', name: 'totallevy', nextInput: 'meterstart'},
    {title: 'Insurance Fee', name: 'insurancefee', nextInput: 'meterstart'},
    {title: 'Meter 1', name: 'meter1', nextInput: 'meterstart'},
    {title: 'Meter 2', name: 'meter2', nextInput: 'meterfinish'},
    {title: 'Total Meter', name: 'totalmeter', nextInput: 'meterfinish'},
    {title: 'KM 1', name: 'km1', nextInput: 'kmstart'},
    {title: 'KM 2', name: 'km2', nextInput: 'kmfinish'},
    {title: 'Result KM', name: 'resultkm', nextInput: 'paidkmstart'},
    {title: 'Paid KM 1', name: 'paidkm1', nextInput: 'paidkmstart'},
    {title: 'Paid KM 2', name: 'paidkm2', nextInput: 'paidkmfinish'},
    {title: 'Unpaid KM', name: 'unpaidkm', nextInput: 'sbmt'},
    {title: 'CPK', name: 'cpk', nextInput: 'sbmt'},
    {title: 'Result Paid KM', name: 'resultpaidkm', nextInput: 'sbmt'},
    {title: 'EFTPOS', name: 'eftpos', nextInput: 'gsm'},
    {title: 'EFTPOS Lifting', name: 'eftposlifting', nextInput: 'gsm31'},
    {title: 'CC', name: 'cc', nextInput: 'manualmptp'},
    {
      title: 'Manual MPTP',
      name: 'manualMptp',
      nextInput: 'noofmanualmptplifts',
    },
    {
      title: 'Government Subsidy Manual',
      name: 'govSubManual31',
      nextInput: 'eftps',
    },
    {title: 'Cab Data', name: 'cabData', nextInput: 'eftposliftingfee'},
    {title: 'Taxi', name: 'Taxi', nextInput: 'docket'},
    {
      title: 'Number of Manual Lifting',
      name: 'numberofmanuallifting',
      nextInput: 'docket',
    },
    {title: 'Manual Lifting', name: 'manuallifting', nextInput: 'charge'},
    {title: 'Charge Authority', name: 'chargeAuthority', nextInput: 'mis'},
    {title: 'Misc', name: 'misc', nextInput: 'wash'},
    {title: 'Car Wash', name: 'carwash', nextInput: 'fuel'},
    {title: 'Account Fuel', name: 'accountFuel', nextInput: 'meterstart'},
    {title: 'Total Lifting', name: 'totallifting', nextInput: 'meterfinish'},
    {title: 'Number of Chairs', name: 'numberofChairs', nextInput: 'kmstart'},
    {title: 'GTN Lifting Fee', name: 'gtnLFee', nextInput: 'kmfinish'},
    {title: 'Driver Lifting Fee', name: 'driverLFee', nextInput: 'paidkmstart'},
    {title: 'Deductions', name: 'deductions', nextInput: 'paidkmfinish'},
    {title: 'Date', name: 'date', nextInput: 'sbmt'},
    {title: 'Day', name: 'day', nextInput: 'sbmt'},
    {title: 'Commission GTN', name: 'commissiongtn', nextInput: 'sbmt'},
    {title: 'Commission Driver', name: 'commissiondriver', nextInput: 'gsm'},
    {title: 'Fare', name: 'fare', nextInput: 'gsm31'},
    {title: 'Net Pay In', name: 'netpayin', nextInput: 'manualmptp'},
    {
      title: 'Driver Income',
      name: 'driverIncome',
      nextInput: 'noofmanualmptplifts',
    },
    {title: 'Rego Modal', name: 'regomodal', nextInput: 'eftps'},
    {title: 'Rego', name: 'rego', nextInput: 'eftposliftingfee'},
    {
      title: 'Calculator Modal Visible',
      name: 'calculatormodalvisible',
      nextInput: 'docket',
    },
    {title: 'Number of Entries', name: 'numberofEntries', nextInput: 'charge'},
    {title: 'Indicator', name: 'indicator', nextInput: 'mis'},
  ];

  const onChange = (name: string, value: string | boolean) => {
    setFormValues(prevValues => ({...prevValues, [name]: value}));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {inputs.map(input => (
          <MyTextInput
            key={input.name}
            title={input.title}
            value={formValues[input.name]}
            onChangeText={(value: string) => onChange(input.name, value)}
            nextInputRef={inputRefs[input.nextInput]}
          />
        ))}
      </ScrollView>

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
     {/*  <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={{color: '#ffffff', fontSize: 18, textAlign: 'center'}}>
          Total Number of Entries: {formValues.numberofEntries}
        </Text>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee</Text>
          <TextInput            
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={formValues.liftingtotal}
          />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Driver's Share {'\n'}in lifting fee
          </Text>
          <TextInput            
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={formValues.liftingdriver}
          />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Levy</Text>
          <TextInput            
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={formValues.levy}
          />
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Driver's Commission{'\n'}Rate(%)</Text>
          <TextInput            
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={formValues.drivercommrate}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={!formValues.liftingmodalvisible}>
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
          <Text style={styles.titleText}>Shift</Text>
          <TextInput
            placeholder="............"
            placeholderTextColor="#ffffff"
            editable={false}
            style={styles.textInput}>
            <Text style={styles.titleText}>{formValues.shift}</Text>
          </TextInput>
          <Picker
            selectedValue={formValues.shift}
            style={{marginTop: -30, marginBottom: -30, width: 100}}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValues => ({...prevValues, shift: itemValue}));
            }}>
            <Picker.Item label="Select" value="  " />
            <Picker.Item label="Day" value="Day" />
            <Picker.Item label="Night" value="Night" />
            <Picker.Item label="Evening" value="Evening" />
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
          <Text style={styles.titleText}>Rego</Text>
          <TextInput
            placeholder="............"
            placeholderTextColor="#ffffff"
            editable={false}
            style={styles.textInput}>
            <Text style={styles.titleText}>{formValues.Taxi}</Text>
          </TextInput>
          <Picker
            selectedValue={formValues.Taxi}
            style={{marginBottom: -30, marginTop: -30, width: 100}}
            onValueChange={(itemValue: string) => {
              setFormValues(prevValue => ({...prevValue, Taxi: itemValue}));
            }}>
            <Picker.Item label="Select" key=" " value=" " />
            {formValues.cabData.map((cab: string, i: number) => (
              <Picker.Item label={cab} key={i} value={cab} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={!formValues.regomodal}>
          <Text style={styles.buttontext}>Registration Number</Text>
        </TouchableOpacity>

        <Modal
          visible={formValues.regomodal}
          animationType={'fade'}
          onRequestClose={() => {}}>
          <View style={styles.model}>
            <Text style={{color: '#000000'}}>
              Please add vehcle's registration number.
            </Text>
            <TextInput
              placeholder="Enter Rego"
              //keyboardType='numeric'
              keyboardType="numbers-and-punctuation"
              placeholderTextColor="#000000"
              style={{
                marginTop: 30,
                borderColor: '#000000',
                borderBottomWidth: 1,
                textAlign: 'center',
                color: '#000000',
              }}
              setText={(num: string) =>
                setFormValues(prevValues => ({...prevValues, rego: num}))
              }>
              <Text style={styles.titletext}>{formValues.rego}</Text>
            </TextInput>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <MyButton title="Add" customClick={pushcab} />
              <MyButton title="Delete" customClick={deletecab} />
              <MyButton title="Cancel" customClick={formValues.regomodal} />
            </View>
          </View>
        </Modal>

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

         <MyTextInput
          title="Account Fuel"
          value={formValues.accountFuel}
          onChangeText={(text: string) => {
            setFormValues(prevValues => ({...prevValues, accountFuel: text}));
          }}
          nextInputRef={inputRefs.hoursworked}
        />
        <MyTextInput
          title="Hours Worked"
          value={formValues.hours}
          onChangeText={(text: string) => {
            setFormValues(prevValues => ({...prevValues, hours: text}));
          }}
          nextInputRef={inputRefs.fuel}
        />
        <MyTextInput
          title="Jobs"
          value={formValues.numberofJobs}
          onChangeText={(text: string) => {
            setFormValues(prevValues => ({...prevValues, numberofJobs: text}));
          }}
          nextInputRef={inputRefs.job}
        />

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={formValues.totallevy}
          />
        </View>

        <MyTextInput
          title="Misc"
          value={formValues.misc}
          onChangeText={(value: string) =>
            setFormValues(prevValues => ({...prevValues, misc: value}))
          }
          nextInputRef={inputRefs.mis}
        />

        <MyTextInput
          title="Car Wash"
          value={formValues.carwash}
          onChangeText={(value: string) =>
            setFormValues(prevValues => ({...prevValues, carwash: value}))
          }
          nextInputRef={inputRefs.wash}
        /> 

        <TouchableOpacity
          style={styles.button}
          onPress={() => setcalculatormodalvisible(!calculatormodalvisible)}>
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
          Shift Details
        </Text>
        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Payin Details
        </Text>
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
            if (date) {
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
      </View> */}
    </SafeAreaView>
  );
};

export default EnterData;

function setcalculatormodalvisible(arg0: boolean) {
  throw new Error('Function not implemented.');
}
