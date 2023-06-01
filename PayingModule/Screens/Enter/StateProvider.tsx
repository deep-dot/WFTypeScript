/* eslint-disable react/react-in-jsx-scope */
import {useReducer, createContext, ReactNode, useState} from 'react';
import {initialValues} from './EnterDataValues';
import {UpdateData} from './dbUtility';

// export const initialState = {
//   date: '',
//   day: '',
//   shift: '',
//   taxi: '',
//   hours: 0,
//   numberOfJobs: 0,
//   totalLevy: 0,
//   cpk: 0,
//   insuranceFee: 0,
//   meter1: 0,
//   meter2: 0,
//   totalMeter: 0,
//   km1: 0,
//   km2: 0,
//   resultKm: 0,
//   paidKm1: 0,
//   paidKm2: 0,
//   resultPaidKm: 0,
//   unpaidKm: 0,
//   eftpos: 0,
//   eftposLifting: 0,
//   cc: 0,
//   manualMptp: 0,
//   govSubManual31: 0,
//   numberOfManualLifting: 0,
//   manualLifting: 0,
//   chargeAuthority: 0,
//   misc: 0,
//   carWash: 0,
//   accountFuel: 0,
//   totalLifting: 0,
//   numberOfChairs: 0,
//   gtnLFee: 0,
//   driverLFee: 0,
//   deductions: 0,
//   commissionDriver: 0,
//   commissionGtn: 0,
//   fare: 0,
//   netPayIn: 0,
// };
// export interface State {
//   date: string;
//   day: string;
//   shift: string;
//   taxi: string;
//   hours: number;
//   numberOfJobs: number;
//   totalLevy: number;
//   cpk: number;
//   insuranceFee: number;
//   meter1: number;
//   meter2: number;
//   totalMeter: number;
//   km1: number;
//   km2: number;
//   resultKm: number;
//   paidKm1: number;
//   paidKm2: number;
//   resultPaidKm: number;
//   unpaidKm: number;
//   eftpos: number;
//   eftposLifting: number;
//   cc: number;
//   manualMptp: number;
//   govSubManual31: number;
//   numberOfManualLifting: number;
//   manualLifting: number;
//   chargeAuthority: number;
//   misc: number;
//   carWash: number;
//   accountFuel: number;
//   totalLifting: number;
//   numberOfChairs: number;
//   gtnLFee: number;
//   driverLFee: number;
//   deductions: number;
//   commissionDriver: number;
//   commissionGtn: number;
//   fare: number;
//   netPayIn: number;
// }

interface Cab {
  Cab: string;
}
type FormValues = {
  [key: string]: string | boolean | string[] | Cab[];
  cabData: Cab[];
  //Jobs: string;
};

export type Action =
  | {type: 'REFRESH'; payload: any}
  | {type: 'UPDATE'; payload: any}
  | {type: 'ERROR'; error: Error};

interface ContextValue {
  state: FormValues;
  dispatch: React.Dispatch<Action>;
  count: number;
  incrementCount: () => void;
  UpdateData: (
    searchByDate: string | number | null | undefined,
  ) => Promise<any>;
}

export const StateContext = createContext<ContextValue | undefined>(undefined);

const reducer = (state: FormValues, action: Action): FormValues => {
  // console.log('action.type==', action.type, state);
  switch (action.type) {
    case 'REFRESH':
      return {...initialValues};
    case 'UPDATE':
      console.log('action.type UPDATE==', action.payload.Jobs);
      console.log('action.type==', {
        ...state,
        numberofJobs: action.payload.Jobs,
      });
      return {...state, ...action.payload};
    case 'ERROR':
      // Here you could return an error state
      // For simplicity, let's just log the error and return the existing state
      console.error(action.error);
      return state;
    default:
      return state;
  }
};

interface Props {
  children: ReactNode;
}
export const StateProvider = ({children}: Props) => {
  const [count, setCount] = useState(0);
  const incrementCount = () => {
    setCount(count + 1);
  };
  const [state, dispatch] = useReducer(reducer, initialValues);
  // console.log('refresh in stateprovider==', state);
  return (
    <StateContext.Provider
      value={{state, dispatch, count, incrementCount, UpdateData}}>
      {children}
    </StateContext.Provider>
  );
};
