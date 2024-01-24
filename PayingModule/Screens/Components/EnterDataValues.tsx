import {useRef} from 'react';
import {TextInput} from 'react-native';

export const useInputRefs = () => {
  const refs = {
    Hours_Worked: useRef<TextInput>(null),
    Insurance: useRef<TextInput>(null),
    Jobs_Done: useRef<TextInput>(null),
    meterTotal: useRef<TextInput>(null),
    Kms: useRef<TextInput>(null),
    Paid_Kms: useRef<TextInput>(null),
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
  Number_Of_Entries: number;
  //subscription
  purchased: boolean;
  products: {};
  checking: boolean;
  ShowAlert: boolean;

  //Home Screen Modal
  modalVisible: boolean;
  WEid: number;
  Name: string;
  showAlert: boolean;
  Week_Ending_Date: string;
  Week_Ending_Day: string;

  //Lifting Modal
  liftingId: number;
  Lifting_Modal_Visible: boolean;
  Gov_Lifting_Fee: number;
  Driver_Share_In_LiftingFee: number;
  Gov_Levy: number;
  Driver_Comm_Rate: number;
  Company_Comm_Rate: number;

  //main
  Record_id: number;
  Shift: string;

  cabId: number;
  Taxi: string;
  Cab_Data: Cab[];
  Rego_Modal: boolean;

  Current_Date: string;
  Date: string;
  Day: string;
  Hours_Worked: number;
  Insurance: number;
  Jobs_Done: number;
  meterTotal: number;
  Kms: number;
  Paid_Kms: number;
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
  Unpaid_Kms: number;
  CPK: number;
  Total_Lifting_Value: number;
  Number_Of_Chairs: number;
  Driver_Lifting_Value: number;
  Commission_Driver: number;
  Commission_Company: number;
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
  liftingdata: number[];
  Deductdata: string[];
  done: boolean;
  usingservice: boolean;
  tableData: tableData[][];
};

export const initialValues = {
  Number_Of_Entries: 0,
  //subscription
  purchased: false,
  products: {},
  checking: false,
  ShowAlert: false,

  //Home Screen Modal
  modalVisible: true,
  WEid: 0,
  Name: '',
  showAlert: false,
  Week_Ending_Date: '',
  Week_Ending_Day: '',

  //Lifting Modal
  liftingId: 0,
  Gov_Lifting_Fee: 0,
  Driver_Share_In_LiftingFee: 0,
  Gov_Levy: 0,
  Driver_Comm_Rate: 0,
  Company_Comm_Rate: 0,
  Lifting_Modal_Visible: false,

  //main
  Record_id: 0,
  Shift: '',

  cabId: 0,
  Taxi: '',
  Cab_Data: [],
  Rego_Modal: false,

  Current_Date: '',
  Date: '',
  Day: '',
  Hours_Worked: 0,
  Insurance: 0,
  Jobs_Done: 0,
  Levy: 0,
  meterTotal: 0,
  Shift_Total: 0,
  Kms: 0,
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
  Commission_Company: 0,
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
  meterTotal: 0,
  Kms: 0,
  Paid_Kms: 0,
  Shift_Total: 0,
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

export type Property1 =
  | 'Gov_Lifting_Fee'
  | 'Driver_Share_In_LiftingFee'
  | 'Gov_Levy'
  | 'Driver_Comm_Rate';
type Input1 = {
  title: string;
  name: Property1;
  placeholder: string;
};
export const liftingInputs: Input1[] = [
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

export type Property2 =
  | 'Hours_Worked'
  | 'Insurance'
  | 'Jobs_Done'
  | 'meterTotal'
  | 'Kms'
  | 'Paid_Kms'
  | 'Eftpos'
  | 'Eftpos_Liftings'
  | 'Number_Of_Manual_Liftings'
  | 'Total_Manual_MPTP31_And_MPTP_Values'
  | 'M3_Dockets'
  | 'Electronic_Account_Payments'
  | 'Misc'
  | 'Car_Wash'
  | 'Fuel';
type Input2 = {
  title: string;
  name: Property2;
  placeholder: string;
};
export const inputs: Input2[] = [
  {title: 'Working Hours', name: 'Hours_Worked', placeholder: '0'},
  {title: 'Insurance', name: 'Insurance', placeholder: '0.00'},
  {title: 'Jobs Done', name: 'Jobs_Done', placeholder: '0'},
  {title: 'Meter Total', name: 'meterTotal', placeholder: '0.00'},
  {title: 'KMs', name: 'Kms', placeholder: '0.00'},
  {title: 'Paid KMs', name: 'Paid_Kms', placeholder: '0.00'},
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

export type Property3 =
  | 'Shift_Total'
  | 'Levy'
  | 'Unpaid_Kms'
  | 'CPK'
  | 'Number_Of_Chairs'
  | 'Driver_Lifting_Value'
  | 'Commission_Driver'
  | 'Deductions'
  | 'Net_Payin';

type Input3 = {
  title: string;
  name: Property3;
  placeholder: string;
};
export const payinInputs: Input3[] = [
  {title: 'Shift Total', name: 'Shift_Total', placeholder: '0.00'},
  {title: 'Levy', name: 'Levy', placeholder: '0.00'},
  {title: 'Unpaid KM', name: 'Unpaid_Kms', placeholder: '0.00'},
  {title: 'CPK', name: 'CPK', placeholder: '0.00'},
  {
    title: 'Total Liftings',
    name: 'Number_Of_Chairs',
    placeholder: '00',
  },
  {
    title: 'Driver Lifting Fee',
    name: 'Driver_Lifting_Value',
    placeholder: '0.00',
  },
  {title: 'Commission Driver', name: 'Commission_Driver', placeholder: '0.00'},
  {title: 'Deductions', name: 'Deductions', placeholder: '0.00'},
  {title: 'Net Pay-In', name: 'Net_Payin', placeholder: '0.00'},
];
