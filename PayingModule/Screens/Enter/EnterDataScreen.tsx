/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from 'react';
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
//import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {StateContext} from './StateProvider';

import {DrawerNavigationProp} from '@react-navigation/drawer';
type DrawerParamList = {
  'Enter Data': undefined;
  // Other routes...
};
type EnterDataScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList, 'Enter Data'>;
};

const EnterData: React.FC<EnterDataScreenProps> = ({navigation}) => {

  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;

  const [liftingtotal, setLiftingtotal]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [liftingdriver, setliftingdriver]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [liftingcompany, setliftingcompany]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [levy, setLevy]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [drivercommrate, setDrivercommrate]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [companycommrate, setCompanycommrate]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [liftingmodalvisible, setLiftingmodalvisible] = useState(false);

  //const [driverName, setDriverName] = React.useState('');
  const [shift, setshift] = useState('');
  const [hours, onChangeHours]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [numberofJobs, setNumberofJobs]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);

  const [totallevy, setTotalLevy]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [insurancefee, onChangeInsuranceFee]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [meter1, setmeter1]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [meter2, setmeter2]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [totalmeter, settotalmeter]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [km1, setkm1]: [number, Dispatch<SetStateAction<number>>] = useState(0);
  const [km2, setkm2]: [number, Dispatch<SetStateAction<number>>] = useState(0);
  const [resultkm, setResultkm]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [paidkm1, setpaidkm1]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [paidkm2, setpaidkm2]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [unpaidkm, setUnpaidkm]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [cpk, setCpk]: [number, Dispatch<SetStateAction<number>>] = useState(0);
  const [resultpaidkm, setResultpaidkm]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [eftpos, onChangeEftpos]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [eftposlifting, setEftposLifting]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [cc, onChangeCc]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [manualMptp, setManualMptp]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [govSubManual31, setGovSubManual31]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [cabData, setcabData] = useState<CabDataItem[]>([]);
  const [Taxi, setTaxi] = useState('');
  const [numberofmanuallifting, setNumberofManualLifting]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [manuallifting, setManualLifting]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [chargeAuthority, onChangeChargeAuthority]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [misc, onChangeMisc]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [carwash, onChangeCarWash]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [accountFuel, onChangeAccountFuel]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [totallifting, setTotalLifting]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [numberofChairs, setNumberofChairs]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [gtnLFee, setGtnLFee]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [driverLFee, setDriverLFee]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [deductions, setDeductions]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');

  const [commissiongtn, setCommissiongtn]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [commissiondriver, setCommissiondriver]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [fare, setFare]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [netpayin, setNetpayin]: [number, Dispatch<SetStateAction<number>>] =
    useState(0);
  const [driverIncome, setDriverIncome]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  // regomodal
  const [regomodal, setRegomodal] = useState(false);
  const [rego, setRego] = useState('');
  const [calculatormodalvisible, setcalculatormodalvisible] = useState(false);
  const [numberofEntries, setNumberofEntries]: [
    number,
    Dispatch<SetStateAction<number>>,
  ] = useState(0);
  const [indicator, setIndicator] = useState(false);

  const calculatekm = () => {
    setResultkm(parseFloat((km2 - km1).toFixed(2)));
    //paidkmstart.focus();
  };
  const calculatemeter = () => {
    settotalmeter(parseFloat((meter2 - totallevy - meter1).toFixed(2)));
    // kmstart.focus();
  };
  const Totallevy = () => {
    setTotalLevy(parseFloat((numberofJobs * levy).toFixed(2)));
    //mis.focus();
  };

  const calculateUnpaidkm = () => {
    setUnpaidkm(parseFloat((resultkm - resultpaidkm).toFixed(2)));
  };
  const calculateManualLifting = () => {
    setManualLifting(
      parseFloat((numberofmanuallifting * liftingtotal).toFixed(2)),
    );
    calculateUnpaidkm();
    //eftps.focus();
  };
  const calculateTotalLifting = () => {
    let a = numberofmanuallifting * liftingtotal;
    let b = eftposlifting;
    setTotalLifting(parseFloat((a + b).toFixed(2)));
    //calculateNumberofChairs();
  };

  useEffect(() => {
    const {resultPaidKm, commissionDriver, commissionGtn, newCpk} =
      calculatePaidKm(
        paidkm1,
        paidkm2,
        totalmeter,
        drivercommrate,
        companycommrate,
        resultkm,
        cpk,
      );
    setResultpaidkm(resultPaidKm);
    setCommissiondriver(commissionDriver);
    setCommissiongtn(commissionGtn);
    setCpk(newCpk);

    const [numberOfChairs, newGtnLFee] = calculateNumberofChairs(
      numberofmanuallifting,
      eftposlifting,
      liftingtotal,
      liftingcompany,
    );
    setNumberofChairs(parseFloat(numberOfChairs.toFixed(0)));
    setGtnLFee(parseFloat(newGtnLFee.toFixed(2)));

    const result = calculateDriverLFee(
      liftingtotal,
      eftposlifting,
      liftingdriver,
      numberofmanuallifting,
      totalmeter,
      hours,
    );
    setDriverLFee(result.driverLFee);
    setFare(result.fare);
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
    if (liftingtotal > 0) {
      B = eftposlifting / liftingtotal;
    } else {
      B = 0;
    }
    let kullnumberofchairs = A + B;
    let kulldriverlfee = kullnumberofchairs * liftingdriver;
    let a = eftpos;
    let a1 = eftposlifting;
    let b = govSubManual31;
    let c = manualMptp;
    let d = cc;
    let e = chargeAuthority;
    //let f =driverLFee;
    let f = kulldriverlfee;
    let g = carwash;
    let h = accountFuel;
    let i = misc;
    let kulllevy = numberofJobs * levy;
    let kullmeter = meter2 - meter1 - kulllevy;
    let kullkm = km2 - km1;
    let kullpaidkm = paidkm2 - paidkm1;
    let kullunpaidkm = kullkm - kullpaidkm;
    let kullmanuallifting = numberofmanuallifting * liftingtotal;
    let kulltotallifting = kullmanuallifting + a1;
    let kullgtnlfee = kullnumberofchairs * liftingcompany;
    let kullcommdriver = kullmeter * (drivercommrate / 100);
    let kullcommgtn = kullmeter * (companycommrate / 100);

    let Cdeductions = parseFloat((a - a1 + b + c + d + e + f).toFixed(2));
    let Ddeductions = parseFloat(
      (a - a1 + b + c + d + e + f + g + h + i).toFixed(2),
    );

    let Cnetpayin = kullcommgtn - parseFloat(Cdeductions.toFixed(2));
    let Dnetpayin = parseFloat((kullcommgtn - Ddeductions).toFixed(2));
    let driverincome = parseFloat((kulldriverlfee + kullcommdriver).toFixed(2));
    if (kullkm > 0) {
      let kullcpk = kullmeter / kullkm;
      setCpk(parseFloat(kullcpk.toFixed(2)));
    } else {
      setCpk(0);
    }
    if (hours > 0) {
      setFare(parseFloat((totalmeter / hours).toFixed(2)));
    } else {
      setFare(0);
    }
    setCommissiondriver(parseFloat(kullcommdriver.toFixed(2)));
    setCommissiongtn(parseFloat(kullcommgtn.toFixed(2)));
    setTotalLevy(parseFloat(kulllevy.toFixed(2)));
    settotalmeter(parseFloat(kullmeter.toFixed(2)));
    setResultkm(parseFloat(kullkm.toFixed(2)));
    setResultpaidkm(parseFloat(kullpaidkm.toFixed(2)));
    setUnpaidkm(parseFloat(kullunpaidkm.toFixed(2)));
    setManualLifting(parseFloat(kullmanuallifting.toFixed(2)));
    setTotalLifting(parseFloat(kulltotallifting.toFixed(2)));
    setNumberofChairs(parseFloat(kullnumberofchairs.toFixed(0)));
    setGtnLFee(parseFloat(kullgtnlfee.toFixed(2)));
    setDriverLFee(parseFloat(kulldriverlfee.toFixed(2)));
    setDriverIncome(parseFloat(driverincome.toFixed(2)));

    if (accountFuel > 0 || carwash > 0 || misc > 0) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's ?",
            onPress: () => {
              setDeductions(parseFloat(Ddeductions.toFixed(2)));
              setNetpayin(parseFloat(Dnetpayin.toFixed(2)));
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
                                        refresh();
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
              setDeductions(parseFloat(Cdeductions.toFixed(2)));
              setNetpayin(parseFloat(Cnetpayin.toFixed(2)));
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
                                        refresh();
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
      setDeductions(parseFloat(Cdeductions.toFixed(2)));
      setNetpayin(parseFloat(Cnetpayin.toFixed(2)));
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
                                refresh();
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
    // lev: any,
    fuel: any,
    meterstart: any,
    meterfinish: any,
    // kmstart: any,
    kmfinish: any,
    paidkmstart: any,
    paidkmfinish: any,
    //sbmt: any,
    gsm: any,
    gsm31: any,
    //manualmptp: any,
    noofmanualmptplifts: any,
    // eftps: any,
    eftposliftingfee: any,
    docket: any,
    charge: any,
    // mis: any,
    wash: any;

  const Refresh = () => {
    dispatch({type: 'REFRESH'});
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
    setLiftingtotal(parseFloat(a.toFixed(2)));
    setliftingcompany(parseFloat(b.toFixed(2)));
    setliftingdriver(parseFloat(c.toFixed(2)));
    setLevy(parseFloat(d.toFixed(2)));
    setDrivercommrate(parseFloat(e.toFixed(0)));
    setCompanycommrate(parseFloat(f.toFixed(0)));
  };

  //calculator...
  let Authoritycalculator = (num: number) => {
    onChangeChargeAuthority(parseFloat(num.toFixed(2)));
    setcalculatormodalvisible(!calculatormodalvisible);
  };
  let CCcalculator = (num: number) => {
    onChangeCc(parseFloat(num.toFixed(2)));
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
          transparent={true}
          presentationStyle={'pageSheet'}
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
            //keyboardType="numbers-and-punctuation"
            onChangeText={num => onChangeInsuranceFee(Number(num))}
            //value={insurancefee}
            ref={input => {
              insurance = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(insurancefee)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeInsuranceFee(parseFloat(insurancefee.toFixed(2)));
                fuel.focus();
              }
            }}>
            <Text style={styles.titleText}>{insurancefee}</Text>
          </TextInput>
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
            onChangeText={num => onChangeAccountFuel(Number(num))}
            //value={accountFuel}
            ref={input => {
              fuel = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(accountFuel)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeAccountFuel(parseFloat(accountFuel.toFixed(2)));
                hoursworked.focus();
              }
            }}>
            <Text style={styles.titleText}>{accountFuel}</Text>
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
            onChangeText={num => onChangeHours(Number(num))}
            //value={hours}
            ref={input => {
              hoursworked = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(hours)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeHours(parseFloat(hours.toFixed(2)));
                job.focus();
              }
            }}>
            <Text style={styles.titleText}>{hours}</Text>
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
            onChangeText={num => setNumberofJobs(Number(num))}
            //value={numberofJobs}
            ref={input => {
              job = input;
            }}
            onSubmitEditing={() => {
              if (!numberofJobs) {
                Alert.alert('Please input number of jobs');
              } else {
                setNumberofJobs(parseFloat(numberofJobs.toFixed(0)));
                // Totallevy();
              }
            }}>
            <Text style={styles.titleText}>{numberofJobs}</Text>
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
            onChangeText={num => onChangeMisc(Number(num))}
            //value={misc}
            //returnKeyType="next"
            ref={input => {
              mis = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(misc)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeMisc(parseFloat(misc.toFixed(2)));
                wash.focus();
              }
            }}
            blurOnSubmit={false}>
            <Text style={styles.titleText}>{misc}</Text>
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
            onChangeText={num => onChangeCarWash(Number(num))}
            //value={carWash}
            //returnKeyType="next"
            ref={input => {
              wash = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(carwash)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCarWash(parseFloat(carwash.toFixed(2)));
                meterstart.focus();
              }
            }}>
            <Text style={styles.titleText}>{carwash}</Text>
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
            onChangeText={num => setmeter1(Number(num))}
            // value={meter1}
            ref={input => {
              meterstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(meter1)) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter1(parseFloat(meter1.toFixed(2)));
                meterfinish.focus();
              }
            }}>
            <Text style={styles.titleText}>{meter1}</Text>
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
            onChangeText={num => setmeter2(Number(num))}
            //value={meter2}
            ref={input => {
              meterfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(meter2)) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter2(parseFloat(meter2.toFixed(2)));
                calculatemeter();
              }
            }}>
            <Text style={styles.titleText}>{meter2}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Shift Total - Total Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{totalmeter}</Text>
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
            onChangeText={num => setkm1(Number(num))}
            //value={km1}
            ref={input => {
              kmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(km1)) {
                Alert.alert('Please input a correct number');
              } else {
                setkm1(parseFloat(km1.toFixed(2)));
                kmfinish.focus();
              }
            }}>
            <Text style={styles.titleText}>{km1}</Text>
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
            onChangeText={num => setkm2(Number(num))}
            //value={km2}
            ref={input => {
              kmfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(km2)) {
                Alert.alert('Please input a correct number');
              } else {
                setkm2(parseFloat(km2.toFixed(2)));
                calculatekm();
              }
            }}>
            <Text style={styles.titleText}>{km2}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Kms Total</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{resultkm}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>CPK</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{cpk}</Text>
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
            onChangeText={num => setpaidkm1(Number(num))}
            //value={paidkm1}
            ref={input => {
              paidkmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(paidkm1)) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm1(parseFloat(paidkm1.toFixed(2)));
                paidkmfinish.focus();
              }
            }}>
            <Text style={styles.titleText}>{paidkm1}</Text>
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
            onChangeText={num => setpaidkm2(Number(num))}
            //value={paidkm2}
            ref={input => {
              paidkmfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(paidkm2)) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm2(parseFloat(paidkm2.toFixed(2)));
                //calculatepaidkm();
              }
            }}>
            <Text style={styles.titleText}>{paidkm2}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Paid Kms Total</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{resultpaidkm}</Text>
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
            onChangeText={text => setManualMptp(Number(text))}
            //value={manualMptp}
            ref={input => {
              gsm = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(manualMptp)) {
                Alert.alert('Please input a correct number');
              } else {
                setManualMptp(parseFloat(manualMptp.toFixed(2)));
                gsm31.focus();
              }
            }}>
            <Text style={styles.titleText}>{manualMptp}</Text>
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
            onChangeText={text => setGovSubManual31(Number(text))}
            //value={govSubManual31}
            ref={input => {
              gsm31 = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(govSubManual31)) {
                Alert.alert('Please input a correct number');
              } else {
                setGovSubManual31(parseFloat(govSubManual31.toFixed(2)));
                noofmanualmptplifts.focus();
              }
            }}>
            <Text style={styles.titleText}>{govSubManual31}</Text>
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
            onChangeText={text => setNumberofManualLifting(Number(text))}
            // value={numberofmanuallifting}
            ref={input => {
              noofmanualmptplifts = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(numberofmanuallifting)) {
                Alert.alert('Please input a correct number');
              } else {
                setNumberofManualLifting(
                  parseFloat(numberofmanuallifting.toFixed(0)),
                );
                calculateManualLifting();
              }
            }}>
            <Text style={styles.titleText}>{numberofmanuallifting}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Manual L/F Value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{manuallifting}</Text>
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
            onChangeText={num => onChangeEftpos(Number(num))}
            //value={eftpos}
            ref={input => {
              eftps = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(eftpos)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeEftpos(parseFloat(eftpos.toFixed(2)));
                eftposliftingfee.focus();
              }
            }}
            blurOnSubmit={false}>
            <Text style={styles.titleText}>{eftpos}</Text>
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
            onChangeText={num => setEftposLifting(Number(num))}
            //value={eftposlifting}
            ref={input => {
              eftposliftingfee = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(eftposlifting)) {
                Alert.alert('Please input a correct number');
              } else {
                setEftposLifting(parseFloat(eftposlifting.toFixed(2)));
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
            onChangeText={num => onChangeCc(Number(num))}
            ref={input => {
              docket = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(cc)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCc(parseFloat(cc.toFixed(2)));
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
            onChangeText={num => onChangeChargeAuthority(Number(num))}
            style={styles.textInput}
            ref={input => {
              charge = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(chargeAuthority)) {
                Alert.alert('Please input a correct number');
                //option();
              } else {
                onChangeChargeAuthority(parseFloat(chargeAuthority.toFixed(2)));
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
