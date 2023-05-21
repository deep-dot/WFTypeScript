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
  Modal,
} from 'react-native';
import Model from '../../Components/Model';
import Mybutton from '../../Components/Mybutton';
import {Picker} from '@react-native-picker/picker';
import Calculator from '../../Components/Calculator';
import Calendar from '../../Components/Calendar';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './EnterDataScreen.style';
//import envs from '../../config/env';
import db from '../../databaseService';
import {Transaction, ResultSet} from '../../databaseTypes';
import {
  calculateDriverLFee,
  calculatePaidKm,
  calculateNumberofChairs,
} from './Utility';
import {
  insertIntoCab,
  selectFromCab,
  selectFromUpdateItems,
  selectCountFromDataTable,
} from './dbUtility';
import {StateContext} from './StateProvider';

import type {DrawerScreenProps} from '@react-navigation/drawer';
type DrawerParamList = {
  'Enter Data': undefined;
};
type Props = DrawerScreenProps<DrawerParamList, 'Enter Data'>;

const EnterData = ({navigation}: Props) => {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  //console.log('state in EnterDataScreen==', state);

  const [liftingtotal, setLiftingtotal] = useState<string>('');
  const [liftingdriver, setliftingdriver] = useState<string>('');
  const [liftingcompany, setliftingcompany] = useState<string>('');
  const [levy, setLevy] = useState<string>('');
  const [drivercommrate, setDrivercommrate] = useState<string>('');
  const [companycommrate, setCompanycommrate] = useState<string>('');
  const [liftingmodalvisible, setLiftingmodalvisible] =
    useState<boolean>(false);

  //const [driverName, setDriverName] = React.useState<string>('');
  const [shift, setshift] = useState<string>('');
  const [hours, onChangeHours] = useState<string>('');
  const [numberofJobs, setNumberofJobs] = useState<string>('');

  const [totallevy, setTotalLevy] = useState<string>('');
  const [insurancefee, onChangeInsuranceFee] = useState<string>('');
  const [meter1, setmeter1] = useState<string>('');
  const [meter2, setmeter2] = useState<string>('');
  const [totalmeter, settotalmeter] = useState<string>('');
  const [km1, setkm1] = useState<string>('');
  const [km2, setkm2] = useState<string>('');
  const [resultkm, setResultkm] = useState<string>('');
  const [paidkm1, setpaidkm1] = useState<string>('');
  const [paidkm2, setpaidkm2] = useState<string>('');
  const [unpaidkm, setUnpaidkm] = useState<string>('');
  const [cpk, setCpk] = useState<string>(0);
  const [resultpaidkm, setResultpaidkm] = useState<string>('');
  const [eftpos, onChangeEftpos] = useState<string>('');
  const [eftposlifting, setEftposLifting] = useState<string>('');
  const [cc, onChangeCc] = useState<string>('');
  const [manualMptp, setManualMptp] = useState<string>('');
  const [govSubManual31, setGovSubManual31] = useState<string>('');
  const [cabData, setcabData] = useState<CabDataItem[]>([]);
  const [Taxi, setTaxi] = useState<string>('');
  const [numberofmanuallifting, setNumberofManualLifting] =
    useState<string>('');
  const [manuallifting, setManualLifting] = useState<string>('');
  const [chargeAuthority, onChangeChargeAuthority] = useState<string>('');
  const [misc, onChangeMisc] = useState<string>('');
  const [carwash, onChangeCarWash] = useState<string>('');
  const [accountFuel, onChangeAccountFuel] = useState<string>('');
  const [totallifting, setTotalLifting] = useState<string>('');
  const [numberofChairs, setNumberofChairs] = useState<string>('');
  const [gtnLFee, setGtnLFee] = useState<string>('');
  const [driverLFee, setDriverLFee] = useState<string>('');
  const [deductions, setDeductions] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [day, setDay] = useState<string>('');

  const [commissiongtn, setCommissiongtn] = useState<string>('');
  const [commissiondriver, setCommissiondriver] = useState<string>('');
  const [fare, setFare] = useState<string>('');
  const [netpayin, setNetpayin] = useState<string>('');
  const [driverIncome, setDriverIncome] = useState<string>('');
  // regomodal
  const [regomodal, setRegomodal] = useState<boolean>(false);
  const [rego, setRego] = useState<string>('');
  const [calculatormodalvisible, setcalculatormodalvisible] =
    useState<boolean>(false);
  const [numberofEntries, setNumberofEntries] = useState<string>('');
  const [indicator, _setIndicator] = useState<boolean>(false);

  const calculatekm = () => {
    setResultkm((Number(km2) - Number(km1)).toFixed(2));
    paidkmstart.focus();
  };
  const calculatemeter = () => {
    settotalmeter(
      (Number(meter2) - Number(totallevy) - Number(meter1)).toFixed(2),
    );
    kmstart.focus();
  };
  const Totallevy = () => {
    setTotalLevy((Number(numberofJobs) * Number(levy)).toFixed(2));
    mis.focus();
  };

  const calculateUnpaidkm = () => {
    setUnpaidkm((Number(resultkm) - Number(resultpaidkm)).toFixed(2));
  };
  const calculateManualLifting = () => {
    setManualLifting(
      (Number(numberofmanuallifting) * Number(liftingtotal)).toFixed(2),
    );
    calculateUnpaidkm();
    eftps.focus();
  };
  const calculateTotalLifting = () => {
    let a = Number(numberofmanuallifting) * Number(liftingtotal);
    let b = Number(eftposlifting);
    setTotalLifting((a + b).toFixed(2));
    //calculateNumberofChairs();
  };

  useEffect(() => {
    const {resultPaidKm, commissionDriver, commissionGtn, newCpk} =
      calculatePaidKm(
        Number(paidkm1),
        Number(paidkm2),
        Number(totalmeter),
        Number(drivercommrate),
        Number(companycommrate),
        Number(resultkm),
        Number(cpk),
      );
    setResultpaidkm(resultPaidKm.toFixed(2));
    setCommissiondriver(commissionDriver.toFixed(2));
    setCommissiongtn(commissionGtn.toFixed(2));
    setCpk(newCpk.toFixed(2));

    const [numberOfChairs, newGtnLFee] = calculateNumberofChairs(
      Number(numberofmanuallifting),
      Number(eftposlifting),
      Number(liftingtotal),
      Number(liftingcompany),
    );
    setNumberofChairs(numberOfChairs.toFixed(0));
    setGtnLFee(newGtnLFee.toFixed(2));

    const result = calculateDriverLFee(
      Number(liftingtotal),
      Number(eftposlifting),
      Number(liftingdriver),
      Number(numberofmanuallifting),
      Number(totalmeter),
      Number(hours),
    );
    setDriverLFee(result.driverLFee.toFixed(2));
    setFare(result.fare.toFixed(2));
  }, [
    numberofmanuallifting,
    eftposlifting,
    liftingtotal,
    liftingcompany,
    liftingdriver,
    totalmeter,
    hours,
    paidkm1,
    paidkm2,
    drivercommrate,
    companycommrate,
    resultkm,
    cpk,
  ]);

  let submitalltogather = () => {
    let A = numberofmanuallifting;
    let B;
    if (Number(liftingtotal) > 0) {
      B = Number(eftposlifting) / Number(liftingtotal);
    } else {
      B = 0;
    }
    let kullnumberofchairs = A + B;
    let kulldriverlfee = Number(kullnumberofchairs) * Number(liftingdriver);
    let a = Number(eftpos);
    let a1 = Number(eftposlifting);
    let b = Number(govSubManual31);
    let c = Number(manualMptp);
    let d = Number(cc);
    let e = Number(chargeAuthority);
    //let f =dNumber(riverLFee);
    let f = Number(kulldriverlfee);
    let g = Number(carwash);
    let h = Number(accountFuel);
    let i = Number(misc);
    let kulllevy = Number(numberofJobs) * Number(levy);
    let kullmeter = Number(meter2) - Number(meter1) - kulllevy;
    let kullkm = Number(km2) - Number(km1);
    let kullpaidkm = Number(paidkm2) - Number(paidkm1);
    let kullunpaidkm = kullkm - kullpaidkm;
    let kullmanuallifting =
      Number(numberofmanuallifting) * Number(liftingtotal);
    let kulltotallifting = kullmanuallifting + a1;
    let kullgtnlfee = Number(kullnumberofchairs) * Number(liftingcompany);
    let kullcommdriver = kullmeter * (Number(drivercommrate) / 100);
    let kullcommgtn = kullmeter * (Number(companycommrate) / 100);

    let Cdeductions = a - a1 + b + c + d + e + f;
    let Ddeductions = a - a1 + b + c + d + e + f + g + h + i;

    let Cnetpayin = kullcommgtn - Cdeductions;
    let Dnetpayin = kullcommgtn - Ddeductions;
    let driverincome = kulldriverlfee + kullcommdriver;
    if (kullkm > 0) {
      let kullcpk = kullmeter / kullkm;
      setCpk(kullcpk.toFixed(2));
    } else {
      setCpk('0.00');
    }
    if (Number(hours) > 0) {
      setFare((Number(totalmeter) / Number(hours)).toFixed(2));
    } else {
      setFare('0.00');
    }
    setCommissiondriver(kullcommdriver.toFixed(2));
    setCommissiongtn(kullcommgtn.toFixed(2));
    setTotalLevy(kulllevy.toFixed(2));
    settotalmeter(kullmeter.toFixed(2));
    setResultkm(kullkm.toFixed(2));
    setResultpaidkm(kullpaidkm.toFixed(2));
    setUnpaidkm(kullunpaidkm.toFixed(2));
    setManualLifting(kullmanuallifting.toFixed(2));
    setTotalLifting(kulltotallifting.toFixed(2));
    setNumberofChairs(kullnumberofchairs);
    setGtnLFee(kullgtnlfee.toFixed(2));
    setDriverLFee(kulldriverlfee.toFixed(2));
    setDriverIncome(driverincome.toFixed(2));

    if (Number(accountFuel) > 0 || Number(carwash) > 0 || Number(misc) > 0) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's ?",
            onPress: () => {
              setDeductions(Ddeductions.toFixed(2));
              setNetpayin(Dnetpayin.toFixed(2));
              //setDriverIncome(Number(Ddriverincome).toFixed(2));
              Alert.alert(
                'Please confirm!',
                'Wish to Submit?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      if (db) {
                        db.transaction((txn: Transaction) => {
                          txn.executeSql(
                            'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs, Ins, Hours_Worked, Total_Levy, Car_Wash, Meter_Start, Meter_Finish, Shift_Total, Com_GTN, Com_Driver, Km_Start, Km_Finish, Kms, Paidkm_Start, Paidkm_Finish, Paid_Kms, Unpaid_kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts, Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK, Gov_Sub_Manual, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                              date,
                              day,
                              shift,
                              Taxi,
                              numberofJobs,
                              insurancefee,
                              hours,
                              totallevy,
                              carwash,
                              meter1,
                              meter2,
                              totalmeter,
                              commissiongtn,
                              commissiondriver,
                              km1,
                              km2,
                              resultkm,
                              paidkm1,
                              paidkm2,
                              resultpaidkm,
                              unpaidkm,
                              eftpos,
                              eftposlifting,
                              cc,
                              chargeAuthority,
                              manualMptp,
                              numberofmanuallifting,
                              totallifting,
                              misc,
                              accountFuel,
                              Dnetpayin,
                              manuallifting,
                              numberofChairs,
                              gtnLFee,
                              driverLFee,
                              Ddeductions,
                              govSubManual31,
                              cpk,
                              manualMptp,
                              drivercommrate,
                              companycommrate,
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
                                        navigation.navigate('HomeScreen');
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
                    },
                  },
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              );
            },
          },
          {
            text: "Company's ?",
            onPress: () => {
              setDeductions(Cdeductions.toFixed(2));
              setNetpayin(Cnetpayin.toFixed(2));
              //setDriverIncome(Number(Cdriverincome).toFixed(2));
              Alert.alert(
                'Please confirm!',
                'Wish to Submit?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      if (db) {
                        db.transaction((txn: Transaction) => {
                          txn.executeSql(
                            'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs, Ins, Hours_Worked, Total_Levy, Car_Wash, Meter_Start, Meter_Finish, Shift_Total, Com_GTN, Com_Driver, Km_Start, Km_Finish, Kms, Paidkm_Start, Paidkm_Finish, Paid_Kms, Unpaid_kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts, Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK, Gov_Sub_Manual, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                              date,
                              day,
                              shift,
                              Taxi,
                              numberofJobs,
                              insurancefee,
                              hours,
                              totallevy,
                              carwash,
                              meter1,
                              meter2,
                              totalmeter,
                              commissiongtn,
                              commissiondriver,
                              km1,
                              km2,
                              resultkm,
                              paidkm1,
                              paidkm2,
                              resultpaidkm,
                              unpaidkm,
                              eftpos,
                              eftposlifting,
                              cc,
                              chargeAuthority,
                              manualMptp,
                              numberofmanuallifting,
                              totallifting,
                              misc,
                              accountFuel,
                              Cnetpayin,
                              manuallifting,
                              numberofChairs,
                              gtnLFee,
                              driverLFee,
                              Cdeductions,
                              govSubManual31,
                              cpk,
                              manualMptp,
                              drivercommrate,
                              companycommrate,
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
                                        navigation.navigate('HomeScreen');
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
                    },
                  },
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
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
      setDeductions(Cdeductions.toFixed(2));
      setNetpayin(Cnetpayin.toFixed(2));
      //setDriverIncome(Number(Cdriverincome).toFixed(2));
      Alert.alert(
        'Please confirm!',
        'Wish to Submit?',
        [
          {
            text: 'Yes',
            onPress: () => {
              if (db) {
                db.transaction((txn: Transaction) => {
                  txn.executeSql(
                    'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs, Ins, Hours_Worked, Total_Levy, Car_Wash, Meter_Start, Meter_Finish, Shift_Total, Com_GTN, Com_Driver, Km_Start, Km_Finish, Kms, Paidkm_Start, Paidkm_Finish, Paid_Kms, Unpaid_kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts, Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK, Gov_Sub_Manual, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [
                      date,
                      day,
                      shift,
                      Taxi,
                      numberofJobs,
                      insurancefee,
                      hours,
                      totallevy,
                      carwash,
                      meter1,
                      meter2,
                      totalmeter,
                      commissiongtn,
                      commissiondriver,
                      km1,
                      km2,
                      resultkm,
                      paidkm1,
                      paidkm2,
                      resultpaidkm,
                      unpaidkm,
                      eftpos,
                      eftposlifting,
                      cc,
                      chargeAuthority,
                      manualMptp,
                      numberofmanuallifting,
                      totallifting,
                      misc,
                      accountFuel,
                      Cnetpayin,
                      manuallifting,
                      numberofChairs,
                      gtnLFee,
                      driverLFee,
                      Cdeductions,
                      govSubManual31,
                      cpk,
                      manualMptp,
                      drivercommrate,
                      companycommrate,
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
                                navigation.navigate('HomeScreen');
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
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  };

  let hoursworked: any,
    insurance: any,
    job: any,
    lev: any,
    fuel: any,
    meterstart: any,
    meterfinish: any,
    kmstart: any,
    kmfinish: any,
    paidkmstart: any,
    paidkmfinish: any,
    sbmt: any,
    gsm: any,
    gsm31: any,
    manualmptp: any,
    noofmanualmptplifts: any,
    eftps: any,
    eftposliftingfee: any,
    docket: any,
    charge: any,
    mis: any,
    wash: any;

  const Refresh = () => {
    dispatch({type: 'REFRESH'});
    onChangeInsuranceFee('');
  };
  //number of Entries
  useEffect(() => {
    const fetchUpdateItemsData = async () => {
      try {
        const res = await selectFromUpdateItems(db);
        updateallstates(
          res.GovLFee,
          res.CompanyLFee,
          res.DriverLFee,
          res.Levy,
          res.Driver_Comm_Rate,
          res.Company_Comm_Rate,
        );
      } catch (error) {
        console.log(error);
      }
    };
    const fetchCabData = async () => {
      try {
        const res = await selectFromCab(db);
        setcabData(res);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchNumberOfEntries = async () => {
      try {
        const numberOfEntries = await selectCountFromDataTable(db);
        setNumberofEntries(numberOfEntries);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpdateItemsData();
    fetchCabData();
    fetchNumberOfEntries();
  }, [setNumberofEntries]);

  let updateallstates = (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ) => {
    setLiftingtotal(a.toFixed(2));
    setliftingcompany(b.toFixed(2));
    setliftingdriver(c.toFixed(2));
    setLevy(d.toFixed(2));
    setDrivercommrate(e.toFixed(0));
    setCompanycommrate(f.toFixed(0));
  };

  //calculator...
  let Authoritycalculator = (num: number) => {
    onChangeChargeAuthority(num.toFixed(2));
    setcalculatormodalvisible(!calculatormodalvisible);
  };
  let CCcalculator = (num: number) => {
    onChangeCc(num.toFixed(2));
    setcalculatormodalvisible(!calculatormodalvisible);
  };
  let Cancelcalculator = () => {
    setcalculatormodalvisible(!calculatormodalvisible);
  };

  let pushcab = async () => {
    if (!rego) {
      Alert.alert('Please put rego in.');
    } else {
      try {
        const res = await insertIntoCab(db, rego);
        if (res.rowsAffected > 0) {
          navigation.navigate('HomeScreen');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  type CabDataItem = {
    Cab: string;
  };

  const deletecab = () => {
    if (!rego) {
      Alert.alert('Please put rego in.');
    } else {
      if (db) {
        db.transaction((txn: Transaction) => {
          txn.executeSql(
            'DELETE FROM cab where Cab = ?',
            [rego],
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
    setLiftingmodalvisible(!liftingmodalvisible);
    navigation.navigate('HomeScreen');
  };
  const Invisible = () => {
    setLiftingmodalvisible(!liftingmodalvisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        show={indicator}
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={false}
      />

      <Calculator
        calculatorVisible={calculatormodalvisible}
        Cancelcalcu={Cancelcalculator}
        Docketcalcu={CCcalculator}
        CAcalcu={Authoritycalculator}
      />

      <Model
        modvisible={liftingmodalvisible}
        onCancel={Invisible}
        onupdate={Onupdate}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={{color: '#ffffff', fontSize: 18, textAlign: 'center'}}>
          Total Number of Entries: {numberofEntries}
        </Text>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee</Text>
          <TextInput
            //placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{liftingtotal}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Driver's Share {'\n'}in lifting fee
          </Text>
          <TextInput
            // placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{liftingdriver}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Levy</Text>
          <TextInput
            //placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{levy}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Driver's Commission{'\n'}Rate(%)</Text>
          <TextInput
            // placeholder="00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{drivercommrate}</Text>
          </TextInput>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setLiftingmodalvisible(true)}>
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
            <Text style={styles.titleText}>{shift}</Text>
          </TextInput>
          <Picker
            selectedValue={shift}
            style={{marginTop: -30, marginBottom: -30, width: 100}}
            onValueChange={itemValue => setshift(itemValue)}>
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
            <Text style={styles.titleText}>{Taxi}</Text>
          </TextInput>
          <Picker
            selectedValue={Taxi}
            style={{marginBottom: -30, marginTop: -30, width: 100}}
            onValueChange={itemValue => setTaxi(itemValue)}>
            <Picker.Item label="Select" value=" " />
            {cabData.map((x: {Cab: string}, i: number) => (
              <Picker.Item label={x.Cab} key={i} value={x.Cab} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setRegomodal(true)}>
          <Text style={styles.buttontext}>Registration Number</Text>
        </TouchableOpacity>

        <Modal
          //transparent={true}
          //presentationStyle={'pageSheet'}
          visible={regomodal}
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
              onChangeText={num => setRego(num)}>
              <Text style={styles.titletext}>{rego}</Text>
            </TextInput>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Mybutton title="Add" customClick={pushcab} />
              <Mybutton title="Delete" customClick={deletecab} />
              <Mybutton
                title="Cancel"
                customClick={() => setRegomodal(false)}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.textinputview}>
          <Calendar
            value={date}
            onChange={tareek => setDate(tareek)}
            OnChange={din => setDay(din)}
          />
          <TextInput
            placeholder="Day"
            placeholderTextColor="#ffffff"
            editable={false}>
            <Text style={styles.titleText}>{day}</Text>
          </TextInput>

          <TextInput
            placeholder="Date"
            placeholderTextColor="#ffffff"
            style={styles.Textinput}
            //value={date}
            editable={false}
            onSubmitEditing={() => {
              if (!date) {
                Alert.alert('Please input Date');
              } else {
                insurance.focus();
              }
            }}>
            <Text style={styles.titleText}>{date}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Insurance Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            onChangeText={num => onChangeInsuranceFee(num)}
            value={insurancefee}
            ref={input => {
              insurance = input;
            }}
            onSubmitEditing={() => {
              let num = parseFloat((parseFloat(insurancefee) / 100).toFixed(2));
              if (isNaN(num)) {
                Alert.alert('Please input a number only');
              } else {
                onChangeInsuranceFee(insurancefee);
                fuel.focus();
              }
            }}
          />
        </View>
        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Account Fuel</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            // keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeAccountFuel(num)}
            value={accountFuel}
            ref={input => {
              fuel = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(accountFuel))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeAccountFuel(accountFuel);
                hoursworked.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{accountFuel}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Hours Worked</Text>
          <TextInput
            placeholder="0.0"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeHours(num)}
            value={hours}
            ref={input => {
              hoursworked = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(hours))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeHours(hours);
                job.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{hours}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>No. of Jobs</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#ffffff"
            //keyboardType="numeric"
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            style={styles.textInput}
            onChangeText={num => setNumberofJobs(num)}
            value={numberofJobs}
            ref={input => {
              job = input;
            }}
            onSubmitEditing={() => {
              if (!numberofJobs) {
                Alert.alert('Please input number of jobs');
              } else {
                setNumberofJobs(numberofJobs);
                Totallevy();
              }
            }}>
            {/* <Text style={styles.titleText}>{numberofJobs}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{totallevy}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Misc</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeMisc(num)}
            value={misc}
            //returnKeyType="next"
            ref={input => {
              mis = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(misc))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeMisc(misc);
                wash.focus();
              }
            }}
            blurOnSubmit={false}>
            {/* <Text style={styles.titleText}>{misc}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Car Wash</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeCarWash(num)}
            value={carwash}
            //returnKeyType="next"
            ref={input => {
              wash = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(carwash))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCarWash(carwash);
                meterstart.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{carwash}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Meter Start</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setmeter1(num)}
            value={meter1}
            ref={input => {
              meterstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(meter1))) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter1(meter1);
                meterfinish.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{meter1}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Meter Finish</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setmeter2(num)}
            value={meter2}
            ref={input => {
              meterfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(meter2))) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter2(meter2);
                calculatemeter();
              }
            }}>
            {/* <Text style={styles.titleText}>{meter2}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Total - Total Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={totalmeter}>
            {/* <Text style={styles.titletext}>{totalmeter}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Km Start</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setkm1(num)}
            value={km1}
            ref={input => {
              kmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(km1))) {
                Alert.alert('Please input a correct number');
              } else {
                setkm1(km1);
                kmfinish.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{km1}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Km Finish</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setkm2(num)}
            value={km2}
            ref={input => {
              kmfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(km2))) {
                Alert.alert('Please input a correct number');
              } else {
                setkm2(km2);
                calculatekm();
              }
            }}>
            {/* <Text style={styles.titleText}>{km2}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Kms Total</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={resultkm}>
            {/* <Text style={styles.titletext}>{resultkm}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>CPK</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={cpk}>
            {/* <Text style={styles.titletext}>{cpk}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Paid Km Start</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setpaidkm1(num)}
            value={paidkm1}
            ref={input => {
              paidkmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(paidkm1))) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm1(paidkm1);
                paidkmfinish.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{paidkm1}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Paid Km Finish</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setpaidkm2(num)}
            value={paidkm2}
            ref={input => {
              paidkmfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(paidkm2))) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm2(paidkm2);
                //calculatepaidkm();
              }
            }}>
            {/* <Text style={styles.titleText}>{paidkm2}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Paid Kms Total</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={resultpaidkm}>
            {/* <Text style={styles.titletext}>{resultpaidkm}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Gov-Sub-Manual{'\n'}value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={text => setManualMptp(text)}
            value={manualMptp}
            ref={input => {
              gsm = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(manualMptp))) {
                Alert.alert('Please input a correct number');
              } else {
                setManualMptp(manualMptp);
                gsm31.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{manualMptp}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Gov-Sub-Manual-31{'\n'}value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={text => setGovSubManual31(text)}
            value={govSubManual31}
            ref={input => {
              gsm31 = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(govSubManual31))) {
                Alert.alert('Please input a correct number');
              } else {
                setGovSubManual31(govSubManual31);
                noofmanualmptplifts.focus();
              }
            }}>
            {/* <Text style={styles.titleText}>{govSubManual31}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>No.of Manual Lifts</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={text => setNumberofManualLifting(text)}
            value={numberofmanuallifting}
            ref={input => {
              noofmanualmptplifts = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(numberofmanuallifting))) {
                Alert.alert('Please input a correct number');
              } else {
                setNumberofManualLifting(numberofmanuallifting);
                calculateManualLifting();
              }
            }}>
            {/* <Text style={styles.titleText}>{numberofmanuallifting}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Manual L/F Value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}
            value={manuallifting}>
            {/* <Text style={styles.titletext}>{manuallifting}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Eftpos</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeEftpos(num)}
            value={eftpos}
            ref={input => {
              eftps = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(eftpos))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeEftpos(eftpos);
                eftposliftingfee.focus();
              }
            }}
            blurOnSubmit={false}>
            {/* <Text style={styles.titleText}>{eftpos}</Text> */}
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Eftpos lifting Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => setEftposLifting(num)}
            //value={eftposlifting}
            ref={input => {
              eftposliftingfee = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(eftposlifting))) {
                Alert.alert('Please input a correct number');
              } else {
                setEftposLifting(eftposlifting);
                calculateTotalLifting();
              }
            }}>
            <Text style={styles.titleText}>{eftposlifting}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Dockets</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            // width="50%"
            style={styles.textInput}
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeCc(num)}
            ref={input => {
              docket = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(cc))) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCc(cc);
                charge.focus();
              }
            }}>
            <Text style={styles.titleText}>{cc}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>ChargeAuthority</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            returnKeyType="next"
            keyboardType="numeric"
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeChargeAuthority(num)}
            style={styles.textInput}
            ref={input => {
              charge = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(chargeAuthority))) {
                Alert.alert('Please input a correct number');
                //option();
              } else {
                onChangeChargeAuthority(chargeAuthority);
                Alert.alert(
                  'Press Submit Button to submit.',
                  '',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        //Deductionsdriveredition();
                      },
                    },
                  ],
                  {cancelable: true},
                );
              }
            }}>
            <Text style={styles.titleText}>{chargeAuthority}</Text>
          </TextInput>
        </View>

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

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Unpaid Kms</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{unpaidkm}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{totallifting}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>No of Chairs</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{numberofChairs}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Company Lifting Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{gtnLFee}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Driver Lifting Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{driverLFee}</Text>
          </TextInput>
        </View>

        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Shift Details
        </Text>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Commission Company</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{commissiongtn}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Commission Worker</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{commissiondriver}</Text>
          </TextInput>
        </View>

        <Text
          style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          Payin Details
        </Text>
        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Deductions</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{deductions}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Average Fare</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{fare}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Nett Cash</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{netpayin}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Total Driver Income</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titleText}>{driverIncome}</Text>
          </TextInput>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //backgroundColor: '#c6dbde',
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
      </View>
    </SafeAreaView>
  );
};

export default EnterData;
