import {useRef} from 'react';
import {TextInput} from 'react-native';
import {Transaction, ResultSet} from '../../databaseTypes';
import db from '../../databaseService';

export const useInputRefs = () => {
  const refs = {
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
  return refs;
};

export const initialValues = {
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
};

// dbActions.js
type FormValues = {
  [key: string]: string | boolean | string[];
};

export const insertData = (
  formValues: FormValues,
  callback: (tx: Transaction, results: ResultSet) => void = () => {},
) => {
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
          formValues.netpayin,
          formValues.manuallifting,
          formValues.numberofChairs,
          formValues.gtnLFee,
          formValues.driverLFee,
          formValues.deductions,
          formValues.govSubManual31,
          formValues.cpk,
          formValues.manualMptp,
          formValues.drivercommrate,
          formValues.companycommrate,
        ],
        callback,
      );
    });
  } else {
    console.log('db is undefined');
  }
};

export const liftingModalInputs = [
  {
    title: 'Lifting Total',
    name: 'liftingtotal',
    nextInput: 'hoursworked',
  },
  {title: 'Lifting Driver', name: 'liftingdriver', nextInput: 'hoursworked'},
  // {title: 'Lifting Company', name: 'liftingcompany', nextInput: 'insurance'},
  {title: 'Levy', name: 'levy', nextInput: 'hoursworked'},
  {
    title: 'Driver Commission Rate',
    name: 'drivercommrate',
    nextInput: 'hoursworked',
  },
  // {
  //   title: 'Company Commission Rate',
  //   name: 'companycommrate',
  //   nextInput: 'job',
  // },
];

export const inputs = [
  // {
  //   title: 'Lifting Modal Visible',
  //   name: 'liftingmodalvisible',
  //   nextInput: 'job',
  // },
  // {title: 'Shift', name: 'shift', nextInput: 'job'},
  {title: 'Working Hours', name: 'hours', nextInput: 'job'},
  {title: 'Jobs Done', name: 'numberofJobs', nextInput: 'insurance'},
  {title: 'Total Levy', name: 'totallevy', nextInput: 'meterstart'},
  {title: 'Insurance Fee', name: 'insurancefee', nextInput: 'insurance'},
  {title: 'Meter Start', name: 'meter1', nextInput: 'meterstart'},
  {title: 'Meter Finish', name: 'meter2', nextInput: 'meterfinish'},
  {title: 'Total Meter', name: 'totalmeter', nextInput: 'meterfinish'},
  {title: 'KM Start', name: 'km1', nextInput: 'kmstart'},
  {title: 'KM Finish', name: 'km2', nextInput: 'kmfinish'},
  {title: 'Total KMs', name: 'resultkm', nextInput: 'paidkmstart'},
  {title: 'Paid KM Start', name: 'paidkm1', nextInput: 'paidkmstart'},
  {title: 'Paid KM Finish', name: 'paidkm2', nextInput: 'paidkmfinish'},
  {title: 'Total Paid KM', name: 'resultpaidkm', nextInput: 'sbmt'},
  {title: 'Unpaid KM', name: 'unpaidkm', nextInput: 'sbmt'},
  {title: 'CPK', name: 'cpk', nextInput: 'sbmt'},
  {title: 'EFTPOS', name: 'eftpos', nextInput: 'gsm'},
  {title: 'EFTPOS Lifting', name: 'eftposlifting', nextInput: 'gsm31'},
  {title: 'CC', name: 'cc', nextInput: 'manualmptp'},
  {
    title: 'MPTP Value',
    name: 'manualMptp',
    nextInput: 'noofmanualmptplifts',
  },
  {
    title: 'MPTP31 Value',
    name: 'govSubManual31',
    nextInput: 'eftps',
  },
  // {title: 'Cab Data', name: 'cabData', nextInput: 'eftposliftingfee'},
  // {title: 'Taxi', name: 'Taxi', nextInput: 'docket'},
  {
    title: 'Number of MPTP31',
    name: 'numberofmanuallifting',
    nextInput: 'docket',
  },
  //  {title: 'Total MPTP31 Value', name: 'manuallifting', nextInput: 'charge'},
  {title: 'Charge Authority', name: 'chargeAuthority', nextInput: 'mis'},
  {title: 'Misc', name: 'misc', nextInput: 'wash'},
  {title: 'Car Wash', name: 'carwash', nextInput: 'fuel'},
  {title: 'Fuel', name: 'accountFuel', nextInput: 'meterstart'},
  // {title: 'Date', name: 'date', nextInput: 'sbmt'},
  // {title: 'Day', name: 'day', nextInput: 'sbmt'},
  // {title: 'Rego Modal', name: 'regomodal', nextInput: 'eftps'},
  // {title: 'Rego', name: 'rego', nextInput: 'eftposliftingfee'},
  // {
  //   title: 'Calculator Modal Visible',
  //   name: 'calculatormodalvisible',
  //   nextInput: 'docket',
  // },
  // {title: 'Number of Entries', name: 'numberofEntries', nextInput: 'charge'},
  // {title: 'Indicator', name: 'indicator', nextInput: 'mis'},
];

export const payinDetailInputs = [
  {title: 'Total Lifting', name: 'totallifting', nextInput: 'meterfinish'},
  {title: 'Number of Chairs', name: 'numberofChairs', nextInput: 'kmstart'},
  {title: 'GTN Lifting Fee', name: 'gtnLFee', nextInput: 'kmfinish'},
  {title: 'Driver Lifting Fee', name: 'driverLFee', nextInput: 'paidkmstart'},

  {title: 'Commission GTN', name: 'commissiongtn', nextInput: 'sbmt'},
  {title: 'Commission Driver', name: 'commissiondriver', nextInput: 'gsm'},
  {title: 'Deductions', name: 'deductions', nextInput: 'paidkmfinish'},
  {title: 'Average Fare', name: 'fare', nextInput: 'gsm31'},
  {title: 'Net Pay-In', name: 'netpayin', nextInput: 'manualmptp'},
  {
    title: 'Net Driver Income',
    name: 'driverIncome',
    nextInput: 'noofmanualmptplifts',
  },
];
