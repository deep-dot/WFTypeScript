import {useRef} from 'react';
import {TextInput} from 'react-native';

export const useInputRefs = () => {
  const refs = {
    Hours_Worked: useRef<TextInput>(null),
    Insurance: useRef<TextInput>(null),
    Jobs_Done: useRef<TextInput>(null),
    Meter_Start: useRef<TextInput>(null),
    Meter_Finish: useRef<TextInput>(null),
    Km_Start: useRef<TextInput>(null),
    Km_Finish: useRef<TextInput>(null),
    Paidkm_Start: useRef<TextInput>(null),
    Paidkm_Finish: useRef<TextInput>(null),
    Eftpos: useRef<TextInput>(null),
    Eftpos_Liftings: useRef<TextInput>(null),
    Number_Of_Manual_Liftings: useRef<TextInput>(null),
    Total_Manual_MPTP31_And_MPTP_Values: useRef<TextInput>(null),
    M3_Dockets: useRef<TextInput>(null),
    Electronic_Account_Payments: useRef<TextInput>(null),
    Misc: useRef<TextInput>(null),
    Car_Wash: useRef<TextInput>(null),
    Fuel: useRef<TextInput>(null),
  };
  return refs;
};

interface Cab {
  Cab: string;
}
interface total {
  [key: string]: string;
}
interface tableData {
  [key: string]: string;
}
export type FormValues = {
  //subscription
  purchased: boolean;
  products: {};
  checking: boolean;
  ShowAlert: boolean;

  //main
  Record_id: number;
  Number_Of_Entries: number;
  //Home Screen Modal
  modalVisible: boolean;
  Name: string;
  showAlert: boolean;
  Week_Ending_Date: string;
  Week_Ending_Day: string;

  //Lifting Modal
  Lifting_Modal_Visible: boolean;
  Gov_Lifting_Fee: number;
  Driver_Share_In_LiftingFee: number;
  Gov_Levy: number;
  Driver_Comm_Rate: number;
  Company_Comm_Rate: number;

  Shift: string;
  Taxi: string;
  Cab_Data: Cab[];
  Rego: string;
  Rego_Modal: boolean;
  Current_Date: string;
  Date: string;
  Day: string;
  Hours_Worked: number;
  Insurance: number;
  Jobs_Done: number;
  Meter_Start: number;
  Meter_Finish: number;
  Km_Start: number;
  Km_Finish: number;
  Paidkm_Start: number;
  Paidkm_Finish: number;
  Number_Of_Manual_Liftings: number;
  Total_Manual_MPTP31_And_MPTP_Values: number;
  M3_Dockets: number;
  Eftpos: number;
  Eftpos_Liftings: number;
  Electronic_Account_Payments: number;
  Misc: number;
  Car_Wash: number;
  Fuel: number;

  Shift_Total: number;
  Levy: number;
  Kms: number;
  Paid_Kms: number;
  Unpaid_Kms: number;
  CPK: number;
  Total_Lifting_Value: number;
  Number_Of_Chairs: number;
  Driver_Lifting_Value: number;
  Commission_Driver: number;
  Deductions: number;
  Average_Fare: number;
  Net_Payin: number;
  Net_Driver_Income: number;
  Calculator_Modal_Visible: boolean;
  Indicator: boolean;
  Search_Date: string;
  cabCount: number;

  //View Records
  totalrecords: number;
  start_date: string;
  start_day: string;
  finish_day: string;
  finish_date: string;
  sorryAlert: boolean;
  show2Alert: boolean;

  //display table
  nametable: any[];
  total: total;
  table: any[];
  tableNameData: string[];
  datatotal: string[];
  liftingdata: string[];
  Deductdata: string[];
  done: boolean;
  usingservice: boolean;
  tableData: tableData[][];
};

export const initialValues = {
  //subscription
  purchased: false,
  products: {},
  checking: false,
  ShowAlert: false,

  //main
  Record_id: 0,
  Number_Of_Entries: 0,

  //Home Screen Modal
  modalVisible: true,
  Name: '',
  showAlert: false,
  Week_Ending_Date: '',
  Week_Ending_Day: '',

  //Lifting Modal
  Gov_Lifting_Fee: 0,
  Driver_Share_In_LiftingFee: 0,
  Gov_Levy: 0,
  Driver_Comm_Rate: 0,
  Company_Comm_Rate: 0,

  Lifting_Modal_Visible: false,
  Shift: '',
  Taxi: '',
  Rego: '',
  Cab_Data: [],
  Rego_Modal: false,
  Current_Date: '',
  Date: '',
  Day: '',
  Hours_Worked: 0,
  Insurance: 0,
  Jobs_Done: 0,
  Levy: 0,
  Meter_Start: 0,
  Meter_Finish: 0,
  Shift_Total: 0,
  Km_Start: 0,
  Km_Finish: 0,
  Kms: 0,
  Paidkm_Start: 0,
  Paidkm_Finish: 0,
  Paid_Kms: 0,
  Unpaid_Kms: 0,
  CPK: 0,
  Number_Of_Manual_Liftings: 0,
  Manual_Lifting_Value: 0,
  Total_Manual_MPTP31_And_MPTP_Values: 0,
  M3_Dockets: 0,
  Eftpos: 0,
  Eftpos_Liftings: 0,
  Electronic_Account_Payments: 0,
  Misc: 0,
  Car_Wash: 0,
  Fuel: 0,
  Total_Lifting_Value: 0,
  Number_Of_Chairs: 0,
  Driver_Lifting_Value: 0,
  Commission_Driver: 0,
  Deductions: 0,
  Average_Fare: 0,
  Net_Payin: 0,
  Net_Driver_Income: 0,
  Calculator_Modal_Visible: false,
  Indicator: false,
  Search_Date: '',
  cabCount: 50,

  //View Records
  totalrecords: 0,
  start_date: '',
  start_day: '',
  finish_day: '',
  finish_date: '',
  sorryAlert: false,
  show2Alert: false,

  // display report
  nametable: [],
  table: [],
  total: {},
  tableNameData: [],
  datatotal: [],
  liftingdata: [],
  Deductdata: [],
  done: false,
  usingservice: false,
  tableData: [],
};

export const refreshValues = {
  Lifting_Modal_Visible: false,
  Shift: '',
  Taxi: '',
  Rego: '',
  Cab_Data: [],
  Rego_Modal: false,
  Current_Date: '',
  Date: '',
  Day: '',
  Hours_Worked: 0,
  Insurance: 0,
  Jobs_Done: 0,
  Levy: 0,
  Meter_Start: 0,
  Meter_Finish: 0,
  Shift_Total: 0,
  Km_Start: 0,
  Km_Finish: 0,
  Kms: 0,
  Paidkm_Start: 0,
  Paidkm_Finish: 0,
  Paid_Kms: 0,
  Unpaid_Kms: 0,
  CPK: 0,
  Number_Of_Manual_Liftings: 0,
  Manual_Lifting_Value: 0,
  Total_Manual_MPTP31_And_MPTP_Values: 0,
  M3_Dockets: 0,
  Eftpos: 0,
  Eftpos_Liftings: 0,
  Electronic_Account_Payments: 0,
  Misc: 0,
  Car_Wash: 0,
  Fuel: 0,
  Total_Lifting_Value: 0,
  Number_Of_Chairs: 0,
  Driver_Lifting_Value: 0,
  Commission_Driver: 0,
  Deductions: 0,
  Average_Fare: 0,
  Net_Payin: 0,
  Net_Driver_Income: 0,
  Calculator_Modal_Visible: false,
  Indicator: false,
  Search_Date: '',
};

export type Property =
  | 'Eftpos'
  | 'Total_Manual_MPTP31_And_MPTP_Values'
  | 'M3_Dockets'
  | 'Electronic_Account_Payments'
  | 'Driver_Lifting_Value'
  | 'Car_Wash'
  | 'Fuel'
  | 'Misc'
  | 'Gov_Lifting_Fee'
  | 'Driver_Share_In_LiftingFee'
  | 'Gov_Levy'
  | 'Driver_Comm_Rate'
  | 'Hours_Worked'
  | 'Insurance'
  | 'Jobs_Done'
  | 'Levy'
  | 'Meter_Start'
  | 'Meter_Finish'
  | 'Shift_Total'
  | 'Km_Start'
  | 'Km_Finish'
  | 'Kms'
  | 'Paidkm_Start'
  | 'Paidkm_Finish'
  | 'Paid_Kms'
  | 'Unpaid_Kms'
  | 'CPK'
  | 'Eftpos'
  | 'Eftpos_Liftings'
  | 'Number_Of_Manual_Liftings'
  | 'Total_Manual_MPTP31_And_MPTP_Values'
  | 'M3_Dockets'
  | 'Electronic_Account_Payments'
  | 'Misc'
  | 'Car_Wash'
  | 'Fuel'
  | 'Total_Lifting_Value'
  | 'Number_Of_Chairs'
  | 'Driver_Lifting_Value'
  | 'Commission_Driver'
  | 'Deductions'
  | 'Average_Fare'
  | 'Net_Payin'
  | 'Net_Driver_Income';

type InputItem = {
  title: string;
  name: Property;
  placeholder: string;
};
export const liftingInputs: InputItem[] = [
  {
    title: 'Lifting Total',
    name: 'Gov_Lifting_Fee',
    placeholder: '0.00',
  },
  {
    title: 'Lifting Driver',
    name: 'Driver_Share_In_LiftingFee',
    placeholder: '0.00',
  },
  {title: 'Levy', name: 'Gov_Levy', placeholder: '0.00'},
  {
    title: 'Driver Commission Rate %',
    name: 'Driver_Comm_Rate',
    placeholder: '00',
  },
];

export const inputs: InputItem[] = [
  {title: 'Working Hours', name: 'Hours_Worked', placeholder: '0'},
  {title: 'Insurance', name: 'Insurance', placeholder: '0.00'},
  {title: 'Jobs Done', name: 'Jobs_Done', placeholder: '0'},
  {title: 'Meter Start', name: 'Meter_Start', placeholder: '0.00'},
  {title: 'Meter Finish', name: 'Meter_Finish', placeholder: '0.00'},
  {title: 'KM Start', name: 'Km_Start', placeholder: '0.00'},
  {title: 'KM Finish', name: 'Km_Finish', placeholder: '0.00'},
  {title: 'Paid KM Start', name: 'Paidkm_Start', placeholder: '0.00'},
  {title: 'Paid KM Finish', name: 'Paidkm_Finish', placeholder: '0.00'},
  {title: 'EFTPOS', name: 'Eftpos', placeholder: '0.00'},
  {title: 'EFTPOS Liftings', name: 'Eftpos_Liftings', placeholder: '00'},
  {
    title: 'Number of Manuals',
    name: 'Number_Of_Manual_Liftings',
    placeholder: '00',
  },
  {
    title: 'Manuals Value $',
    name: 'Total_Manual_MPTP31_And_MPTP_Values',
    placeholder: '0.00',
  },
  {title: 'M3 Dockets', name: 'M3_Dockets', placeholder: '0.00'},
  {
    title: 'Electronic Payments',
    name: 'Electronic_Account_Payments',
    placeholder: '0.00',
  },
  {title: 'Misc', name: 'Misc', placeholder: '0.00'},
  {title: 'Car Wash', name: 'Car_Wash', placeholder: '0.00'},
  {title: 'Fuel', name: 'Fuel', placeholder: '0.00'},
];

export const payinInputs: InputItem[] = [
  {title: 'Total Meter', name: 'Shift_Total', placeholder: '0.00'},
  {title: 'Levy', name: 'Levy', placeholder: '0.00'},
  {title: 'Total KMs', name: 'Kms', placeholder: '0.00'},
  {title: 'Total Paid KM', name: 'Paid_Kms', placeholder: '0.00'},
  {title: 'Unpaid KM', name: 'Unpaid_Kms', placeholder: '0.00'},
  {title: 'CPK', name: 'CPK', placeholder: '0.00'},
  {
    title: 'Total Number of Liftings',
    name: 'Number_Of_Chairs',
    placeholder: '00',
  },
  {
    title: 'Driver Lifting Fee',
    name: 'Driver_Lifting_Value',
    placeholder: '0.00',
  },
  {title: 'Commission Driver', name: 'Commission_Driver', placeholder: '00'},
  {title: 'Deductions', name: 'Deductions', placeholder: '0.00'},
  // {title: 'Average Fare', name: 'Average_Fare', placeholder: '0.00'},
  {title: 'Net Pay-In', name: 'Net_Payin', placeholder: '0.00'},
  // {
  //   title: 'Net Driver Income',
  //   name: 'Net_Driver_Income',
  //   placeholder: '0.00',
  // },
];
