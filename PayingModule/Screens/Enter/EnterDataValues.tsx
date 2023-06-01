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
    Hours_Worked: useRef(null),
    Insurance: useRef(null),
    Jobs_Done: useRef(null),
    Levy: useRef(null),
    Meter_Start: useRef(null),
    Meter_Finish: useRef(null),
    Shift_Total: useRef(null),
    Km_Start: useRef(null),
    Km_Finish: useRef(null),
    Kms: useRef(null),
    Paidkm_Start: useRef(null),
    Paidkm_Finish: useRef(null),
    Paid_Kms: useRef(null),
    Unpaid_Kms: useRef(null),
    CPK: useRef(null),
    Number_Of_Manual_Liftings: useRef(null),
    Total_Manual_MPTP31_And_MPTP_Values: useRef(null),
    M3_Dockets: useRef(null),
    Eftpos: useRef(null),
    Eftpos_Lifting_Value: useRef(null),
    Electronic_Account_Payments: useRef(null),
    Misc: useRef(null),
    Car_Wash: useRef(null),
    Fuel: useRef(null),
  };
  return refs;
};

export const usePayinRefs = () => {
  const refs = {
    Total_Lifting_Value: useRef(null),
    Number_Of_Chairs: useRef(null),
    Driver_Lifting_Value: useRef(null),
    Commission_Driver: useRef(null),
    Deductions: useRef(null),
    Average_Fare: useRef(null),
    Net_Payin: useRef(null),
    Net_Driver_Income: useRef(null),
  };
  return refs;
};

export const initialValues = {
  Number_Of_Entries: '',
  User_Name: '',
  Gov_Lifting_Fee: '',
  Driver_Share_In_LiftingFee: '',
  Gov_Levy: '',
  Driver_Comm_Rate: '',
  Lifting_Modal_Visible: false,
  Shift: '',
  Taxi: '',
  Rego: '',
  Cab_Data: [],
  Rego_Modal: false,
  Current_Date: '',
  Date: '',
  Day: '',
  Hours_Worked: '',
  Insurance: '',
  Jobs_Done: '',
  Levy: '',
  Meter_Start: '',
  Meter_Finish: '',
  Shift_Total: '',
  Km_Start: '',
  Km_Finish: '',
  Kms: '',
  Paidkm_Start: '',
  Paidkm_Finish: '',
  Paid_Kms: '',
  Unpaid_Kms: '',
  CPK: '',
  Number_Of_Manual_Liftings: '',
  Total_Manual_MPTP31_And_MPTP_Values: '',
  M3_Dockets: '',
  Eftpos: '',
  Eftpos_Lifting_Value: '',
  Electronic_Account_Payments: '',
  Misc: '',
  Car_Wash: '',
  Fuel: '',
  Total_Lifting_Value: '',
  Number_Of_Chairs: '',  
  Driver_Lifting_Value: '',
  Commission_Driver: '',
  Deductions: '',
  Average_Fare: '',
  Net_Payin: '',
  Net_Driver_Income: '',
  Calculator_Modal_Visible: false,
  Indicator: false,
};

export const DdeductionsProperties = [
  'Eftpos',
  'Eftpos_Lifting_Value',
  'Total_Manual_MPTP31_And_MPTP_Values',
  'M3_Dockets',
  'Electronic_Account_Payments',
  'Driver_Lifting_Value',
];

export const DdeductionsAdditionalProperties = ['Car_Wash', 'Fuel', 'Misc'];

export const liftingInputs = [
  {
    title: 'Lifting Total',
    name: 'Gov_Lifting_Fee',
  },
  {title: 'Lifting Driver', name: 'Driver_Share_In_LiftingFee'},
  {title: 'Levy', name: 'Gov_Levy'},
  {
    title: 'Driver Commission Rate %',
    name: 'Driver_Comm_Rate',
  },
];

export const inputs = [
  // {
  //   title: 'Lifting Modal Visible',
  //   name: 'Lifting_Modal_Visible',
  //   nextInput: 'job',
  // },
  // {title: 'Shift', name: 'Shift'},
  {title: 'Working Hours', name: 'Hours_Worked'},
  {title: 'Insurance', name: 'Insurance'},
  {title: 'Jobs Done', name: 'Jobs_Done'},
  {title: 'Total Levy', name: 'Levy'},
  {title: 'Meter Start', name: 'Meter_Start'},
  {title: 'Meter Finish', name: 'Meter_Finish'},
  {title: 'Total Meter', name: 'Shift_Total'},
  {title: 'KM Start', name: 'Km_Start'},
  {title: 'KM Finish', name: 'Km_Finish'},
  {title: 'Total KMs', name: 'Kms'},
  {title: 'Paid KM Start', name: 'Paidkm_Start'},
  {title: 'Paid KM Finish', name: 'Paidkm_Finish'},
  {title: 'Total Paid KM', name: 'Paid_Kms'},
  {title: 'Unpaid KM', name: 'Unpaid_Kms'},
  {title: 'CPK', name: 'CPK'},
  {
    title: 'Number of MPTP31',
    name: 'Number_Of_Manual_Liftings',
  },
  {
    title: 'Total MPTP Value',
    name: 'Total_Manual_MPTP31_And_MPTP_Values',
  },
  {title: 'M3 Dockets', name: 'M3_Dockets'},
  {title: 'EFTPOS', name: 'Eftpos'},
  {title: 'EFTPOS Lifting', name: 'Eftpos_Lifting_Value'},
  
  // {title: 'Cab Data', name: 'cabData'},
  // {title: 'Taxi', name: 'Taxi'},
  //  {title: 'Total MPTP31 Value', name: 'manuallifting'},
  {title: 'Electronic Payments', name: 'Electronic_Account_Payments'},
  {title: 'Misc', name: 'Misc'},
  {title: 'Car Wash', name: 'Car_Wash'},
  {title: 'Fuel', name: 'Fuel'},
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
  {title: 'Total Lifting', name: 'Total_Lifting_Value'},
  {title: 'Number of Chairs', name: 'Number_Of_Chairs'},
  {title: 'Driver Lifting Fee', name: 'Driver_Lifting_Value'},
  {title: 'Commission Driver', name: 'Commission_Driver'},
  {title: 'Deductions', name: 'Deductions'},
  {title: 'Average Fare', name: 'Average_Fare'},
  {title: 'Net Pay-In', name: 'Net_Payin'},
  {
    title: 'Net Driver Income',
    name: 'Net_Driver_Income',
  },
];
