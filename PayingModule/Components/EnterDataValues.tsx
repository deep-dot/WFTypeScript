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
    Number_Of_Manual_Liftings: useRef<TextInput>(null),
    Total_Manual_MPTP31_And_MPTP_Values: useRef<TextInput>(null),
    M3_Dockets: useRef<TextInput>(null),
    Eftpos: useRef<TextInput>(null),
    Eftpos_Lifting_Value: useRef<TextInput>(null),
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
  Record_id: number;
  Number_Of_Entries: string;
  //Home Screen Modal
  modalVisible: boolean;
  Name: string;
  showAlert: boolean;
  Week_Ending_Date: string;
  Week_Ending_Day: string;

  //Lifting Modal
  Gov_Lifting_Fee: string;
  Driver_Share_In_LiftingFee: string;
  Gov_Levy: string;
  Driver_Comm_Rate: string;
  Company_Comm_Rate: string;

  Cab_Data: Cab[];
  Lifting_Modal_Visible: boolean;
  Shift: string;
  Taxi: string;
  Rego: string;
  Rego_Modal: boolean;
  Current_Date: string;
  Date: string;
  Day: string;
  Hours_Worked: string;
  Insurance: string;
  Jobs_Done: string;
  Levy: string;
  Meter_Start: string;
  Meter_Finish: string;
  Shift_Total: string;
  Km_Start: string;
  Km_Finish: string;
  Kms: string;
  Paidkm_Start: string;
  Paidkm_Finish: string;
  Paid_Kms: string;
  Unpaid_Kms: string;
  CPK: string;
  Number_Of_Manual_Liftings: string;
  Manual_Lifting_Value: string;
  Total_Manual_MPTP31_And_MPTP_Values: string;
  M3_Dockets: string;
  Eftpos: string;
  Eftpos_Lifting_Value: string;
  Electronic_Account_Payments: string;
  Misc: string;
  Car_Wash: string;
  Fuel: string;
  Total_Lifting_Value: string;
  Number_Of_Chairs: string;
  Driver_Lifting_Value: string;
  Commission_Driver: string;
  Deductions: string;
  Average_Fare: string;
  Net_Payin: string;
  Net_Driver_Income: string;
  Calculator_Modal_Visible: boolean;
  Indicator: boolean;
  Search_Date: string;
  cabCount: number;

  //View Records
  totalrecords: string;
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
  Record_id: 0,
  Number_Of_Entries: '',

  //Home Screen Modal
  modalVisible: true,
  Name: '',
  showAlert: false,
  Week_Ending_Date: '',
  Week_Ending_Day: '',

  //Lifting Modal
  Gov_Lifting_Fee: '',
  Driver_Share_In_LiftingFee: '',
  Gov_Levy: '',
  Driver_Comm_Rate: '',
  Company_Comm_Rate: '',

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
  Manual_Lifting_Value: '',
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
  Search_Date: '',
  cabCount: 50,

  //View Records
  totalrecords: '0',
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
  Manual_Lifting_Value: '',
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
  Search_Date: '',
};

export type Property =
  | 'Eftpos'
  | 'Eftpos_Lifting_Value'
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
  | 'Number_Of_Manual_Liftings'
  | 'Total_Manual_MPTP31_And_MPTP_Values'
  | 'M3_Dockets'
  | 'Eftpos'
  | 'Eftpos_Lifting_Value'
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

export const DdeductionsProperties: Property[] = [
  'Eftpos',
  'Eftpos_Lifting_Value',
  'Total_Manual_MPTP31_And_MPTP_Values',
  'M3_Dockets',
  'Electronic_Account_Payments',
  'Driver_Lifting_Value',
];

export const DdeductionsAdditionalProperties: Property[] = [
  'Car_Wash',
  'Fuel',
  'Misc',
];

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
  {
    title: 'Number of Manual Liftings',
    name: 'Number_Of_Manual_Liftings',
    placeholder: '0.00',
  },
  {
    title: 'Total of MPTP Dockets',
    name: 'Total_Manual_MPTP31_And_MPTP_Values',
    placeholder: '0.00',
  },
  {title: 'M3 Dockets', name: 'M3_Dockets', placeholder: '0.00'},
  {title: 'EFTPOS', name: 'Eftpos', placeholder: '0.00'},
  {title: 'EFTPOS Lifting', name: 'Eftpos_Lifting_Value', placeholder: '0.00'},
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
  {title: 'Total Lifting', name: 'Total_Lifting_Value', placeholder: '0.00'},
  {title: 'Number of Chairs', name: 'Number_Of_Chairs', placeholder: '00'},
  {
    title: 'Driver Lifting Fee',
    name: 'Driver_Lifting_Value',
    placeholder: '0.00',
  },
  {title: 'Commission Driver', name: 'Commission_Driver', placeholder: '00'},
  {title: 'Deductions', name: 'Deductions', placeholder: '0.00'},
  {title: 'Average Fare', name: 'Average_Fare', placeholder: '0.00'},
  {title: 'Net Pay-In', name: 'Net_Payin', placeholder: '0.00'},
  {
    title: 'Net Driver Income',
    name: 'Net_Driver_Income',
    placeholder: '0.00',
  },
];
