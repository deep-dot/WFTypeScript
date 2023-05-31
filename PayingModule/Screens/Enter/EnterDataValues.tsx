import {useRef} from 'react';

export const useLiftingRefs = () => {
  const refs = {
    liftingtotal: useRef(null),
    liftingdriver: useRef(null),
    levy: useRef(null),
    drivercommrate: useRef(null),
  };
  return refs;
};

export const useInputRefs = () => {
  const refs = {
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
  return refs;
};

export const usePayinRefs = () => {
  const refs = {
    totallifting: useRef(null),
    numberofChairs: useRef(null),
    gtnLFee: useRef(null),
    driverLFee: useRef(null),
    commissiongtn: useRef(null),
    commissiondriver: useRef(null),
    deductions: useRef(null),
    fare: useRef(null),
    netpayin: useRef(null),
    driverIncome: useRef(null),
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
  Jobs: '',
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
  cabData: [],
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

export const CdeductionsProperties = [
  'eftpos',
  'eftposlifting',
  'govSubManual31',
  'manualMptp',
  'cc',
  'chargeAuthority',
  'driverLFee',
];

export const DdeductionsAdditionalProperties = [
  'carwash',
  'accountFuel',
  'misc',
];

export const properties = ['accountFuel', 'carwash', 'misc'];

export const liftingInputs = [
  {
    title: 'Lifting Total',
    name: 'liftingtotal',
    nextInput: 'hoursworked',
  },
  {title: 'Lifting Driver', name: 'liftingdriver'},
  {title: 'Levy', name: 'levy'},
  {
    title: 'Driver Commission Rate %',
    name: 'drivercommrate',
    nextInput: 'hoursworked',
  },
];

export const inputs = [
  // {
  //   title: 'Lifting Modal Visible',
  //   name: 'liftingmodalvisible',
  //   nextInput: 'job',
  // },
  // {title: 'Shift', name: 'shift'},
  {title: 'Working Hours', name: 'hours'},
  {title: 'Insurance', name: 'insurancefee'},
  {title: 'Jobs Done', name: 'numberofJobs'},
  {title: 'Total Levy', name: 'totallevy'},
  {title: 'Meter Start', name: 'meter1'},
  {title: 'Meter Finish', name: 'meter2'},
  {title: 'Total Meter', name: 'totalmeter'},
  {title: 'KM Start', name: 'km1'},
  {title: 'KM Finish', name: 'km2'},
  {title: 'Total KMs', name: 'resultkm'},
  {title: 'Paid KM Start', name: 'paidkm1'},
  {title: 'Paid KM Finish', name: 'paidkm2'},
  {title: 'Total Paid KM', name: 'resultpaidkm'},
  {title: 'Unpaid KM', name: 'unpaidkm'},
  {title: 'CPK', name: 'cpk'},
  {title: 'EFTPOS', name: 'eftpos'},
  {title: 'EFTPOS Lifting', name: 'eftposlifting'},
  {title: 'CC', name: 'cc'},
  {
    title: 'MPTP Value',
    name: 'manualMptp',
  },
  {
    title: 'MPTP31 Value',
    name: 'govSubManual31',
  },
  // {title: 'Cab Data', name: 'cabData'},
  // {title: 'Taxi', name: 'Taxi'},
  {
    title: 'Number of MPTP31',
    name: 'numberofmanuallifting',
  },
  //  {title: 'Total MPTP31 Value', name: 'manuallifting'},
  {title: 'Charge Authority', name: 'chargeAuthority'},
  {title: 'Misc', name: 'misc'},
  {title: 'Car Wash', name: 'carwash'},
  {title: 'Fuel', name: 'accountFuel'},
  // {title: 'Date', name: 'date'},
  // {title: 'Day', name: 'day'},
  // {title: 'Rego Modal', name: 'regomodal'},
  // {title: 'Rego', name: 'rego'},
  // {
  //   title: 'Calculator Modal Visible',
  //   name: 'calculatormodalvisible',
  //   nextInput: 'docket',
  // },
  // {title: 'Number of Entries', name: 'numberofEntries'},
  // {title: 'Indicator', name: 'indicator'},
];

export const payinInputs = [
  {title: 'Total Lifting', name: 'totallifting'},
  {title: 'Number of Chairs', name: 'numberofChairs'},
  {title: 'GTN Lifting Fee', name: 'gtnLFee'},
  {title: 'Driver Lifting Fee', name: 'driverLFee'},

  {title: 'Commission GTN', name: 'commissiongtn'},
  {title: 'Commission Driver', name: 'commissiondriver'},
  {title: 'Deductions', name: 'deductions'},
  {title: 'Average Fare', name: 'fare'},
  {title: 'Net Pay-In', name: 'netpayin'},
  {
    title: 'Net Driver Income',
    name: 'driverIncome',
    nextInput: 'noofmanualmptplifts',
  },
];
