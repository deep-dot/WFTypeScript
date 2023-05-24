import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {openDatabase} from 'react-native-sqlite-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import styles from './Update.style';
import envs from '../../config/env';
const {DATABASE_NAME} = envs;
var db = openDatabase(
  {name: DATABASE_NAME, createFromLocation: 1},
  () => {},
  error => {
    console.log('ERROR:' + error);
  },
);
import Mybutton from '../../components/Mybutton';
import Calculator from '../../components/Calculator';
import Calendar from '../../components/Calendar';
import Model from '../../components/Model';
import Loader from '../../components/Loader';
import {StateContext} from './StateProvider';

export default function UpdateUser({props, navigation}) {
  const stateContext = useContext(StateContext);
  if (!stateContext) {
    throw new Error('Component must be used within a StateProvider');
  }
  const {dispatch} = stateContext;
  const [liftingtotal, setLiftingtotal] = useState('');
  const [liftingmodalvisible, setLiftingmodalvisible] = useState(false);
  const [liftingdriver, setliftingdriver] = useState('');
  const [liftingcompany, setliftingcompany] = useState('');
  const [shift, setshift] = useState('');
  const [hours, onChangeHours] = useState('');
  const [numberofJobs, setNumberofJobs] = useState('');
  const [levy, setLevy] = useState('');
  const [totallevy, setTotalLevy] = useState('');
  const [insurancefee, onChangeInsuranceFee] = useState('');
  const [meter1, setmeter1] = useState('');
  const [meter2, setmeter2] = useState('');
  const [totalmeter, settotalmeter] = useState('');
  const [km1, setkm1] = useState('');
  const [km2, setkm2] = useState('');
  const [resultkm, setResultkm] = useState('');
  const [paidkm1, setpaidkm1] = useState('');
  const [paidkm2, setpaidkm2] = useState('');
  const [resultpaidkm, setResultpaidkm] = useState('');
  const [unpaidkm, setUnpaidkm] = useState('');
  const [cpk, setCpk] = useState('');
  const [eftpos, onChangeEftpos] = useState('');
  const [eftposlifting, setEftposLifting] = useState('');
  const [cc, onChangeCc] = useState('');
  const [manualMptp, setManualMptp] = useState('');
  const [govSubManual31, setGovSubManual31] = useState('');
  const [govSubManual, setGovSubManual] = useState('');
  const [numberofmanuallifting, setNumberofManualLifting] = useState('');
  const [manuallifting, setManualLifting] = useState('');
  const [chargeAuthority, onChangeChargeAuthority] = useState('');
  const [misc, onChangeMisc] = useState('');
  const [carwash, onChangeCarWash] = useState('');
  const [accountFuel, onChangeAccountFuel] = useState('');
  const [totallifting, setTotalLifting] = useState('');
  const [numberofChairs, setNumberofChairs] = useState('');
  const [gtnLFee, setGtnLFee] = useState('');
  const [driverLFee, setDriverLFee] = useState('');
  const [deductions, setDeductions] = useState('');

  const [commissiongtn, setCommissiongtn] = useState('');
  const [commissiondriver, setCommissiondriver] = useState('');
  const [drivercommrate, setDrivercommrate] = useState('');
  const [companycommrate, setCompanycommrate] = useState('');
  const [fare, setFare] = useState('');
  const [netpayin, setNetpayin] = useState('');
  const [driverIncome, setDriverIncome] = useState('');

  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [search_day, setSearch_day] = useState('');
  let [search_date, setSearch_date] = useState('');
  const [indicator, setIndicator] = useState(false);

  const calculatekm = () => {
    setResultkm(Number(km2 - km1).toFixed(2));
    paidkmstart.focus();
  };
  const calculatemeter = () => {
    settotalmeter(Number(meter2 - totallevy - meter1).toFixed(2));
    kmstart.focus();
  };
  const Totallevy = () => {
    setTotalLevy(Number(numberofJobs * levy).toFixed(2));
    mis.focus();
  };
  const calculatepaidkm = () => {
    setResultpaidkm(Number(paidkm2 - paidkm1).toFixed(2));
    setCommissiondriver(Number(totalmeter * (drivercommrate / 100)).toFixed(2));
    setCommissiongtn(Number(totalmeter * (companycommrate / 100)).toFixed(2));
    if (resultkm > 0) {
      setCpk(Number(totalmeter / resultkm).toFixed(2));
    } else {
      setCpk(Number(cpk).toFixed(2));
    }
    gsm.focus();
  };
  const calculateUnpaidkm = () => {
    setUnpaidkm(Number(resultkm - resultpaidkm).toFixed(2));
  };
  const calculateManualLifting = () => {
    setManualLifting(Number(numberofmanuallifting * liftingtotal).toFixed(2));
    calculateUnpaidkm();
    eftps.focus();
  };
  const calculateTotalLifting = () => {
    let a = Number(numberofmanuallifting * liftingtotal);
    let b = Number(eftposlifting);
    setTotalLifting(Number(a + b).toFixed(2));
    calculateNumberofChairs();
  };
  const calculateNumberofChairs = () => {
    let a = Number(numberofmanuallifting);
    let b = Number(eftposlifting / liftingtotal);
    if (liftingtotal > 0) {
      setNumberofChairs(Number(a + b).toFixed(0));
    } else {
      setNumberofChairs('0');
    }
    calculateGtnLFee();
  };
  const calculateGtnLFee = () => {
    let a = Number(numberofmanuallifting);
    let b = Number(eftposlifting / liftingtotal);
    let c = Number(liftingcompany);
    setGtnLFee(Number((a + b) * c).toFixed(2));
    calculateDriverLFee();
  };
  const calculateDriverLFee = () => {
    let a = Number(numberofmanuallifting);
    let b = Number(eftposlifting / liftingtotal);
    let c = Number(liftingdriver);
    setDriverLFee(Number((a + b) * c).toFixed(2));
    //Fare();
    if (hours > 0) {
      setFare(Number(totalmeter / hours).toFixed(2));
    } else {
      setFare('0.00');
    }
    docket.focus();
  };

  let submitalltogather = () => {
    let A = Number(numberofmanuallifting);
    let B;
    if (liftingtotal > 0) {
      B = Number(eftposlifting / liftingtotal);
    } else {
      B = Number(0);
    }
    let kullnumberofchairs = A + B;
    let kulldriverlfee = kullnumberofchairs * liftingdriver;
    let a = Number(eftpos);
    let a1 = Number(eftposlifting);
    let b = Number(govSubManual31);
    let c = Number(manualMptp);
    let d = Number(cc);
    let e = Number(chargeAuthority);
    //let f = Number(driverLFee);
    let f = kulldriverlfee;
    let g = Number(carwash);
    let h = Number(accountFuel);
    let i = Number(misc);
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
    let Cdeductions = Number(a - a1 + b + c + d + e + f).toFixed(2);
    let Ddeductions = Number(a - a1 + b + c + d + e + f + g + h + i).toFixed(2);

    let Cnetpayin = Number(kullcommgtn - Cdeductions).toFixed(2);
    let Dnetpayin = Number(kullcommgtn - Ddeductions).toFixed(2);
    let driverincome = Number(kulldriverlfee + kullcommdriver).toFixed(2);
    if (kullkm > 0) {
      let kullcpk = kullmeter / kullkm;
      setCpk(Number(kullcpk).toFixed(2));
    } else {
      setCpk('0.00');
    }
    if (hours > 0) {
      setFare(Number(totalmeter / hours).toFixed(2));
    } else {
      setFare('0.00');
    }
    setCommissiondriver(Number(kullcommdriver).toFixed(2));
    setCommissiongtn(Number(kullcommgtn).toFixed(2));
    setTotalLevy(Number(kulllevy).toFixed(2));
    settotalmeter(Number(kullmeter).toFixed(2));
    setResultkm(Number(kullkm).toFixed(2));
    setResultpaidkm(Number(kullpaidkm).toFixed(2));
    setUnpaidkm(Number(kullunpaidkm).toFixed(2));
    setManualLifting(Number(kullmanuallifting).toFixed(2));
    setTotalLifting(Number(kulltotallifting).toFixed(2));
    setNumberofChairs(Number(kullnumberofchairs).toFixed(0));
    setGtnLFee(Number(kullgtnlfee).toFixed(2));
    setDriverLFee(Number(kulldriverlfee).toFixed(2));
    setDriverIncome(Number(driverincome).toFixed(2));

    if (accountFuel > 0 || carwash > 0 || misc > 0) {
      Alert.alert(
        'Are fuel, washing, miscellaneous expenses',
        '',
        [
          {
            text: "Driver's?",
            onPress: () => {
              setDeductions(Number(Ddeductions).toFixed(2));
              setNetpayin(Number(Dnetpayin).toFixed(2));
              Alert.alert(
                'Please confirm!',
                'Wish to update?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      db.transaction(tx => {
                        tx.executeSql(
                          'UPDATE datatable set Date = ?, Day =?, Shift = ?, Taxi = ?, Jobs = ?, Ins = ?, Hours_Worked = ?, Total_Levy = ?, Car_Wash = ?, Meter_Start = ?, Meter_Finish = ?, Shift_Total = ?, Com_GTN = ?, Com_Driver = ?, Km_Start = ?, Km_Finish = ?, Kms = ?, Paidkm_Start = ?, Paidkm_Finish = ?, Paid_Kms = ?, Unpaid_kms = ?, Eftpos_Total = ?, Eftpos_LFee = ?, Dockets = ?, Charge_Authority = ?, Manual_MPTP_Total = ?, No_of_Manual_Lifts = ?, Total_Lifting_Fee_Value = ?, Misc = ?, Acc_Fuel = ?, Net_Payin = ?, manual_lifting_fee_value = ?, no_wheelchair_lifts = ?, company_portion_lifting_fee = ?, driver_portion_lifting_fee = ?, Deductions = ?, Gov_Sub_Manual31 = ?, CPK = ?, Gov_Sub_Manual =? where Date = ?',
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
                            search_date,
                          ],
                          (_tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                              Alert.alert(
                                'Record updated successfully.',
                                'Do you want update another record?',
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
            text: "Company's?",
            onPress: () => {
              setDeductions(Number(Cdeductions).toFixed(2));
              setNetpayin(Number(Cnetpayin).toFixed(2));
              Alert.alert(
                'Please confirm!',
                'Wish to update?',
                [
                  {
                    text: 'Yes',
                    onPress: () => {
                      db.transaction(tx => {
                        tx.executeSql(
                          'UPDATE datatable set Date = ?, Day =?, Shift = ?, Taxi = ?, Jobs = ?, Ins = ?, Hours_Worked = ?, Total_Levy = ?, Car_Wash = ?, Meter_Start = ?, Meter_Finish = ?, Shift_Total = ?, Com_GTN = ?, Com_Driver = ?, Km_Start = ?, Km_Finish = ?, Kms = ?, Paidkm_Start = ?, Paidkm_Finish = ?, Paid_Kms = ?, Unpaid_kms = ?, Eftpos_Total = ?, Eftpos_LFee = ?, Dockets = ?, Charge_Authority = ?, Manual_MPTP_Total = ?, No_of_Manual_Lifts = ?, Total_Lifting_Fee_Value = ?, Misc = ?, Acc_Fuel = ?, Net_Payin = ?, manual_lifting_fee_value = ?, no_wheelchair_lifts = ?, company_portion_lifting_fee = ?, driver_portion_lifting_fee = ?, Deductions = ?, Gov_Sub_Manual31 = ?, CPK = ?, Gov_Sub_Manual =? where Date = ?',
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
                            search_date,
                          ],
                          (_tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                              Alert.alert(
                                'Record updated successfully.',
                                'Do you want update another record?',
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
      setDeductions(Number(Cdeductions).toFixed(2));
      setNetpayin(Number(Cnetpayin).toFixed(2));
      Alert.alert(
        'Please confirm!',
        'Wish to update?',
        [
          {
            text: 'Yes',
            onPress: () => {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE datatable set Date = ?, Day =?, Shift = ?, Taxi = ?, Jobs = ?, Ins = ?, Hours_Worked = ?, Total_Levy = ?, Car_Wash = ?, Meter_Start = ?, Meter_Finish = ?, Shift_Total = ?, Com_GTN = ?, Com_Driver = ?, Km_Start = ?, Km_Finish = ?, Kms = ?, Paidkm_Start = ?, Paidkm_Finish = ?, Paid_Kms = ?, Unpaid_kms = ?, Eftpos_Total = ?, Eftpos_LFee = ?, Dockets = ?, Charge_Authority = ?, Manual_MPTP_Total = ?, No_of_Manual_Lifts = ?, Total_Lifting_Fee_Value = ?, Misc = ?, Acc_Fuel = ?, Net_Payin = ?, manual_lifting_fee_value = ?, no_wheelchair_lifts = ?, company_portion_lifting_fee = ?, driver_portion_lifting_fee = ?, Deductions = ?, Gov_Sub_Manual31 = ?, CPK = ?, Gov_Sub_Manual =? where Date = ?',
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
                    search_date,
                  ],
                  (_tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Record updated successfully.',
                        'Do you want update another record?',
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

  let hoursworked,
    job,
    fuel,
    meterstart,
    meterfinish,
    kmstart,
    kmfinish,
    paidkmstart,
    paidkmfinish,
    gsm,
    gsm31,
    noofmanualmptplifts,
    eftps,
    eftposliftingfee,
    docket,
    charge,
    mis,
    wash;

  let updateAllStates = res => {
    setDate(res.Date);
    setDay(res.Day);
    setshift(res.Shift);
    setTaxi(res.Taxi);
    setNumberofJobs(res.Jobs);
    onChangeInsuranceFee(res.Ins);
    onChangeHours(res.Hours_Worked);
    setTotalLevy(res.Total_Levy);
    onChangeCarWash(res.Car_Wash);
    setmeter1(res.Meter_Start);
    setmeter2(res.Meter_Finish);
    settotalmeter(res.Shift_Total);
    setCommissiongtn(res.Com_GTN);
    setCommissiondriver(res.Com_Driver);
    setkm1(res.Km_Start);
    setkm2(res.Km_Finish);
    setResultkm(res.Kms);
    setpaidkm1(res.Paidkm_Start);
    setpaidkm2(res.Paidkm_Finish);
    setResultpaidkm(res.Paid_Kms);
    setUnpaidkm(res.Unpaid_kms);
    onChangeEftpos(res.Eftpos_Total);
    setEftposLifting(res.Eftpos_LFee);
    onChangeCc(res.Dockets);
    onChangeChargeAuthority(res.Charge_Authority);
    setManualMptp(res.Manual_MPTP_Total);
    setNumberofManualLifting(res.No_of_Manual_Lifts);
    setTotalLifting(res.Total_Lifting_Fee_Value);
    onChangeMisc(res.Misc);
    onChangeAccountFuel(res.Acc_Fuel);
    setManualLifting(res.manual_lifting_fee_value);
    setNumberofChairs(res.no_wheelchair_lifts);
    setGtnLFee(res.company_portion_lifting_fee);
    setDriverLFee(res.driver_portion_lifting_fee);
    setDeductions(res.Deductions);
    setManualMptp(res.Gov_Sub_Manual31);
    setCpk(res.CPK);
    setGovSubManual(res.Gov_Sub_Manual);
    setNetpayin(res.Net_Payin);
  };

  //const [res, setRes] = useState({});

  const searchDate = () => {
    db.transaction(tx => {
      // let date = moment(userDate, 'DD/MM/YYYY').toDate().toISOString();
      tx.executeSql(
        'SELECT * FROM datatable where Date = ?',
        [search_date],
        (_tx, results) => {
          var len = results.rows.length;
          cabList();
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(res);
          } else {
            //alert('No Data found');
            Alert.alert('Sorry !', 'No data found.');
            setIndicator(false);
            refresh();
          }
        },
      );
    });
  };

  let refresh = () => {
    dispatch({type: 'REFRESH'});
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT GovLFee, CompanyLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate FROM UpdateItems',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateallstates(
              res.GovLFee,
              res.CompanyLFee,
              res.DriverLFee,
              res.Levy,
              res.Driver_Comm_Rate,
              res.Company_Comm_Rate,
            );
          } else {
            updateallstates('', '', '', '', '', '');
          }
        },
      );
    });
  }, []);

  let updateallstates = (a, b, c, d, e, f) => {
    setLiftingtotal(a);
    setliftingcompany(b);
    setliftingdriver(c);
    setLevy(d);
    setDrivercommrate(e);
    setCompanycommrate(f);
  };

  //calculator...

  const [calculatormodalvisible, setcalculatormodalvisible] = useState(false);
  let Authoritycalculator = text => {
    onChangeChargeAuthority(text);
    setcalculatormodalvisible(!calculatormodalvisible);
  };
  let CCcalculator = text => {
    onChangeCc(text);
    setcalculatormodalvisible(!calculatormodalvisible);
  };
  let Cancelcalculator = () => {
    setcalculatormodalvisible(!calculatormodalvisible);
  };

  //Taxi Picker

  const [cabData, setcabData] = useState(['']);
  const [Taxi, setTaxi] = useState('');

  let cabList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM cab', [], (_tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          const temp = [];
          for (let j = 0; j < len; j++) {
            temp.push(results.rows.item(j));
          }
          setcabData(temp);
        }
      });
    });
  };
  const Invisible = () => {
    setLiftingmodalvisible(!liftingmodalvisible);
  };
  const Onupdate = () => {
    navigation.navigate('HomeScreen');
    setLiftingmodalvisible(!liftingmodalvisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        // show={indicator}
        showProgress={true}
        title="Please wait"
        closeOnTouchOutside={true}
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
      <Loader loading={indicator} />

      <ScrollView style={{marginTop: 0, marginHorizontal: 0}}>
        <View style={styles.textinputview}>
          <Calendar
            value={search_date}
            onChange={tareek => setSearch_date(tareek)}
            OnChange={tareek => setSearch_day(tareek)}
          />
          <TextInput
            placeholder="Day"
            placeholderTextColor="#ffffff"
            editable={false}>
            <Text style={styles.titleText}>{search_day}</Text>
          </TextInput>
          <TextInput
            placeholder="Search Date"
            placeholderTextColor="#ffffff"
            editable={false}>
            <Text style={styles.titleText}>{search_date}</Text>
          </TextInput>
        </View>
        <View style={{borderBottomWidth: 0, alignItems: 'center'}}>
          <Text>YYYY/MM/DD</Text>
        </View>

        <Mybutton
          title="Search"
          customClick={() => {
            if (!search_date) {
              Alert.alert('Please select Date.');
            } else {
              searchDate();
              setIndicator(true);
              setTimeout(() => {
                setIndicator(false);
              }, 1000);
            }
          }}
        />

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Total Lifting Fee</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{liftingtotal}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Driver Share {'\n'}in Lifting Fee
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{liftingdriver}</Text>
          </TextInput>
        </View>

        {/* <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Company's Share {'\n'}in Lifting Fee
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{liftingcompany}</Text>
          </TextInput>
        </View> */}

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>Levy</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{levy}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Driver's Commission {'\n'}Rate(%)
          </Text>
          <TextInput
            placeholder="00"
            placeholderTextColor="#55a8fa"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{drivercommrate}</Text>
          </TextInput>
        </View>

        {/*<View style={styles.textinputview}>
          <Text style={styles.titletext}>
            Company's Commission {'\n'}Rate(%)
          </Text>
          <TextInput
            placeholder="00"
            placeholderTextColor="#007FFF"
            editable={false}
            style={styles.Textinput}>
            <Text style={styles.titletext}>{companycommrate}</Text>
          </TextInput>
        </View>*/}

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
            <Picker.Item label="Select" value=" " />
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
            {cabData.map((x, i) => (
              <Picker.Item label={x.Cab} key={i} value={x.Cab} />
            ))}
          </Picker>
        </View>

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
          <Text style={styles.titleText}>Insurance Fee </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeInsuranceFee(num)}
            //value = {insurancefee}
            ref={() => {
              // insurance = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(insurancefee)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeInsuranceFee(Number(insurancefee).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeAccountFuel(num)}
            //value={accountFuel}
            ref={input => {
              fuel = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(accountFuel)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeAccountFuel(Number(accountFuel).toFixed(2));
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
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeHours(num)}
            //value={hours}
            ref={input => {
              hoursworked = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(hours)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeHours(Number(hours).toFixed(2));
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
            style={styles.textInput}
            returnKeyType="next"
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setNumberofJobs(num)}
            //value={numberofJobs}
            ref={input => {
              job = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(Number(numberofJobs).toFixed(0))) {
                Alert.alert('Please input a correct number');
              } else {
                setNumberofJobs(Number(numberofJobs).toFixed(0));
                Totallevy();
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeMisc(num)}
            // value={misc}
            ref={input => {
              mis = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(misc)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeMisc(Number(misc).toFixed(2));
                wash.focus();
              }
            }}
            blurOnSubmit={false}>
            <Text style={styles.titleText}>{misc}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Car Wash </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeCarWash(num)}
            //value={carwash}
            ref={input => {
              wash = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(carwash)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCarWash(Number(carwash).toFixed(2));
                meterstart.focus();
              }
            }}>
            <Text style={styles.titleText}>{carwash}</Text>
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
          <Text style={styles.titleText}>Meter Start </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setmeter1(num)}
            // value={meter1}
            ref={input => {
              meterstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(meter1)) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter1(Number(meter1).toFixed(2));
                meterfinish.focus();
              }
            }}>
            <Text style={styles.titleText}>{meter1}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Meter Finish </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setmeter2(num)}
            //value={meter2}
            ref={input => {
              meterfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(meter2)) {
                Alert.alert('Please input a correct number');
              } else {
                setmeter2(Number(meter2).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setkm1(num)}
            //value={km1}
            ref={input => {
              kmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(km1)) {
                Alert.alert('Please input a correct number');
              } else {
                setkm1(Number(km1).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setkm2(num)}
            //value={km2}
            ref={input => {
              kmfinish = input;
            }}
            //onSubmitEditing={calculatekm}
            onSubmitEditing={() => {
              if (isNaN(km2)) {
                Alert.alert('Please input a correct number');
              } else {
                setkm2(Number(km2).toFixed(2));
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
          <Text style={styles.titleText}>Paid Km Start </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setpaidkm1(num)}
            //value={paidkm1}
            ref={input => {
              paidkmstart = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(paidkm1)) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm1(Number(paidkm1).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setpaidkm2(num)}
            //value={paidkm2}
            ref={input => {
              paidkmfinish = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(paidkm2)) {
                Alert.alert('Please input a correct number');
              } else {
                setpaidkm2(Number(paidkm2).toFixed(2));
                calculatepaidkm();
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
          <Text style={styles.titleText}>Gov-Sub-Manual-31 {'\n'}value </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={text => setGovSubManual31(text)}
            // value={govSubManual}
            ref={input => {
              gsm = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(govSubManual31)) {
                Alert.alert('Please input a correct number');
              } else {
                setGovSubManual31(Number(govSubManual31).toFixed(2));
                gsm31.focus();
              }
            }}>
            <Text style={styles.titleText}>{govSubManual31}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>Gov-Sub-Manual {'\n'}value</Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={text => setManualMptp(text)}
            //value={manualMptp}
            ref={input => {
              gsm31 = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(manualMptp)) {
                Alert.alert('Please input a correct number');
              } else {
                setManualMptp(Number(manualMptp).toFixed(2));
                noofmanualmptplifts.focus();
              }
            }}>
            <Text style={styles.titleText}>{manualMptp}</Text>
          </TextInput>
        </View>

        <View style={styles.textinputview}>
          <Text style={styles.titleText}>No. of Manual Lifts</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="#ffffff"
            style={styles.textInput}
            returnKeyType="next"
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={text => setNumberofManualLifting(text)}
            ref={input => {
              noofmanualmptplifts = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(numberofmanuallifting)) {
                Alert.alert('Please input a correct number');
              } else {
                setNumberofManualLifting(
                  Number(numberofmanuallifting).toFixed(0),
                );
                calculateManualLifting();
                //setNumberofManualLifting(0);
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeEftpos(num)}
            // value={eftpos}
            // returnKeyType="next"
            ref={input => {
              eftps = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(eftpos)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeEftpos(Number(eftpos).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => setEftposLifting(num)}
            //value={eftposlifting}
            ref={input => {
              eftposliftingfee = input;
            }}
            // o nSubmitEditing={calculateTotalLifting}>
            onSubmitEditing={() => {
              if (isNaN(eftposlifting)) {
                Alert.alert('Please input a correct number');
              } else {
                setEftposLifting(Number(eftposlifting).toFixed(2));
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
            style={styles.textInput}
            returnKeyType="next"
            // keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeCc(num)}
            ref={input => {
              docket = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(cc)) {
                Alert.alert('Please input a correct number');
              } else {
                onChangeCc(Number(cc).toFixed(2));
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
            //keyboardType="numbers-and-punctuation"
            keyboardType="numeric"
            onChangeText={num => onChangeChargeAuthority(num)}
            style={styles.textInput}
            ref={input => {
              charge = input;
            }}
            onSubmitEditing={() => {
              if (isNaN(chargeAuthority)) {
                Alert.alert('Please input a correct number');
              } else {
                Alert.alert('Press Update button to update the Record.');
                onChangeChargeAuthority(Number(chargeAuthority).toFixed(2));
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
            fontSize: 14,
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
            fontSize: 14,
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
          padding: 5,
        }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DisplayReport')}>
          <Text style={styles.buttontext}>Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => submitalltogather()}>
          <Text style={styles.buttontext}>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeScreen')}>
          <Text style={styles.buttontext}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
